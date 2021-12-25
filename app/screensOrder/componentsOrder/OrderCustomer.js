import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import Switch from '../../components/Switch'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import PickerTable from '../../components/PickerTable'


const OrderCustomer = ({ props }) => {
    const { styles, colors, size, trans, isWeb } = CurrentScheme()
    const { order, type, disabled } = props
    const [ addDetails, setAddDetails ] = useState(order.details ? true : false)

    useEffect(() => {
    }, [ disabled, order ])

    return (
        <View style={[ styles.column, styles.card ]} >
            
            <View style={[ styles.row, styles.paddingTiny, styles.alignCenter, styles.border_B ]}>
                <Icon name={'account-circle-outline'} library={''} color={colors.default} size={size.iconSmall} />
                <Text style={[ styles.flex, styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('customer')}</Text>
                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                    <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('details')}</Text>
                    <Switch value={addDetails} color={colors.primary} onValueChange={disabled? null : (value) => setAddDetails(value) }></Switch>
                </View>
            </View>
            
            <View style={[ styles.column, styles.paddingTiny_X, styles.paddingTiny_B ]}>
                
                <View style={[ styles.row, styles.justifyBetween ]}>
                {   type === 'TABLE' ?
                    <View style={[ styles.bgInput, styles.borderFine, styles.radiusTiny, styles.row, styles.alignCenter, styles.marginTiny_T, {width: '38%'}  ]}>
                        <Text style={[ styles.textSmall, styles.colorDefault, styles.marginTiny_L ]}>{trans('table')} #</Text>
                        <PickerTable
                            currentValue={ order.table ? {number: order.table} : null }
                            disabled={disabled}
                            styles={[ styles.flex, styles.borderNone, {marginTop: 0} ]}
                            pickerStyle={[ {height: size.formSmall-2} ]}
                            callback={ (value) =>{
                                order.table = value.number
                                order.customer = !order.customer ? 
                                trans('customer') + ' ' + trans('table')
                                : order.customer
                        } }  />
                    </View>
                    : <InputText
                        tag={trans('phone')} type={'numeric'} value={order.customerPhone} editable={!disabled}
                        onChangeText={(text) => order.customerPhone = text }
                        containerStyle={[ styles.marginTiny_T, {width: '38%'} ]} />
                }
                    <InputText
                        tag={trans('customer')} type={'default'} value={order.customer} editable={!disabled}
                        onChangeText={(text) => order.customer = text }
                        containerStyle={[ styles.marginTiny_T, {width: '58%'} ]} />
                </View>

                {  type !== 'DELIVER' ? null :
                    <InputText
                        tag={trans('address')} type={'default'} value={order.customerAddress} editable={!disabled}
                        onChangeText={(text) => order.customerAddress = text }
                        containerStyle={[ styles.marginTiny_T, {width: '100%'} ]} />
                }
                {
                    !addDetails ? null :
                    <InputText
                        tag={trans('details')} type={'default'} value={order.details} editable={!disabled}
                        multiline={true} lines={3}
                        onChangeText={(text) => order.details = text }
                        containerStyle={[ styles.marginTiny_T ]}   />
                }
            </View>

        </View>
    )
}



export default OrderCustomer

