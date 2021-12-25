import React, { useState, useLayoutEffect, useEffect} from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'

import OrderType from './componentsOrder/OrderType'
import OrderCustomer from './componentsOrder/OrderCustomer'
import OrderPayment from './componentsOrder/OrderPayment'
import OrderLetterMenu from './componentsOrder/OrderLetterMenu'
import OrderListProducts from './componentsOrder/OrderListProducts'
import OrderProduct from './componentsOrder/OrderProduct'
import OrderOptionsAdmin from './componentsOrder/OrderOptionsAdmin'

import FBController from  '../controllers/FirebaseController'


const UpdateOrderScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, isWebDesk, trans } = CurrentScheme()
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState(JSON.parse(JSON.stringify(route.params.order)))
    const [ update, setUpdate ] = useState(true)

    const [ type, setType ] = useState(copy.type ? copy.type : '')
    const [ state, setState ] = useState(copy.state ? copy.state : '')

    const [ visibleProduct, setVisibleProduct ] = useState(false)
    const [ product, setProduct ] = useState(null)
    const [ products, setProducts ] = useState(JSON.parse(JSON.stringify(route.params.order.products)))
    
    const permissions = {
        admin: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode ) ? true : false,
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode ) ? true : false
    }
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('orderEdit'), left, right }}  
            onPressLeft={ ()=>{ navigation.goBack(null) } }  
            onPressRight={ onPressUpdate } />)
        });
    }, [navigation])

    useEffect(() => {
        if( !update ){ 
            setCopy(JSON.parse(JSON.stringify(route.params.order)))
            setProducts(JSON.parse(JSON.stringify(route.params.order.products)))
            setLoading(false)
        }
    }, [ update ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate && LOCAL.code ){
            try {
                copy.deliveryPrice = copy.deliveryPrice ? parseInt(copy.deliveryPrice) : 0
                setUpdate(false)
                await FBController.FS_Update('ORDERS', copy.code, copy, {REF: 'LOCALS', CHILD: LOCAL.code})
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateOrder/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR ORDEN:\n' + Object.values(exceptionsValidate))
        }
    }

    const showProduct = (value) => {
        setProduct({...value})
        setVisibleProduct(true)
    }

    const updateList = (product) => {
        if(product.quantity === 0){
            delete products[product.code]
            delete copy.products[product.code]
        }else{
            product.quantity = product.quantity ? product.quantity : 1
            products[product.code] = product
            copy.products[product.code] = product
        }
        setProduct(null)
        setProducts(products => ({...products}))
    }

    const onPressDelete = () => {
        FBController.FS_Delete('ORDERS', copy.code, {REF: 'LOCALS', CHILD: LOCAL.code})
        navigation.goBack(null)
    }

    return (
        <>
        { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
        <View style={[  styles.container, styles.bgTheme, styles.alignCenter]} >
            <ScrollView style={[ styles.column, styles.widthForm, styles.paddingTiny_X, styles.paddingTiny_B ]}>
                { permissions.admin && ( <OrderOptionsAdmin props={{ order:copy, deleteOrder:onPressDelete }} />) }
                <OrderType props={{ order:copy, type, setType, state, setState, admin:permissions.admin }} />
                <OrderCustomer props={{ order:copy, type }} />
                <OrderPayment props={{ order:copy, type, products }} />
                <OrderLetterMenu props={{ callback:showProduct }} />
                <OrderListProducts props={{ products, callback:showProduct }} />
                { !visibleProduct || !product ? null :
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

export default UpdateOrderScreen

