import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import ButtonGroup from '../components/ButtonGroup'
import RenderItemPlace from './RenderItemPlace'

import FBController from  '../controllers/FirebaseController'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat


const ReadOrdersPlaceScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [actives, setActives] = useState([])
    const [finisheds, setFinisheds] = useState([])
    const [index, setIndex] = useState(0)
    const buttons = [trans('PENDINGS'), trans('FINISHED')]
    
    const date = DateFormat.date(new Date())
    const [ dateOrders, setDateOrders] = useState(Constants.CURRENT.DATE ? Constants.CURRENT.DATE : date)

    function getData(){
        var props = {
            REFS: { LOCALS: LOCAL.code, ORDERS: '' },
            QUERIES: { 0: ['date', '==', dateOrders] },
            ORDER: { code: 'desc' },
            LIMIT: 1
        }
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoading(true)
            var actives = []
            var finisheds = []
            if (PROFILE.placeCode) {
                snapshot.forEach(doc =>{ 
                    var order = doc.data()
                    Object.entries(order.products).forEach(([key, product])=>{
                        if(PROFILE.placeCode === product.placeCode){
                            addToStateList(order, finisheds, actives)
                        }  
                    })
                })
            } else {
                snapshot.forEach(doc =>{ 
                    var order = doc.data()
                    addToStateList(order, finisheds, actives)
                })
            }
            setActives(actives)
            setFinisheds(finisheds)
            setData(index === 0 ? actives : finisheds)
            setLoading(false)
        })
    }
    
    useEffect(() => {
        const read = getData()
        return () => read()
    }, [ ])


    const addToStateList = (order, finisheds, actives) => {
        order.state === 'FINISHED' || order.state === 'DELIVERED' || order.state === 'TERMINATED'
        || order.state === 'DISPATCHED' ? finisheds[order.code] = order 
        : order.state === 'CANCELED' || order.state === 'DELETED' || order.state === 'PENDING' ? null 
        : actives[order.code] = order 
    }
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    const callbackItem = (action, item) => {
        switch (action) {
            case 'EDIT': 
                launchScreen('UpdateOrder', { order: item }) 
                break
            case 'UPDATED': 
                FBController.FS_Update('ORDERS', item.code, {products: item.products, state: item.state}, {REF: 'LOCALS', CHILD: LOCAL.code})
                break
            /* case 'DELETE': 
                FBController.FS_Update('ORDERS', item.code, item, {REF: 'LOCALS', CHILD: LOCAL.code})
                break */
            default: break
        }
    }
 
    return ( 
        <>
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={buttons} />
            <ScrollView 
                style={[ styles.paddingTiny_X ]}
                refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> }>
                <View style={[ styles.marginTiny_T ]}>
                    { Object.entries(index === 0 ? actives : finisheds).map(([index, item])  => (
                        <RenderItemPlace key={index} props={{ item, callbackItem }} />
                    )) }
                </View>
            </ScrollView>
        </>
    )
}


export default ReadOrdersPlaceScreen