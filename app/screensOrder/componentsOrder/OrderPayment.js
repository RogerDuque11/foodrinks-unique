import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import PickerPayment from '../../components/PickerPayment'

var _F = Constants.FUNCTIONS

const OrderPayment = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION    
    const { styles, colors, size, trans } = CurrentScheme()
    const { order, type, products, disabled } = props
    
    const [ typePayment, setTypePayment ] = useState(order.typePayment ? order.typePayment : 'CASH')
    const [ cash, setCash ] = useState(order.cash ? order.cash : 0)
    const [ otherPay, setOtherPay ] = useState(order.otherPay ? order.otherPay : 0)
    const [ delivery, setDelivery ] = useState(order.deliveryPrice ? order.deliveryPrice : 0)
    const [ productsPrice, setProductsPrice ] = useState(order.productsPrice ? order.productsPrice : 0)

    useEffect(() => {
        if(type !== 'DELIVER'){
            setDelivery(0)
        }
        updateSubtotal()
    }, [ type, products ])

    const updateSubtotal = () => {
        if (products && Object.keys(products).length > 0){
            var totalProducts = 0
            Object.entries(products).map(([index, value]) =>{
                var price = value.priceModify && value.priceModify > 0 ? value.priceModify : value.price
                var total = value.quantity * price
                totalProducts = totalProducts + total
            })
            order.productsPrice = totalProducts
            setProductsPrice(totalProducts)
        }else{
            order.productsPrice = 0
            setProductsPrice(0)
        }
    }

    const getChange = () => {
        var total = productsPrice + delivery
        var payment = cash + otherPay
        var change = payment - total
        return _F.numberFormatMoney(change)
    }

    return (
        <View style={[ styles.column, styles.card, styles.marginTiny_T ]} >

            <View style={[ styles.row, styles.paddingTiny, styles.alignCenter, styles.border_B ]}>
                <Icon name={'calculator-outline'} library={'Ionicons'} color={colors.default} size={size.iconSmall} />
                <View style={[ styles.flex, styles.row, styles.alignCenter ]}>
                    <Text style={[ styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('payment')}: </Text>
                    <PickerPayment
                        currentValue={ order.typePayment ? order.typePayment : typePayment }
                        disabled={ disabled }
                        styles={[ styles.bgTransparent, styles.borderNone, styles.flex, {marginTop: 0, width: '48%'}]}
                        pickerStyle={[ {height: size.formMin} ]}
                        callback={ (value) => {
                            order.typePayment = (value ? value : '') 
                            setTypePayment(value)
                            if (value === 'CASH'){
                                setOtherPay(0)
                                order.otherPay = 0
                            }
                        } } />
                </View>
                <Text style={[ styles.textMedium, styles.textBold, styles.row, styles.alignEnd, styles.marginTiny_R ]}>$ {_F.numberFormatMoney(productsPrice + delivery)}</Text>
            </View>
            
            <View style={[ styles.row, styles.paddingTiny, styles.justifyBetween ]}>

                <View style={[ styles.column, {width: '48%'} ]}>
                    <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter]}>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('Subtotal')} </Text>
                        <Text style={[ styles.textSmall, styles.textRight  ]}>$ {_F.numberFormatMoney(productsPrice)}</Text>
                    </View>
                    { type !== 'DELIVER' ? null :
                    <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny_L, styles.radiusTiny, styles.row, styles.marginTiny_T, styles.justifyBetween, styles.alignCenter]}>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('shipping')} </Text>
                        <InputText 
                            type={'numeric'} value={delivery+''} editable={!disabled}
                            containerStyle={[ styles.flex, {marginTop: 0} ]}
                            inputContainerStyle={[ styles.borderNone, {height: size.formSmall-1} ]}
                            inputStyle={[ styles.textRight ]} 
                            onChangeText={(text) => {
                                order.deliveryPrice = text ? parseInt(text) : 0
                                setDelivery(text ? parseInt(text) : 0)
                            } } />
                    </View>
                    }
                </View>

                <View style={[ styles.column, {width: '48%', marginLeft: '4%'} ]}>
                    { typePayment !== 'CASH' ?
                    <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny_L, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter, styles.marginTiny_B]}>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans(typePayment)} </Text>
                        <InputText 
                            type={'numeric'} value={otherPay+''} editable={!disabled} 
                            containerStyle={[ styles.flex, {marginTop: 0} ]}
                            inputContainerStyle={[ styles.borderNone, {height: size.formSmall-1} ]}
                            inputStyle={[ styles.textRight ]} 
                            onChangeText={(text) => {
                                order.otherPay = text ? parseInt(text) : 0
                                setOtherPay(text ? parseInt(text) : 0)
                            } } />
                    </View> : null
                    }
                    <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny_L, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter]}>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('cash')} </Text>
                        <InputText 
                            type={'numeric'} value={cash+''} editable={!disabled} 
                            containerStyle={[ styles.flex, {marginTop: 0} ]}
                            inputContainerStyle={[ styles.borderNone, {height: size.formSmall-1} ]}
                            inputStyle={[ styles.textRight ]} 
                            onChangeText={(text) => {
                                order.cash = text ? parseInt(text) : 0
                                setCash(text ? parseInt(text) : 0)
                            } } />
                    </View>
                    
                    <View style={[ styles.bgInput, styles.borderFine, styles.paddingTiny, styles.radiusTiny, styles.row, styles.justifyBetween, styles.alignCenter, styles.marginTiny_T ]}>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>{trans('change')} </Text>
                        <Text style={[ styles.textSmall, styles.textRight  ]}>$ { getChange() }</Text>
                    </View>
                </View>

            </View>

        </View >
    )
}


export default OrderPayment

