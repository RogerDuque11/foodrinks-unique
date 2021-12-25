import React, {  } from 'react';
import { View, Text, ScrollView } from 'react-native' 
import { ListItem } from 'react-native-elements'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Icon from '../components/Icon'
import Button from '../components/Button'
import PickerBorder from '../components/PickerBorder'

var _F = Constants.FUNCTIONS

export default function CustomRenderItemOrder ({ props }) {
    return (
        <RenderItemOrder props={{...props}} />
    )
}

const RenderItemOrder = ({ props }) => {
    const { styles, colors, size, trans, states, substates } = CurrentScheme()
    const { item, callbackItem, index } = props
    const [ expanded, setExpanded ] = React.useState(true) 
    const total = item.deliveryPrice ? parseInt(item.deliveryPrice) + parseInt(item.productsPrice) : item.productsPrice
    const styleExpanded = expanded ? [styles.radiusTiny_T] : [styles.radiusTiny]
            
    const color = states(item.state).color
    const values = [item.state].concat(Object.values(substates(item.state)))

    return (
        <ListItem.Accordion  
            containerStyle={[ styles.bgCard, styleExpanded, styles.borderFine, styles.paddingMin, styles.paddingTiny_Y ]}
            underlayColor={colors.transparent}
            isExpanded={expanded}
            //onPress={() => setExpanded(!expanded) }
            noIcon={true}
            content={
                <>                                
                <ListItem.Content style={[ styles.row, styles.alignCenter ]}>
                    {/* <Icon name={'fast-food-outline'} library={'Ionicons'} color={color} size={size.iconSmall} /> */}
                    <View style={[ styles.flex, styles.marginTiny_X ]}>
                        <View style={[styles.column, styles.alignCenter]}>
                            <Text style={[styles.textSmall, styles.textBold, styles.uppercase, {color: color} ]}>{trans(item.type) + ' ' + item.table}</Text>
                            <Text style={[styles.textSmall, styles.textLighter, styles.uppercase, {color: color} ]}>{trans(item.state)}</Text>
                            {/* <PickerBorder 
                                values={values} 
                                currentValue={item.state}
                                background={colors.transparent} 
                                color={colors.transparent}
                                borderColor={colors.card}
                                styles={[ styles.absolute, {marginTop: 0, right: 0} ]}
                                pickerStyle={[ styles.inputMin,   {height: 32, width: 100} ]}
                                onValueChange={ (value) => { item.state === value ? null : callbackItem('UPDATED', {...item, state:value}) } }  /> */}
                        </View>
                        <View style={[styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textTiny, {color: color} ]}>{item.customer}</Text>
                            <Text style={[ styles.textTiny, {color: color} ]}>{item.hour}</Text> 
                        </View>
                    </View>
                </ListItem.Content>
                </>
            } >
            
            <ListItem 
                //leftContent={ <LeftContent props={{ callbackItem, item }}/>  }
                //rightContent={ <RightContent props={{ callbackItem, item }}/>  }
                containerStyle={[ styles.bgCard, styles.column, styles.paddingTiny, styles.borderFine, styles.radiusTiny_B, {borderTopWidth: 0, height: expanded ? 'auto' : 0} ]}>
                <ListItem.Content style={[ styles.row ]}>
                    <View style={[ styles.column, styles.flex ]}>
                    {
                        Object.entries(item.products).map(([index, product])  => (
                            <RenderItemProduct key={index} props={{product, index}} />
                        ))
                    }      
                        <View style={[ styles.flex, styles.borderTop, styles.paddingTiny_T ]}>
                            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                <Text style={[styles.textTiny, styles.uppercase ]}>{trans('products')}</Text>
                                <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.productsPrice)}</Text>
                            </View>
                            {
                                ! item.deliveryPrice ? null :
                                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                    <Text style={[styles.textTiny, styles.uppercase ]}>{trans('shipping')}</Text>
                                    <Text style={[styles.textSmall, styles.uppercase ]}>$ {_F.numberFormatMoney(item.deliveryPrice)}</Text>
                                </View>
                            }
                            <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                                <Text style={[styles.textTiny, styles.uppercase, styles.textBold ]}>{trans('total')}</Text>
                                <Text style={[styles.textSmall, styles.uppercase, styles.textBold ]}>$ {_F.numberFormatMoney(total)}</Text>
                            </View>
                        </View>   

                    </View>
                </ListItem.Content>
            </ListItem>

        </ListItem.Accordion >
    )
}

const RenderItemProduct = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { product, index } = props
    
    return (
        <View key={index} style={[ styles.flex, styles.marginTiny_B ]}>
            <View style={[ styles.row, styles.justifyBetween ]}>
                <Text style={[styles.textTiny, styles.textBold ]}>X{product.quantity} </Text>
                <Text style={[styles.textTiny, styles.uppercase, styles.flex ]}>{product.name}</Text>
                
            </View>        
            { Object.entries(product.supplies).map(([index, supply])  => (
                ! supply.disabled ? null :
                <View key={index} style={[ styles.row, styles.paddingTiny_L, styles.alignCenter, styles.justifyBetween ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textTiny ]}>- {supply.name}</Text>
                    <Icon color= {colors.error} name={'close'} size={size.iconMin} />
                </View>        
            )) }
            { ! product.details ? null :
                <View key={index} style={[ styles.row, styles.paddingTiny_L, styles.alignCenter, styles.justifyBetween ]}>
                    <Text numberOfLines={2} style={[ styles.flex, styles.textTiny ]}>- {product.details}</Text>
                    <Icon color={'green'} name={'check'} size={size.iconMin} />
                </View>
            }                                           
        </View>
    )
}

const RightContent = ({ props }) =>{
    const { styles, colors, size, trans, states, substates } = CurrentScheme()
    const { callbackItem, item } = props
    const substateList = substates(item.state)

    return (
        <ScrollView style={[ styles.bgTheme ]} >
            <View style={[ styles.bgTheme, styles.column, styles.paddingTiny_B ]} >
                {   substateList.length === 0 ? null :
                    Object.entries(substateList).map(([key, state]) =>(
                        key === 'finished' && item.cash < item.productsPrice ? null :
                        <Button
                            key={key}
                            type='clear'
                            title={trans(key)}
                            titleStyle={[ styles.colorText, styles.marginTiny_R, styles.textSmall, {color: 'white'} ]}
                            buttonStyle={[ {paddingVertical: 4} ]}
                            containerStyle={[ styles.radiusNone, styles.alignEnd, styles.borderBottom, {backgroundColor: states(state).color} ]}
                            onPress={ ()=> callbackItem('UPDATED', {...item, state:state}) } />
                    ))
                }
                {
                    item.state === 'TERMINATED' || item.state === 'FINISHED' 
                    || item.state === 'CANCELED' || item.state === 'DELETED' ? null :
                    <Button
                        type='clear'
                        title={trans('edit')}
                        titleStyle={[ styles.colorText, styles.marginTiny_R ]}
                        buttonStyle={[ {paddingVertical: size.paddingMin} ]}
                        containerStyle={[ styles.radiusNone, styles.alignEnd, styles.bgCard ]}
                        onPress={ ()=> callbackItem('EDIT', item) } />
                }
            </View>
        </ScrollView>
    )
}

const LeftContent = ({ props }) =>{
    const { styles, colors, size, trans } = CurrentScheme()
    const { callbackItem, item } = props
    return (
        <View style={[ styles.column, styles.bgTheme, styles.paddingTiny, { minWidth: '100%', minHeight: '100%' } ]}>
            { !item.table ? null : <Text style={[styles.textSmall, styles.marginTiny_B]}> {trans('table') + ': ' + item.table} </Text>}
            { !item.customerPhone ? null : <Text style={styles.textSmall, [styles.marginTiny_B]}> {trans('phone') + ': ' + item.customerPhone} </Text>}
            { !item.customerAddress ? null : <Text style={[styles.textSmall, styles.marginTiny_B]}> {trans('address') + ': ' + item.customerAddress} </Text>}
            { !item.details ? null : <Text style={[styles.textSmall, styles.marginTiny_B]}> {trans('details') + ': ' + item.details} </Text>}
        </View>
    )
}