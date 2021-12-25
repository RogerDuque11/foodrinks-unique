import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import PickerSupply from './PickerSupply'
import PickerMeasure from './PickerMeasure'
import InputText from './InputText'
import Button from './Button'
import Icon from './Icon'


const AddSupplies = (props) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue } = props
    
    const [ data, setData ] = useState(currentValue ? currentValue : {})
    const [ supply, setSupply ] = useState(null)
    const colorLabel = disabled ? colors.default : colors.text 

    useEffect(() => {
        if(supply && supply.measure){
        }else{
            setData(data)
        }
    }, [ supply, data ])

    const addSupply = (value) => {
        if(supply && supply.code && supply.newQuantity){
            var price = supply.price && supply.quantity ? (supply.price / supply.quantity).toFixed(1) : 0
            data[supply.code] = {name: supply.name, quantity: supply.newQuantity, measure: supply.measure, price: price}
            setSupply(null)
            callback(data)
        }
    }

    const deleteSupply = (key) => {
        key ? delete data[key] : null
        setData(newData => ({...data, ...newData}))
        setSupply(null)
        callback(data)
    }

    return (
        <>
        <Text style={[ styles.textInfo, styles.textCenter ]}>
            {trans(disabled ? 'supplies' : 'suppliesAdd')}
        </Text>
        {
            disabled ? null :
            <>
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickerSupply
                    labelFirst={labelFirst}
                    label={label}
                    disabled={disabled}
                    callback={ (value) => { setSupply(value)} }
                    styles={[ {width: '54%'} ]}/>
                <PickerMeasure
                    labelFirst={'measure'}
                    //label={trans('measure')}
                    disabled={disabled}
                    tag={'initials'}
                    callback={ (value) => {
                        if(supply){
                            supply.measure = (value && value.name ? value.name : '')
                            supply.measureCode = (value && value.code ? value.code : '')
                            setSupply(()=>({...supply}))
                        }
                    } }
                    styles={[ {width: '21%'} ]}/>
                <InputText
                    tag={supply && supply.measure ? (trans(supply.measure).toString())+'(S)'  : ''}
                    editable={ supply && supply.measure ? true : false}
                    type={'numeric'}
                    submit={ addSupply }
                    onChangeText={(text) => supply.newQuantity = text }
                    containerStyle={[ {width: '21%'}]} />
            </View>
                    <Button
                        icon={{ color: colors.background, name:'plus', size: size.iconSmall }} 
                        buttonStyle={[ styles.inputSmall, styles.borderFine,  ]}
                        containerStyle={[ styles.marginTiny_T, /* {width: '12%'} */ ]}
                        disabled={ supply && supply.measure ? false : true}
                        disabledStyle={[ styles.bgDefault ]}
                        onPress={ addSupply } />

            </>
        }
        
        <View style={[ styles.bgInput, styles.borderFine, styles.radiusSmall, styles.paddingSmall_Y, styles.paddingTiny_X, styles.marginTiny_T ]}>
            <View>
                {  
                    Object.entries(data).map(([key, value])  => (
                        <View key={key} style={[ styles.row, styles.paddingMin, styles.alignCenter, styles.borderBottom ]}>
                            <Icon name={'kitchen'} library={'MaterialIcons'} color={colors.default} size={size.iconTiny} />
                            <Text numberOfLines={2} style={[ styles.textTiny,  styles.marginTiny_L, {width: '38%', color: colorLabel} ]}>{value.name}</Text>
                            <Text numberOfLines={2} style={[ styles.textTiny, styles.marginTiny_R, styles.textRight, {width: '26%', color: colorLabel} ]}>{value.quantity + ' ' + value.measure}</Text>
                            <Text style={[ styles.textTiny, styles.marginTiny_R, styles.textRight, {width: '16%', color: colorLabel} ]}>{('$ ' + (value.quantity * value.price).toFixed(1))}</Text>
                            {
                                disabled ? null : 
                                <Button
                                    type={'clear'}
                                    icon={{ color: colors.text, name:'close', size: size.iconSmall }} 
                                    buttonStyle={[ styles.paddingNone ]}
                                    containerStyle={[ styles.paddingNone  ]}
                                    onPress={()=> deleteSupply(key) } />
                            }
                        </View>
                    ))
                }
            </View>
        </View>
        </>
    )
}


export default AddSupplies

