import React, { useState, useLayoutEffect, useEffect } from 'react'
import { View, ScrollView } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import Icon from '../components/Icon'

import OrderType from './componentsOrder/OrderType'
import OrderCustomer from './componentsOrder/OrderCustomer'
import OrderPayment from './componentsOrder/OrderPayment'
import OrderLetterMenu from './componentsOrder/OrderLetterMenu'
import OrderListProducts from './componentsOrder/OrderListProducts'
import OrderProduct from './componentsOrder/OrderProduct'

import FBController from  '../controllers/FirebaseController'
import Order from  '../models/Order'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateOrderScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans, states, substates } = CurrentScheme()
    const [ isLoading, setLoading ] = useState(false)
    const [ order, setOrder ] = useState(new Order())

    const [ type, setType ] = useState('')
    const [ state, setState ] = useState('')

    const [ visibleProduct, setVisibleProduct ] = useState(false)
    const [ product, setProduct ] = useState(null)
    const [ products, setProducts ] = useState([])

    var date = new Date()
    order.code = DateFormat.code(date)
    order.date = DateFormat.date(date)
    order.hour = DateFormat.timeShort(date)
    order.state = 'PENDING'
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('orderCreate'), left, right }}  
            onPressLeft={ ()=>{ navigation.goBack(null) } }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation])

    useEffect(() => {
        console.log('render createOrder')
    }, [ isLoading ])

    const onPressCreate = async () => {
        var exceptionsValidate = validation(order, trans)
        if( ! exceptionsValidate && LOCAL.code ){
            try {
                order.deliveryPrice = order.deliveryPrice ? parseInt(order.deliveryPrice) : 0
                delete order['setValuesFromObject']
                //console.log(order)
                await FBController.FS_Create('ORDERS', order.code, order, {REF: 'LOCALS', CHILD: LOCAL.code})
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateOrder/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR IMPUESTO:\n' + Object.values(exceptionsValidate))
        }
    }

    const showProduct = (value) => {
        setProduct({...value})
        setVisibleProduct(true)
    }

    const updateList = (product) => {
        if(product.quantity === 0){
            delete products[product.code]
            delete order.products[product.code]
        }else{
            product.quantity = product.quantity ? product.quantity : 1
            products[product.code] = product
            order.products[product.code] = product
        }
        setProduct(null)
        setProducts(products => ({...products}))
    }

    return (
        <>
        { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
        <View style={[  styles.container, styles.bgTheme, styles.alignCenter]} >
            <ScrollView style={[ styles.column, styles.widthForm, styles.paddingTiny_X, styles.paddingTiny_B ]}>
                <OrderType props={{ order, type, setType, state, setState }} />
                <OrderCustomer props={{ order, type }} />
                <OrderPayment props={{ order, type, products }} />
                <OrderLetterMenu props={{ callback:showProduct }} />
                <OrderListProducts props={{ products, callback:showProduct }} />
                {       
                    !visibleProduct || !product ? null :
                    <OrderProduct props={{ product, visibleProduct, setVisibleProduct, callback:updateList }} />
                }
            </ScrollView>
        </View>
        </>
    )
}




const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'code' || key === 'customer' || key === 'state' ){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        } else if (key === 'products' && value.length === 0){
           exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    /* if( parseInt(attrs['cash']) === 0 || (parseInt(attrs['cash']) < parseInt(attrs['productsPrice'])) ){
        exep['cash'] = '\n * ' + trans('cash') + ': Insuficiente'
    } */
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateOrderScreen

