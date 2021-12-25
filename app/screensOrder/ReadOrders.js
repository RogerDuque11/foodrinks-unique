import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { FAB  } from 'react-native-elements'
import _ from "lodash"
import  AsyncStorage from '@react-native-async-storage/async-storage'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import ButtonGroup from '../components/ButtonGroup'
import RenderItemOrder from './RenderItemOrder'

import FBController from  '../controllers/FirebaseController'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat


const ReadOrdersScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()

    const [ isLoading, setLoading ] = useState(route.params.isLoading)
    const [ data, setData ] = useState([])
    const [ actives, setActives ] = useState([])
    const [ finisheds, setFinisheds ] = useState([])
    const [ index, setIndex] = useState(0)
    const buttons = [ trans('PENDINGS'), trans('FINISHED') ]
    
    const date = DateFormat.date(new Date())
    const [ dateOrders, setDateOrders] = useState(Constants.CURRENT.DATE ? Constants.CURRENT.DATE : date)

    async function getData(){
        const activess = await AsyncStorage.getItem('@erretech_foodrinks_orders_actives')
        const finishedss = await AsyncStorage.getItem('@erretech_foodrinks_orders_finisheds')
        console.log(JSON.parse(activess))
        activess && setActives(JSON.parse(activess))
        finisheds && setFinisheds(JSON.parse(finishedss))
        return true
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('orders'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateOrder' )}/> )
        });
    }, [navigation]);
    
    useEffect( () => {
        getData()
    }, [ isLoading])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    const callbackItem = (action, item) => {
        switch (action) {
            case 'EDIT': 
                launchScreen('UpdateOrder', { order: item }) 
                break
            case 'UPDATED': 
                FBController.FS_Update('ORDERS', item.code, {state: item.state}, {REF: 'LOCALS', CHILD: LOCAL.code})
                break
            /* case 'DELETE': 
                FBController.FS_Update('ORDERS', item.code, item, {REF: 'LOCALS', CHILD: LOCAL.code})
                break */
            default: break
        }
    }

    const callbackList = (value, index) => {
        launchScreen('UpdateOrder', { order: value })
    }

    return ( 
        <>
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={buttons} />
            <ScrollView style={[ styles.paddingTiny_X ]}>
                <View style={[ styles.marginTiny_T, styles.marginLarge_B ]}>
                    { Object.entries(index === 0 ? actives : finisheds).map(([index, item])  => (
                        <RenderItemOrder key={index} props={{ item, callbackItem, index }} />
                    )) }
                </View>
            </ScrollView>  
            <FAB 
                onPress={()=>launchScreen('CreateOrder')}
                size='large' 
                color={colors.primary} 
                icon={{ name: "add", size: size.iconSmall, color: "white" }}
                placement='right' />
        </>
    )
}



export default ReadOrdersScreen