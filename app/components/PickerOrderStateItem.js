import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from '../constants/Constants'
import PickeBorder from './PickerBorder'


const PickerOrderStateItem = (props) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, borderColor, callback, disabled, currentValue, nullable } = props

    const [ data, setData ] = useState(['pending', 'confirmed', 'preparing', 'terminated', 'dispatched', 'delivered', 'finished'])

    useEffect(() => {
    }, [ currentValue, disabled ])

    return (
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            nullable={nullable}
            currentValue={currentValue ? (currentValue).toLowerCase() : ''}
            onValueChange={(value) => callback(value ? (value.toUpperCase()) : value ) } 
            background={background}
            color={color}
            borderColor={borderColor}
            disabled={disabled}
            styles={[props.styles]}
            containerStyle={[props.containerStyle]}
            pickerStyle={[props.pickerStyle]} />
        
    )
}

export default PickerOrderStateItem

