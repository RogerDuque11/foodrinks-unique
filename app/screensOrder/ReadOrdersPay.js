import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView, View, Text } from 'react-native'
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import LoadingScreen from '../components/LoadingScreen'
import Icon from '../components/Icon'
import HeaderRight from '../components/HeaderRight'
import RenderItemPay from './RenderItemPay'
import ButtonGroup from '../components/ButtonGroup'

import FBController from  '../controllers/FirebaseController'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat


const ReadOrdersPay = ({route, navigation}) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()

    const [ isLoading, setLoading ] = useState(true)
    const [ finisheds, setFinisheds ] = useState({ places:[], payments:[], letterMenu:[], products:[] })
    const [ pendings, setPendings ] = useState({ places:[], payments:[], letterMenu:[], products:[] })
    const [ canceleds, setCanceleds ] = useState({ places:[], payments:[], letterMenu:[], products:[] })

    const permissions = {
        showCategory: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false,
        showResume: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || 
        PROFILE.position === 'ADMIN' && !PROFILE.placeCode ? true : false,
    }

    const [ index, setIndex ] = useState(0)
    const buttonsState = [ trans('total'), trans('category'), trans('resume') ]
    
    const date = DateFormat.date(new Date())
    const [ dateOrders, setDateOrders] = useState(Constants.CURRENT.DATE ? Constants.CURRENT.DATE : date)

    function getData(){
        setLoading(true)
        var props = {
            REFS: { LOCALS: LOCAL.code, ORDERS: '' },
            QUERIES: {  0: ['date', '==', dateOrders] },
            ORDER: { code: 'desc' },
            LIMIT: 1
        }
        
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoading(true)
            var pendings = { places:[], payments:[], letterMenu:[], products:[] }
            var finisheds = { places:[], payments:[], letterMenu:[], products:[] }
            var canceleds = { places:[], payments:[], letterMenu:[], products:[] }
            snapshot.forEach((doc) => {
                var order = doc.data()
                switch (order.state) {
                    case 'FINISHED':
                        addToStateList(order, finisheds)
                        break;
                    case 'CANCELED':
                        addToStateList(order, canceleds)
                        break;
                    default:
                        addToStateList(order, pendings)
                        break;
                }   
            })            
            setFinisheds(finisheds)
            setPendings(pendings)
            setCanceleds(canceleds)
            setLoading(false)
        }, (error) => {
            Constants.NOTIFY('ERROR', error.code, 'ReadOrdersPay/getData', error.message)
            }
        )
    }

    const addToStateList = (order, currentList) => {

        // INIT CALC DELIVERY
        currentList.places.deliveries = !currentList.places.deliveries ? 
            { value: order.deliveryPrice } : 
            { value: parseInt(currentList.places.deliveries.value) + parseInt(order.deliveryPrice) } 

        currentList.letterMenu.deliveries = currentList.places.deliveries 

        // INIT CALC FOR TO CATEGORY, PLACES AND RESUME
        Object.entries(order.products).forEach(([key, product])=>{
            var currentPrice = product.quantity * (product.priceModify && product.priceModify > 0 ? product.priceModify : product.price)

            currentList.places[product.place] = !currentList.places[product.place] ? 
                { value: currentPrice } : 
                { value: parseInt(currentList.places[product.place].value) + currentPrice }

            currentList.letterMenu[product.letterMenu] = !currentList.letterMenu[product.letterMenu] ? 
                { value: currentPrice } : 
                { value: parseInt(currentList.letterMenu[product.letterMenu].value) + currentPrice }
            
            currentList.products[product.name] = !currentList.products[product.name] ? 
                { quantity: product.quantity, value: currentPrice } : 
                { quantity: parseInt(currentList.products[product.name].quantity) + product.quantity, value: parseInt(currentList.products[product.name].value) + currentPrice }
        })

        // INIT CALC TYPE PAYMENT
        addToPayments(order, currentList.payments)
    }

    const addToPayments = (order, payments) => {
        var typePayment = !order.typePayment ? 'CASH' : order.typePayment
        var cash = order.productsPrice + order.deliveryPrice

        if(order.otherPay && order.otherPay > 0) {
            payments[typePayment] = !payments[typePayment] ? 
                { value: order.otherPay } : 
                { value: parseInt(payments[typePayment].value) + parseInt(order.otherPay) }
            
            cash = cash - order.otherPay
        }
        payments['CASH'] = !payments['CASH'] ? 
            { value: cash } : 
            { value: parseInt(payments['CASH'].value) + parseInt(cash) }
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('orders'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateOrder' )}/> )
        });
    }, [navigation]);
    
    useEffect(() => {
        const readOrders = getData()
        return () => readOrders()
    }, [  ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    return ( 
        <>
        { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
        { permissions.showCategory && !permissions.showResume ?
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={[ trans('total'), trans('category') ]} />
        : !permissions.showCategory && permissions.showResume ?
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={[ trans('total'), trans('resume') ]} />
        : permissions.showCategory && permissions.showResume ?
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={[ trans('total'), trans('category'), trans('resume') ]} />
        : null
        }
            
            <ScrollView 
                style={[ styles.paddingTiny_X ]}
                refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> }
                >
                <View style={[ styles.marginTiny_T, styles.marginLarge_B ]}>
                        {
                            index === 0 ?
                            <>
                            <RenderItemPay props={{label:'total', data:finisheds.payments}} />
                            <RenderItemPay props={{label:'finisheds', data:finisheds.places}} />
                            <RenderItemPay props={{label:'pendings', data:pendings.places}} />
                            <RenderItemPay props={{label:'canceleds', data:canceleds.places}} />
                            </>
                            : index === 1 ? 
                            <>                           
                            <RenderItemPay props={{label:'finisheds', data:finisheds.letterMenu}} />
                            <RenderItemPay props={{label:'pendings', data:pendings.letterMenu}} />
                            <RenderItemPay props={{label:'canceleds', data:canceleds.letterMenu}} /> 
                            </>
                            :
                            <>
                            <RenderItemPay props={{label:'finisheds', data:finisheds.products, left:true}} />
                            <RenderItemPay props={{label:'pendings', data:pendings.products, left:true}} />
                            <RenderItemPay props={{label:'canceleds', data:canceleds.products, left:true}} />
                            </>
                        }

                </View>
                
            </ScrollView>
        </>
    )
}





export default ReadOrdersPay