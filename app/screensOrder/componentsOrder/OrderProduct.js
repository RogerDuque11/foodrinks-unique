import React, { useState, useEffect } from 'react'
import { View, Text, Modal, Platform, ScrollView } from 'react-native'
import { BottomSheet } from 'react-native-elements'

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import Header from '../../components/Header'
import InputText from '../../components/InputText'
import Switch from '../../components/Switch'
import Icon from '../../components/Icon'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'

var _F = Constants.FUNCTIONS

const OrderProduct = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { visibleProduct, setVisibleProduct, disabled, callback } = props
    const [ addDetails, setAddDetails ] = useState(true) 

    const [ product, setProduct ] = useState(props.product ? Object.assign({}, props.product) : null)
    const [ priceModify, setPriceModify ] = useState( product && product.priceModify && product.priceModify > 0 ? true : false) 
    const [ price, setPrice ] = useState( priceModify ? product.priceModify : product.price )

    
    const left  = { icon: 'close', color: colors.text }
    const right = { icon: 'check', color: colors.accent }
    const contentStyle = [ styles.bgCard, styles.radiusMedium_T, { marginTop: 0}, ]
    const titleStyle = [ styles.textMedium, { marginTop: 0}, ]
/* 
    useEffect(() => {
    }, [ visibleProduct ]) */

    const addCant = () =>{
        var newCant = (product.quantity >= 1 ? product.quantity + 1 : 1)
        setProduct(product => ({...product, quantity: newCant }) )
    }
    const dropCant = () =>{
        var newCant = (product.quantity > 0 ? product.quantity - 1 : 0)
        setProduct(product => ({...product, quantity: newCant }) )
    }
    const remove = () =>{
        callback({...product, quantity: 0 })
    }
    const setSupply = (supply) =>{
        setProduct(product => ({...product}) )
    }

    return (      
        !visibleProduct || !product ? null :
        <BottomSheet
            containerStyle={[ styles.bgOpacityDark ]}
            animationType="slide"
            transparent={true}
            isVisible={visibleProduct}
            hardwareAccelerated={true}
            statusBarTranslucent={true}
            //style={ Platform.OS === 'web' ? [styles.modalWeb] : [] }
            >

            <ScrollView style={[ /* styles.bgOpacityDark */ ]} >
                <View style={[ styles.bgCard, styles.radiusMedium_T ]}>

                    <View style={[ styles.column, styles.border_B, styles.justifyBetween ]}>
                        <Header 
                            params={{ title:product.name, left, right, contentStyle, titleStyle }}  
                            onPressLeft={ ()=>{setVisibleProduct(false)} }  
                            onPressRight={ ()=> { 
                                callback(product) 
                                setVisibleProduct(false)
                                }
                            } />
                    </View>

                    <View style={[ styles.column, styles.paddingTiny_Y ]}>
                        {   Object.entries(product.supplies).map(([index, value])  => (
                                <View key={index} style={[ styles.row, styles.paddingMin, styles.paddingSmall_X, styles.alignCenter, styles.justifyBetween, styles.borderFine_B ]}>
                                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall ]}>{value.name}</Text>
                                    <Button
                                        type={'clear'}
                                        icon={{ color: value.disabled ? colors.error: 'green', name: value.disabled ? 'close' : 'check', size: size.iconSmall }} 
                                        buttonStyle={[ styles.paddingNone ]}
                                        containerStyle={[ styles.paddingNone  ]}
                                        onPress={ ()=> {
                                            disabled ? null : 
                                            value.disabled = value.disabled ? false : true
                                            setSupply()
                                        } } />
                                </View>
                            ))  }      
                    </View> 
                    

                    <View style={[ styles.column, styles.paddingSmall, { paddingTop: 0} ]}>

                        <View style={[ styles.row, styles.paddingTiny_B, styles.alignCenter ]}>
                            <Switch value={priceModify} color={colors.primary} 
                                onValueChange={()=>{
                                    product['priceModify'] = priceModify ? 0 : product.price
                                    console.log(product.priceModify)
                                    setPriceModify(!priceModify)
                                    setPrice(product.price)
                                }}></Switch>
                            <Text style={[ styles.flex, styles.textSmall, styles.paddingTiny_L ]}>{trans('priceModify')}</Text>
                            <Text style={[ styles.textMedium, styles.textBold, priceModify ? { textDecorationLine: 'line-through', color: colors.default } : null ]}>$ {_F.numberFormatMoney(product.price)}</Text>
                        </View> 

                        <View style={[ styles.row, styles.alignCenter, styles.justifyBetween ]}>
                            {
                                priceModify ?
                                <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny_L, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter, {width: '35%'}]}>
                                    <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('price')} </Text>
                                    <InputText 
                                        type={'numeric'} 
                                        value={(price).toString()}
                                        containerStyle={[ styles.flex, {marginTop: 0} ]}
                                        inputContainerStyle={[ styles.borderNone, {height: size.formSmall-1} ]}
                                        inputStyle={[ styles.textRight ]} 
                                        onChangeText={(text) => {
                                            product['priceModify'] = text ? parseInt(text) : 0
                                            setPrice(text ? parseInt(text) : product.price)
                                        } } />
                                </View> : 
                                <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter, {width: '35%'} ]}>
                                    <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('price')} </Text>
                                    <Text style={[ styles.textSmall, styles.textRight  ]}>$ {_F.numberFormatMoney(price)}</Text>
                                </View>
                            }
                            <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter, {width: '35%'} ]}>
                                <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('Total')} </Text>
                                <Text style={[ styles.textSmall, styles.textRight  ]}>$ {_F.numberFormatMoney(price*product.quantity)}</Text>
                            </View>
                            <View style={[styles.counter, styles.radiusTiny, {width: '26%', height: size.formSmall}]} >
                                <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                    onPress={ () => { disabled ? null : dropCant() } }> - </Text>
                                <Text style={[styles.textMedium]}> {product.quantity} </Text>
                                <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                    onPress={ () => { disabled ? null : addCant() } }> + </Text>
                            </View>
                        </View>
                        <InputText
                            tag={trans('details')} type={'default'} editable={!disabled}
                            value={product.details}
                            multiline={true} lines={3}
                            containerStyle={[ styles.marginTiny_T]}
                            onChangeText={(text) => product.details = text } />
                    </View>

                </View>
            </ScrollView>  

        </BottomSheet>
    )
}







export default OrderProduct

