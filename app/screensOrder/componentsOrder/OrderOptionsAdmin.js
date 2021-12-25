import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import Icon from '../../components/Icon'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat


const OrderOptionsAdmin = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { order, disabled, deleteOrder } = props
    
    const [ datePicker, setDatePiker ] = useState(new Date())
    const [ date, setDate ] = useState(order.date)
    const [ showDate, setShowDate ] = useState(false)
    
    function onChangeDateTimePicker(event, selectedDate) {
        var currentDate = selectedDate || datePicker;
        setDatePiker(new Date(currentDate))
        setDate(DateFormat.date(currentDate))
        order.date = DateFormat.date(currentDate)
        setShowDate(false)
    }

    return (
        <>
        <View style={[ styles.row, styles.marginTiny_B,  styles.justifyBetween ]} >
            <TouchableOpacity style={[ styles.row, styles.card, styles.paddingTiny, styles.alignCenter ]} onPress={()=>{setShowDate(true)}} >
                <Icon name={'calendar-edit'} library={''} color={colors.success} size={size.iconSmall} />
                <Text style={[ styles.textSmall, styles.marginTiny_L, styles.colorSucces ]} >{date} </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ styles.row, styles.card, styles.paddingTiny, styles.alignCenter, styles.paddingSmall_R ]} onPress={deleteOrder} >
                <Icon name={'trash-outline'} library={'Ionicons'} color={colors.error} size={size.iconSmall} />
                <Text style={[ styles.textSmall, styles.marginTiny_L, styles.colorError ]} >{trans('delete')}</Text>
            </TouchableOpacity>
        </View>
        {showDate && (<DateTimePicker
            testID="dateTimePicker"
            value={datePicker}
            mode={'date'}
            display="default"
            minimumDate={new Date(2021, 7, 1)}
            maximumDate={new Date()}
            onChange={onChangeDateTimePicker}
            onTouchCancel={()=>setShowDate(false)}
            onTouchEnd={()=>setShowDate(false)}
        /> )}
        </>
    )
}



export default OrderOptionsAdmin

