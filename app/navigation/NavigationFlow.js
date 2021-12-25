import React, {useState, useEffect, useReducer, useMemo, createContext} from 'react';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements' ;

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants";
import Routes from './Routes'
import LoadingScreen from '../components/LoadingScreen'
import EmptyScreen from '../screensOthers/EmptyScreen'

const consol = Constants.CONSOLE

const AuthContext = createContext();
const Stack = createStackNavigator();


const NavigationFlow = ({ navigation }) => {
  const { theme } = CurrentScheme()
  const [profile, setProfile] = useState({usertype: {}, position: {} })
  const routes = new Routes(AuthContext)

  const updateProfile = (token, messagge1, messagge2) => {
    setProfile(token)
    Constants.SESION.PROFILE = token ? token : { } 
    console.log(consol.FgCyan, messagge1, consol.Reset, messagge2)
  }

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          updateProfile(action.token, 'TOKEN RESTORED', ! action.token ? null : action.token.email)
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'LOG_IN':
          updateProfile(action.token, 'TOKEN ADDED', 'LOG_IN')
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'LOG_OUT':
          updateProfile(null, 'TOKEN REMOVED', 'LOG_OUT ')
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    //await checkMultiPermissions()
    const bootstrapAsync = async () => {
      let userToken = null;
      try {
        const promise = await AsyncStorage.getItem('@erretech_foodrinks_user')
        userToken = promise ? JSON.parse(promise) : null
      } catch (error) {
        console.error('UseEffect NavigationFlow:\n', 'Restoring token failed', error)
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const setToken = async (value) => {
    try {
      await AsyncStorage.setItem('@erretech_foodrinks_user', value);
    } catch (error) {
      console.error('error setToken: ', error)
    }
  }

  const authContext = useMemo( () => ({
    LOG_IN: async data => {
      await setToken(JSON.stringify(data))
      dispatch({ type: 'LOG_IN', token: data });
    },
    LOG_OUT: async data => { 
      await setToken(data)
      dispatch({ type: 'LOG_OUT', token: null })
    },
    signUp: async data => {
      dispatch({ type: 'LOG_IN', token: 'dummy-auth-token' });
    },
  }), [] );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer
        theme={theme}
        initialRouteName={'Home'}
        shifting={false}
        options={{  }} >

        <ThemeProvider theme={theme}> 
          <Stack.Navigator screenOptions={{ /* presentation: 'modal' , headerTransparent: true */}} >
          {
            state.isLoading ? ( // buscando token
              <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
            ) : state.userToken === null || state.userToken === '' ? ( // no se encontrso un token, no se ha iniciado sesion
              routes.NOAUTHSCREENS
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'WAITER' ? ( 
              routes.WAITERSCREENS
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'COOK' ? ( 
              routes.COOKSCREEN
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'DELIVERY' ? ( 
              routes.DELIVERYSCREEN
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'ADMIN' && !profile.localCode ? ( 
              routes.ADMINCOMPANYSCREENS
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'ADMIN' && profile.localCode && !profile.placeCode ? ( 
              routes.ADMINLOCALSCREENS
            ) : profile.usertype === 'EMPLOYEE' && profile.position === 'ADMIN' && profile.localCode && profile.placeCode ? ( 
              routes.ADMINSCREENS
            ) : profile.usertype === 'PARTNER' ? ( 
              routes.PARTNERSCREENS
            ) : profile.usertype === 'ROOT' ? ( 
              routes.ROOTSCREENS
            ) : routes.NOAUTHSCREENS
            
          }
          </Stack.Navigator>
        </ThemeProvider> 
        
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
//<Stack.Screen name="Empty" component={EmptyScreen} />
const Loading = () => {
  const { colors } =  CurrentScheme() 
    return (
      <LoadingScreen size={'large'} color={colors.primary} />
    );
};

export default NavigationFlow
