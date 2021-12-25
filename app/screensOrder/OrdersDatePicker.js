import React, {Component, useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const OrdersDatePicker = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors } = CurrentScheme()
    const { callbackDate } = route.params
    
    const [datePicker, setDatePiker] = useState(new Date());
    
    function onChangeDateTimePicker(event, selectedDate) {
        var currentDate = selectedDate || datePicker;
        setDatePiker(new Date(currentDate));
        Constants.CURRENT.DATE = currentDate ? DateFormat.date(currentDate) : ''
        callbackDate(DateFormat.date(currentDate))
    }
    
    return (
            <DateTimePicker
                testID="dateTimePicker"
                value={datePicker}
                mode={'date'}
                display="default"
                minimumDate={new Date(2021, 7, 1)}
                maximumDate={new Date()}
                onChange={onChangeDateTimePicker}
                onTouchCancel={()=>callbackDate(null)}
                onTouchEnd={()=>callbackDate(null)}
            /> 
    )
}

export default OrdersDatePicker

