import React, { useState, useEffect } from 'react'
import { View, Text,  TouchableOpacity } from 'react-native'

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import Icon from '../../components/Icon'
import Avatar from '../../components/Avatar'

var _F = Constants.FUNCTIONS

const OrderListProducts = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { products, callback, disabled } = props

    /* useEffect(() => {
    }, [ products ]) */

    const updateProduct = (value, index) => {
        const product = JSON.parse(JSON.stringify(value))
        callback(product, index)
    }

    return (
        <View style={[ styles.column, styles.card, styles.marginTiny_Y ]} >

            <View style={[ styles.row, styles.paddingTiny, styles.alignCenter ]}>
                <Icon name={'fast-food-outline'} library={'Ionicons'} color={colors.default} size={size.iconSmall} />
                <Text style={[ styles.flex, styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('products')}</Text>
                {/* <Text style={[ styles.flex, styles.textHeader, styles.textBold, styles.textRight, styles.colorPrimary]}>
                    $ {_F.numberFormatMoney(total)}
                </Text> */}
            </View>
            
            <View style={[ styles.column ]}>
                {  
                    Object.entries(products).map(([index, product])  => (
                        <RenderItemProduct key={index} props={{ product, index, callback:updateProduct, disabled }} />
                    ))
                }
            </View>
        </View>
    )
}

const RenderItemProduct = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { product, index, callback, disabled } = props

    const calcPrice = () => {
        return product.priceModify && product.priceModify > 0 ? product.priceModify : product.price
    }
    const calcTotal = () => {
        return calcPrice()*product.quantity
    }
    
    return (
        <TouchableOpacity key={index} onPress={disabled ? null : ()=> callback(product) } style={[ styles.column, styles.border_T, styles.marginTiny_B ]}>
            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter, styles.paddingTiny_Y, styles.paddingTiny_X ]}>
                <Text style={[styles.textSmall, styles.textBold ]}>X{product.quantity} </Text>
                <Text style={[styles.textSmall, styles.uppercase, styles.flex ]}>{product.name}</Text>
                <Text style={[styles.textSmall, styles.textBold, styles.uppercase ]}>$ {_F.numberFormatMoney(calcPrice())}</Text>
            </View>        
            { Object.entries(product.supplies).map(([index, supply])  => (
                ! supply.disabled ? null :
                <View key={index} style={[ styles.row, styles.paddingMin, styles.paddingMedium_L, styles.paddingTiny_R, styles.alignCenter, styles.justifyBetween, styles.borderFine_T ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.colorDefault, styles.paddingTiny_L ]}>{supply.name}</Text>
                    <Icon color= {colors.error} name={'close'} size={size.iconTiny} />
                </View>        
            )) }
            { ! product.details ? null :
                <View style={[ styles.row, styles.paddingMin, styles.paddingMedium_L, styles.paddingTiny_R, styles.alignCenter, styles.justifyBetween, styles.borderFine_T ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.paddingTiny_L ]}>{product.details}</Text>
                    <Icon color={'green'} name={'check'} size={size.iconTiny} />
                </View>
            }                                           
        </TouchableOpacity>
    )
}







export default OrderListProducts

