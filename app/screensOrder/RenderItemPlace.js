import React, {  } from 'react';
import { View, Text } from 'react-native' 
import { ListItem } from 'react-native-elements'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Icon from '../components/Icon'
import PickerBorder from '../components/PickerBorder'


export default function CustomRenderItemPlace ({ props }) {
    return (
        <RenderItemPlace props={{...props}} />
    )
}

const RenderItemPlace = ({ props }) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { item, callbackItem } = props

    return (
        <ListItem  
            containerStyle={[ {padding: 0}, styles.bgTheme, styles.paddingSmall_B ]}
            underlayColor={colors.transparent} >                     
            <View style={[ styles.column, styles.flex ]}>
                
                <View style={[ styles.row, styles.alignCenter]}>
                    <View style={[ styles.flex, styles.paddingTiny_X ]}>
                        <View style={[ styles.row, styles.justifyBetween, styles.alignCenter]}>
                            <Text style={[ styles.textTiny, styles.textLighter, styles.uppercase, styles.flex, styles.colorDefault ]}>{trans(item.customer)}</Text>
                            <Text style={[ styles.textTiny, styles.textLighter, styles.uppercase, styles.colorDefault ]}>{trans(item.hour)}</Text>
                        </View>
                    </View>
                </View>

                <View style={[  ]} >
                    <View style={[ styles.column ]}>
                    {
                        Object.entries(item.products).map(([index, product])  => (
                            PROFILE.placeCode && PROFILE.placeCode !== product.placeCode ? 
                            <RenderItemProduct key={index} props={{ order:item, product, index, callbackItem, disabled:true}} /> :
                            <RenderItemProduct key={index} props={{ order:item, product, index, callbackItem}} />
                        ))
                    }      
                    </View>
                </View>

            </View>
        </ListItem >
    )
}

const RenderItemProduct = ({ props }) => {
    const { styles, colors, size, trans, states, substates } = CurrentScheme()
    const { order, product, index, callbackItem, disabled } = props
    
    const [ state, setState ] = React.useState(product.state ? product.state : 'CONFIRMED')
            
    const color = product.state ? states(product.state).color : colors.text
    const colorDisabled = disabled ? [ styles.textTiny, styles.colorDefault ] : null
    
    return (
        <View key={index} style={[ styles.flex, styles.bgCard, disabled ? styles.paddingMin : styles.paddingSmall, styles.paddingSmall_X, styles.border, styles.radiusTiny, {marginTop: size.marginMin, opacity: disabled ? .6 : 1}  ]}>
            
            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter]}>
                <Text style={[ styles.textSmall, styles.textBold, colorDisabled ]}>X{product.quantity} </Text>
                <Text style={[ styles.textSmall, styles.uppercase, colorDisabled, styles.flex ]}>{product.name}</Text>
                <Text style={[ styles.textSmall, styles.textLighter, {color: color}, colorDisabled, styles.uppercase ]}>{trans(state)}</Text>
                { disabled ? null :
                <PickerBorder 
                    values={ ['CONFIRMED', 'PREPARING', 'PAUSED', 'TERMINATED'] } 
                    currentValue={ state } 
                    background={colors.transparent} 
                    color={colors.transparent}
                    borderColor={colors.transparent}
                    styles={[ styles.absolute, {top: -28, right: 0, left: 0} ]}
                    pickerStyle={[ styles.inputMin,   {height: 44} ]}
                    onValueChange={ (value) =>  { 
                        if (product.state !== value) { 
                            setState(value)
                            product['state'] = value
                            if (value === 'PREPARING') { order['state'] = 'PREPARING' }
                            order.products[product.code] = product
                            callbackItem('UPDATED', {...order}) 
                        } 
                    }}  />
                }
                
            </View>    
            { disabled ? null : 
            <>
                { Object.entries(product.supplies).map(([index, supply])  => (
                ! supply.disabled ? null :
                <View key={index} style={[ styles.row, styles.paddingMedium_L, styles.alignCenter, styles.justifyBetween, styles.borderFine_T ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.textLine ]}>{supply.name}</Text>
                    <Icon color= {colors.error} name={'close'} size={size.iconTiny} />
                </View>        
                )) }
                { ! product.details ? null :
                    <View key={index} style={[ styles.row, styles.paddingMedium_L, styles.alignCenter, styles.justifyBetween, styles.borderFine_T ]}>
                        <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, colorDisabled ]}>{product.details}</Text>
                        <Icon color={'green'} name={'check'} size={size.iconTiny} />
                    </View>
                } 
            </>
            }
                                                      
        </View>
    )
}
