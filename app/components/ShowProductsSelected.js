import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { ListItem } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import LoadingScreen from './LoadingScreen'
import InputText from './InputText'
import Switch from '../components/Switch'
import Button from './Button'
import Icon from './Icon'
import Avatar from './Avatar'

var _F = Constants.FUNCTIONS

const ShowProductSelected = (props) => {
    const { PROFILE, LOCAL, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callback, disabled, currentValue, nullable } = props
    
    const [ isLoading, setLoading ] = useState(true)
    const [ products, setProducts ] = useState(currentValue)
    const [ total, setTotal ] = useState(0)

    useEffect(() => { 
        calcTotal()
    }, [ currentValue, total, disabled ])

    const callbackList = (value, index) => {
        value.quantity = value.quantity ? value.quantity : 1
        products[value.code] = value
        setProducts(newProducts => ({...products, ...newProducts}))
        calcTotal()
    }

    const calcTotal = ( ) => {
        currentValue && currentValue !== products ?
        setProducts(currentValue) : null
        if(products){
            var total = 0
            Object.entries(products).map(([index, value]) =>{
                var price = value.quantity * value.price
                total = total + price
            })
            setTotal(total)
            callback(products, total)
            setLoading(false)
        }
    }

    return (
        <View style={[  ]}>

            { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
            <View style={[ styles.bgCard, styles.borderFine, styles.radiusTiny, styles.marginTiny_T ]}>
                <View style={[ styles.row, styles.alignCenter, styles.marginTiny ]}>
                    <Icon name={'clipboard-outline'} library={'Ionicons'} color={colors.primary} size={size.iconSmall} />
                    <Text style={[ styles.textHeader, styles.textSmall, styles.paddingTiny_L, styles.flex ]}>
                        {trans('products')}:
                    </Text>
                    <Text style={[ styles.textHeader, styles.paddingTiny_L, styles.flex, styles.textBold, styles.textRight, styles.colorPrimary]}>
                        $ {_F.numberFormatMoney(total)}
                    </Text>
                </View>
                <View style={[ styles.paddingTiny_X ]}>
                    {  
                        Object.entries(products).map(([index, item])  => (
                            <RenderItemAdded key={index} props={{ item, callbackList, index, disabled }} />
                        ))
                    }
                </View>
            </View>

        </View>

    )
}

const RenderItemAdded = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { item, callbackList, index, disabled } = props
    const [ expanded, setExpanded ] = React.useState(false) 
    const [ addDetails, setAddDetails ] = React.useState(false) 
    const [ customPrice, setCustomPrice ] = React.useState(false) 

    const addCant = () =>{
        var newCant = (item.quantity >= 1 ? item.quantity + 1 : 1)
        callbackList({...item, quantity: newCant })
    }
    const dropCant = () =>{
        var newCant = (item.quantity > 1 ? item.quantity - 1 : 1)
        callbackList({...item, quantity: newCant })
    }
    
    return (
        <ListItem.Accordion  
            containerStyle={[ styles.paddingNone, styles.paddingTiny_Y, styles.borderTop ]}
            underlayColor={colors.transparent}
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded) }
            content={
                <>
                <Avatar 
                    size={size.imageTiny}  
                    title={item.name[0]}
                    source={ item.photoUrl ? {uri: item.photoUrl} : null} />
                                
                <ListItem.Content style={[styles.paddingTiny_L]}>
                    <Text style={[styles.textSmall, styles.uppercase ]}>{item.name}</Text>
                    <View style={[styles.row, styles.marginTiny_T, styles.alignCenter, styles.justifyBetween]}>
                        <View style={[styles.counter, styles.radiusSmall]} >
                            <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                onPress={ () => { disabled ? null : dropCant() } }> - </Text>
                            <Text style={[styles.textMedium]}> {item.quantity} </Text>
                            <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                onPress={ () => { disabled ? null : addCant() } }> + </Text>
                        </View>
                        {
                            !customPrice ?
                            <Text style={[styles.textHeader, styles.textMedium, styles.colorPrimary]}> $ {_F.numberFormatMoney(item.price*item.quantity)}</Text>
                            : <Text style={[styles.textHeader, styles.textMedium, styles.colorPrimary]}> $ {_F.numberFormatMoney(item.price*item.quantity)}</Text>
                        }
                        
                    </View>
                </ListItem.Content>
                </>
            } >

            
            <ListItem containerStyle={[ styles.paddingNone, styles.column ]}>

                <ListItem.Content style={[ styles.column ]}>
                {
                    Object.entries(item.supplies).map(([index, value])  => (
                        <View key={index} style={[ styles.row, styles.paddingMin, styles.alignCenter, styles.borderTop, styles.justifyBetween ]}>
                            {/* <Icon name={'kitchen'} library={'MaterialIcons'} color={colors.default} size={size.iconTiny} /> */}
                            <Text numberOfLines={2} style={[ styles.flex, styles.textSmall ]}>{value.name}</Text>
                            {/* <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.marginTiny_R, styles.textRight ]}>{value.quantity + ' ' + value.measure}</Text> */}
                            <Button
                                type={'clear'}
                                icon={{ color: value.disabled ? colors.error: 'green', name: value.disabled ? 'close' : 'check', size: size.iconSmall }} 
                                buttonStyle={[ styles.paddingNone ]}
                                containerStyle={[ styles.paddingNone  ]}
                                onPress={ ()=> {
                                    disabled ? null : 
                                    value.disabled = value.disabled ? false : true
                                    callbackList({...item, index})
                                } } />
                        </View>
                    ))
                }
                </ListItem.Content>

                <View style={[ styles.row, styles.paddingSmall_T, styles.paddingTiny_B ]}>
                    <Text style={[ styles.flex, styles.textSmall ]}>{trans('detailsAdd')}</Text>
                    <Switch value={addDetails} color={colors.primary} onValueChange={()=>setAddDetails(!addDetails)}></Switch>
                </View> 
                {
                    !addDetails ? null:
                    <InputText
                        tag={trans('details')} type={'default'} editable={!disabled}
                        multiline={true} lines={2}
                        containerStyle={[ styles.marginSmall_B, {width: '100%'}]}
                        onChangeText={(text) => {
                            item.details = text
                            callbackList(item, index)
                        } } />
                }

                {/* <View style={[ styles.paddingTiny_B, {width: '100%'} ]}>
                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <InputText
                            tag={trans('edit') +' ' + trans('price')} type={'numeric'} editable={!disabled & customPrice}
                            containerStyle={[ styles.marginNone, {width: '40%'}]}
                            onChangeText={(text) => {
                                item.details = text
                                callbackList(item, index)
                            } } />
                        <Switch value={customPrice} color={colors.primary} onValueChange={()=>setCustomPrice(!customPrice)}></Switch>
                    </View> 
                </View>  */}

            </ListItem>

        </ListItem.Accordion >
    )
}


export default ShowProductSelected

