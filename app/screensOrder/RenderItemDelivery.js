import React, {  } from 'react';
import { View, Text, TouchableOpacity } from 'react-native' 
import { ListItem } from 'react-native-elements'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Icon from '../components/Icon'
import PickerBorder from '../components/PickerBorder'
import ShowOrder from './ShowOrder'

var _F = Constants.FUNCTIONS

export default function CustomRenderItemOrder ({ props }) {
    return (
        <RenderItemDelivery props={{...props}} />
    )
}

const RenderItemDelivery = ({ props }) => {
    const { styles, colors, size, trans, states, substates } = CurrentScheme()
    const { item, callbackItem } = props
    const [ visible, setVisible ] = React.useState(false) 
    const [ state, setState ] = React.useState(item.state)
    const total = item.deliveryPrice ? parseInt(item.deliveryPrice) + parseInt(item.productsPrice) : item.productsPrice
            
    const color = states(item.state).color
    const values = [item.state].concat(Object.values(substates(item.state)))

    return (
        <>
        <ListItem  
            containerStyle={[ styles.bgCard, styles.border, styles.radiusTiny, styles.marginTiny_B, {padding: 0} ]}
            underlayColor={colors.transparent} >                     
            <View style={[ styles.column, styles.flex ]}>
                
                <View style={[ styles.row, styles.paddingTiny, styles.alignCenter, styles.border_B ]}>
                    <Icon name={'fast-food-outline'} library={'Ionicons'} color={color} size={size.iconSmall} />
                    <View style={[ styles.flex, styles.marginTiny_X ]}>
                        <View style={[ styles.row, styles.justifyBetween, styles.alignCenter]}>
                            <Text style={[ styles.textSmall, styles.textBold, styles.uppercase, styles.flex, {color: color} ]}>{item.customer}</Text>
                            <Text style={[ styles.textSmall, styles.textLighter, styles.uppercase, {color: color} ]}>{trans(item.state)}</Text>
                            <PickerBorder 
                                values={ values } 
                                currentValue={item.state} 
                                background={colors.transparent} 
                                color={colors.transparent}
                                borderColor={colors.card}
                                styles={[ styles.absolute, {top: -20, right: 0, left: 0} ]}
                                pickerStyle={[ styles.inputMin,   {height: 48} ]}
                                onValueChange={ (value) =>  { 
                                    if (item.state !== value) { 
                                        setState(value)
                                        item['state'] = value
                                        callbackItem('UPDATED', {...item, state:value}) } 
                                }}  />
                        </View>
                        <View style={[styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textSmall, {width: '75%'} ]}>{item.customerAddress}</Text>
                            <Text style={[ styles.textSmall, styles.textRight, {width: '25%'} ]}>{item.hour}</Text> 
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={[ styles.paddingTiny_Y ]} onPress={()=>setVisible(true)}  activeOpacity={.6} >
                    {  !item.customerPhone /* && !item.details */ ? null :
                        <View style={[ styles.column, styles.paddingSmall_X, styles.borderFine_B, styles.marginTiny_B ]}>
                            { !item.customerPhone ? null : <Text style={[styles.textSmall, styles.marginTiny_B]}>{trans('phone') + ': ' + item.customerPhone} </Text>}
                            {/* { !item.details ? null : <Text style={[styles.textSmall, styles.marginTiny_B]}>{trans('details') + ': ' + item.details} </Text>} */}
                        </View>
                    }
                    <View style={[ styles.column, styles.paddingSmall_X ]}>
                    {
                        Object.entries(item.products).map(([index, product])  => (
                            <RenderItemProduct key={index} props={{product, index}} />
                        ))
                    }      
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.borderFine_T, styles.paddingTiny_T ]}>
                        <View style={[ styles.column, styles.paddingSmall_L, styles.paddingTiny_R, styles.borderFine_R, {width: '50%'} ]}>
                            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                <Text style={[styles.textSmall, styles.uppercase ]}>{trans('subtotal')}</Text>
                                <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.productsPrice)}</Text>
                            </View>
                            { ! item.deliveryPrice ? null :
                                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>{trans('shipping')}</Text>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.deliveryPrice)}</Text>
                                </View>
                            }
                            <View style={[ styles.row, styles.justifyEnd, styles.alignCenter ]}>
                                <Icon name={'arrow-up-right'} library={'Feather'} color={color} size={size.iconMin} />    
                            </View>
                        </View>
                        <View style={[ styles.column, styles.paddingSmall_R, styles.paddingTiny_L, {width: '50%'} ]}>
                            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                <Text style={[styles.textSmall, styles.uppercase, styles.textBold ]}>{trans('total')}</Text>
                                <Text style={[styles.textSmall, styles.uppercase, styles.textBold ]}>$ {_F.numberFormatMoney(total)}</Text>
                            </View>
                            { ! item.otherPay ? null :
                                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>{item.typePayment}</Text>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.otherPay)}</Text>
                                </View>
                            }
                            { ! item.cash ? null :
                                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>{trans('cash')}</Text>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.cash)}</Text>
                                </View>
                            }
                            { ! item.cash && ! item.otherPay ? null :
                                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>{trans('change')}</Text>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney((item.cash + item.otherPay) - total)}</Text>
                                </View>
                            }
                        </View>
                    </View> 
                </TouchableOpacity>

            </View>
        </ListItem >
        {/* <ShowOrder props={{order:item, visible, setVisible, callbackItem, disabled:true }}/> */}
        </>
    )
}

const RenderItemProduct = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { product, index } = props
    
    const calcPrice = () => {
        return product.priceModify && product.priceModify > 0 ? product.priceModify : product.price
    }
    const calcTotal = () => {
        return calcPrice()*product.quantity
    }
    
    return (
        <View key={index} style={[ styles.flex, styles.marginTiny_B ]}>
            <View style={[ styles.row, styles.justifyBetween ]}>
                <Text style={[styles.textSmall, styles.textBold ]}>X{product.quantity} </Text>
                <Text style={[styles.textSmall, styles.uppercase, styles.flex ]}>{product.name}</Text>
                <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney( calcPrice() )}</Text>
            </View>        
            { Object.entries(product.supplies).map(([index, supply])  => (
                ! supply.disabled ? null :
                <View key={index} style={[ styles.row, styles.paddingMedium_L, styles.alignCenter, styles.justifyBetween ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.colorDefault ]}>{supply.name}</Text>
                    <Icon color= {colors.error} name={'close'} size={size.iconTiny} />
                </View>        
            )) }
            { ! product.details ? null :
                <View key={index} style={[ styles.row, styles.paddingMedium_L, styles.alignCenter, styles.justifyBetween ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textSmall ]}>{product.details}</Text>
                    <Icon color={'green'} name={'check'} size={size.iconTiny} />
                </View>
            }                                           
        </View>
    )
}
