import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import PickerProduct from './PickerProduct'
import PickerPlace from './PickerPlace'
import InputText from './InputText'
import Button from './Button'
import Icon from './Icon'
import RenderItem from './CustomRenderItem'


const AddProductsToMenu = (props) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue } = props
    
    const [ data, setData ] = useState(currentValue ? currentValue : {})
    const [ product, setProduct ] = useState(null)
    const colorLabel = disabled ? colors.default : colors.text 

    useEffect(() => {
        if(product && product.place){
        }else{
            setData(data)
        }
    }, [ product, data ])

    const addProduct = (value) => {
        if(product && product.code){
            data[product.code] = product
            setProduct(null)
            callback(data)
        }
    }

    const deleteProduct = (key) => {
        key ? delete data[key] : null
        setData(newData => ({...data, ...newData}))
        setProduct(null)
        callback(data)
    }

    const columns=[ 'name', 'details', 'cost', '' ]
    const paramsItem= {
        right: true,
        type: 'CARD',
        image: { rounded: false, label: 'photoUrl', size: size.imageTiny },
        margin: size.marginTiny,
        styleText1: [  ],
        styleText2: [ {opacity: 0.8} ],
        styleText3: [ styles.textHeader, styles.colorAccent ],
    } 

    return (
        <>
        <Text style={[ styles.textInfo, styles.textCenter ]}>
            {trans(disabled ? 'products' : 'productsAdd')}
        </Text>
        {
            disabled ? null :
            <>
            
            <PickerProduct
                labelFirst={labelFirst}
                label={label}
                disabled={disabled}
                callback={ (value) => { setProduct(value)} }
                styles={[ ]}/>
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickerPlace
                    labelFirst={'place'}
                    label={trans('place')}
                    disabled={disabled}
                    tag={'initials'}
                    styles={[ {width: '44%'} ]}
                    callback={ (value) => {
                        if(product){
                            product.place = (value && value.name ? value.name : '')
                            product.placeCode = (value && value.code ? value.code : '')
                            setProduct(()=>({...product}))
                        }
                    } } />
                <InputText
                    tag={trans('cost')}
                    //editable={ product && product.place ? true : false}
                    type={'numeric'}
                    submit={ addProduct }
                    onChangeText={(text) => product.cost = text }
                    containerStyle={[ {width: '20%'}]} />
                <InputText
                    tag={trans('sale')}
                    //editable={ product && product.place ? true : false}
                    type={'numeric'}
                    submit={ addProduct }
                    onChangeText={(text) => product.sale = text }
                    containerStyle={[ {width: '20%'}]} />
                <Button
                    icon={{ color: colors.background, name:'plus', size: size.iconSmall }} 
                    buttonStyle={[ styles.inputSmall, styles.borderFine,  ]}
                    containerStyle={[ styles.marginTiny_T, /* {width: '12%'} */ ]}
                    disabled={ product && product.place ? false : true}
                    //disabledStyle={[ styles.bgDefault ]}
                    onPress={ addProduct } />
            </View>
                    

            </>
        }
        
        <View style={[ styles.marginTiny_T ]}>
            <View>
                {  
                    Object.entries(data).map(([index, item])  => (
                        <RenderItem 
                            key={index}
                            onPress={()=>console.log(index)} 
                            props={{ 
                                item, index, columns, paramsItem 
                            }} />
                    ))
                }
            </View>
        </View>
        </>
    )
}


export default AddProductsToMenu

{/* <View key={key} style={[ styles.row, styles.paddingMin, styles.alignCenter, styles.borderBottom, styles.justifyBetween ]}>
                            <Icon name={'kitchen'} library={'MaterialIcons'} color={colors.default} size={size.iconTiny} />
                            <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.marginTiny_L, {color: colorLabel} ]}>{value.name}</Text>
                            <Text numberOfLines={2} style={[ styles.flex, styles.textSmall, styles.marginTiny_R, styles.textRight, {color: colorLabel} ]}>{value.quantity + ' ' + value.place}</Text>
                            {
                                disabled ? null : 
                                <Button
                                    type={'clear'}
                                    icon={{ color: colors.text, name:'close', size: size.iconSmall }} 
                                    buttonStyle={[ styles.paddingNone ]}
                                    containerStyle={[ styles.paddingNone  ]}
                                    onPress={()=> deleteProduct(key) } />
                            }
                        </View> */}