import React, {useState, useEffect, useLayoutEffect} from 'react'
import { TouchableOpacity, View,Text, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Icon from '../components/Icon'
import LoadingScreen from '../components/LoadingScreen'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const BottomTabs = createBottomTabNavigator();

const BottomTabsNavigator = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans, isWebDesk, theme, scheme} = CurrentScheme()
    const [screens, setScreens] = useState(route.params.screens)
    const [isLoading, setLoading] = useState(true)

    const permissions = {
        selectDate: true
        //selectDate: PROFILE.position && (PROFILE.position === 'COOK' || PROFILE.position === 'DELIVERY') ? false : true,
    }

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'productsLocal'
        const date = Constants.CURRENT.DATE ? Constants.CURRENT.DATE : DateFormat.date(new Date())
        navigation.setOptions({ 
            headerTitle:  permissions.selectDate ? '' : trans(routeName),
            headerRight: ! permissions.selectDate ? null : () => (
                <TouchableOpacity  
                    style={[ styles.paddingTiny_R ]} 
                    onPress={()=>navigation.navigate('OrdersDate', { callbackDate })}>
                    <Text style={[styles.textSmall, {color: colors.text}]}>{date}</Text>
                </TouchableOpacity>
            ),
        })
    }, [navigation, route])
    

    useEffect(() => {
        screens ? setLoading(false) : setLoading(true)
    }, [ route ])

    const callbackDate = (currentDate) => {
        setLoading(true)
        navigation.goBack(null)
        setLoading(false)
    }
    
    return(
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />
        : <BottomTabs.Navigator
            initialRouteName={'Inicio'}
            shifting={false}
            activeColor={colors.text}
            inactiveColor={colors.default}
            tabBarOptions={{
                style: [styles.bgCard, {height: size.headerSize}]
             }}>
            {
                screens ?
                Object.entries(screens).map(([key, props]) => ( 
                    <BottomTabs.Screen
                        key={key}
                        name={key}
                        component={props.component}
                        initialParams={{...props.params }}
                        options={({route}) => ({
                            tabBarLabel: ({ focused }) => (
                                !focused ? null: <Text style={[styles.textMin, styles.uppercase, {marginTop: -4, marginBottom: 4} ]}>{trans(key)}</Text> ),
                            tabBarIcon: ({ focused }) => (
                                <Icon name={props.iconName} library={props.iconLibrary} color={focused ? colors.text : colors.default} size={size.iconSmall} />)
                          })
                        }
                    />
                ))
                : null
            }       
 
        </BottomTabs.Navigator>
    )
}
  


export default BottomTabsNavigator




