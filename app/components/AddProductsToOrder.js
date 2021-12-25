import React, { useState, useEffect } from 'react'
import { View, Text, RefreshControl, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem } from 'react-native-elements'
import _ from "lodash"

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import LoadingScreen from './LoadingScreen'
//import ShowProductSelected from './ShowProductsSelected'


import InputText from './InputText'
import Switch from '../components/Switch'
import Button from './Button'

import FBController from  '../controllers/FirebaseController'


const AddProductsToOrder = (props) => {
    const { PROFILE, LOCAL, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callback, disabled, currentValue, nullable } = props
    
    const [ isLoading, setLoading ] = useState(false)
    const [ products, setProducts ] = useState(currentValue ? currentValue : [])

    useEffect(() => {
    }, [ currentValue, products, disabled ])

    return (
        <ScrollView style={[  ]}>

            { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }

            <ShowProductSelected
                currentValue={products}
                disabled={disabled}
                callback={ (products, total) => {
                    callback(products, total)
                }}
            />

        </ScrollView>

    )
}

/* const RenderItemSelect = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { item, addToList, index } = props
    return (
        <TouchableOpacity onPress={()=>addToList(item, index)} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, {width: 90}  ]} underlayColor={colors.transparent} >
            <View style={[ styles.alignCenter ]}>
                <Avatar 
                    size={size.imageTiny}  
                    source={ null} 
                    containerStyle={[styles.imageCover, styles.borderFine, styles.radiusMin, {width: '100%', height: size.imageSmall} ]} />
            </View>
            <View style={[ styles.radiusTiny_Y, styles.absolute, styles.paddingTiny_Y, {height: size.imageSmall} ]}>
                <Text numberOfLines={3} style={[styles.textTiny, styles.textCenter, styles.uppercase ]}>{item.name}</Text>
                <Text style={[styles.textTiny, styles.textCenter, styles.colorPrimary ]}>$ {item.price}</Text>
            </View>
        </TouchableOpacity>
    )
} */


var _F = Constants.FUNCTIONS

const ShowProductSelected = (props) => {
    const { PROFILE, LOCAL, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callback, disabled, currentValue, nullable } = props
    
    const [ isLoading, setLoading ] = React.useState(true)
    const [ products, setProducts ] = React.useState(currentValue)
    const [ total, setTotal ] = React.useState(0)

    React.useEffect(() => { 
        calcTotal()
    }, [ currentValue, total, disabled ])

    const callbackList = (value, index) => {
        if(value.quantity === 0){
            delete products[value.code]
        }else{
            value.quantity = value.quantity ? value.quantity : 1
            products[value.code] = value
        }
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
            <View style={[ styles.marginTiny_T ]}>
                <View style={[ styles.row, styles.alignCenter, styles.borderBottom, styles.paddingTiny_B ]}>
                    <Text style={[ styles.textHeader, styles.textSmall, styles.flex ]}>
                        {trans('products')}:
                    </Text>
                    <Text style={[ styles.textHeader, styles.paddingTiny_L, styles.flex, styles.textBold, styles.textRight, styles.colorPrimary]}>
                        $ {_F.numberFormatMoney(total)}
                    </Text>
                </View>
                <View style={[  ]}>
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
    const cancel = () =>{
        callbackList({...item, quantity: 0 })
    }
    
    return (
        <ListItem.Accordion  
            containerStyle={[ styles.paddingNone, styles.paddingTiny_Y, styles.borderBottom, ]}
            underlayColor={colors.transparent}
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded) }
            noIcon={true}
            content={
                <>
                                
                <ListItem.Content style={[ styles.row, styles.flex]}>
                    <View style={[ styles.column, styles.flex ]}>
                        <View style={[ styles.row, styles.flex, styles.justifyBetween ]}>
                            <Text style={[ styles.flex, styles.textSmall, styles.textBold, styles.uppercase, styles.flex ]}>{item.name}</Text>
                            <Text style={[ styles.textMedium ]}>$ {_F.numberFormatMoney(item.price * item.quantity)}</Text>
                        </View>
                        
                        <View style={[ styles.row, styles.flex, styles.alignCenter, /* expanded ? */ styles.justifyBetween /* : styles.justifyEnd */ ]}>
                            {/* {
                                ! expanded ? null :  */}
                                <Button
                                    type={'outline'}
                                    title={trans('cancel')}
                                    titleStyle={[ styles.textTiny, styles.uppercase, styles.colorError ]}
                                    buttonStyle={[ styles.paddingTiny_X, { height: 28 } ]}
                                    containerStyle={[   ]}
                                    onPress={ ()=> { cancel() } } />
                            {/* } */}
                            
                            <View style={[styles.counter, styles.radiusSmall]} >
                                <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                    onPress={ () => { disabled ? null : dropCant() } }> - </Text>
                                <Text style={[styles.textMedium]}> {item.quantity} </Text>
                                <Text style={[styles.textLarge, styles.paddingTiny_X]} 
                                    onPress={ () => { disabled ? null : addCant() } }> + </Text>
                            </View>
                            {/* <Text style={[ styles.textMedium, styles.colorPrimary ]}>$ {_F.numberFormatMoney(item.price * item.quantity)}</Text> */}
                        </View>
                        
                    </View> 
                </ListItem.Content>
                </>
            } >

            
            <ListItem containerStyle={[ styles.paddingNone, styles.column, {height: expanded ? 'auto': 0} ]}>

                <ListItem.Content style={[ styles.column ]}>
                {
                    Object.entries(item.supplies).map(([index, value])  => (
                        <View key={index} style={[ styles.row, styles.paddingMin, styles.alignCenter, styles.borderTop, styles.justifyBetween ]}>
                            <Text numberOfLines={2} style={[ styles.flex, styles.textSmall ]}>{value.name}</Text>
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


export default AddProductsToOrder

