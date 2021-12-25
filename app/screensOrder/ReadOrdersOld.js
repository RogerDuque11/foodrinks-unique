import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { FAB  } from 'react-native-elements'
import _ from "lodash"

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

    const [ isLoading, setLoading ] = useState(true)
    const [ data, setData ] = useState([])
    const [ actives, setActives ] = useState([])
    const [ finisheds, setFinisheds ] = useState([])
    const [ index, setIndex] = useState(0)
    const buttons = [ trans('PENDINGS'), trans('FINISHED') ]
    
    const date = DateFormat.date(new Date())
    const [ dateOrders, setDateOrders] = useState(Constants.CURRENT.DATE ? Constants.CURRENT.DATE : date)

    function getData(){
        var props = {
            REFS: { LOCALS: LOCAL.code, ORDERS: '' },
            QUERIES: {  0: ['date', '==', dateOrders] },
            ORDER: { code: 'desc' },
            LIMIT: 1
        }
        
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoading(true)
            var actives = []
            var finisheds = []
            snapshot.forEach((doc) => {
                var order = doc.data()
                order.state === 'FINISHED' || order.state === 'CANCELED' || order.state === 'DELETED' ? 
                finisheds.push(order) : actives.push(order)
            });
            //setActives(_.orderBy(actives, ['code'], ['desc']))
            //setFinisheds(_.orderBy(finisheds, ['code'], ['desc']))
            setActives(actives)
            setFinisheds(finisheds)
            setData(index === 0 ? actives : finisheds)
            setLoading(false)
        }, (error) => {
            Constants.NOTIFY('ERROR', error.code, 'ReadOrders/getData', error.message)
            }
        )
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('orders'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateOrder' )}/> )
        });
    }, [navigation]);
    
    useEffect( () => {
        const readOrders = getData()
        return () => readOrders()
    }, [ ])
    
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