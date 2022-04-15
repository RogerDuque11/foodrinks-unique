import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView, View, Text } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import LoadingScreen from '../components/LoadingScreen'
import HomeContrat from './componentsHome/HomeContrat'
import HomeLocals from './componentsHome/HomeLocals'


const HomeScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY, PARTNER} = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const [isLoading, setLoading] = useState(false)
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('home'),
        });
    }, [navigation]);
    
    useEffect(() => {
    }, [ COMPANY, PARTNER ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    const callbackItem = (action, value, index) => {
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <ScrollView 
            //refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> }
            style={[  ]}>
            <View style={[ styles.marginSmall ]}>
                <HomeContrat props={{ navigation, callbackItem }} />
                {/* {
                    PARTNER && COMPANY ? */}
                    <HomeLocals props={{ navigation, callbackItem }} />
                {/*     : null
                } */}
                
            </View>
        </ScrollView>
    )
}




export default HomeScreen