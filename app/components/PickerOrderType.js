import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from '../constants/Constants'
import PickeBorder from './PickerBorder'


const PickerOrderType = (props) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props

    const [ data, setData ] = useState(['deliver', 'table', 'take'])

    useEffect(() => {
    }, [ currentValue, disabled ])

    return (
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            nullable={nullable}
            currentValue={currentValue ? (currentValue).toLowerCase() : ''}
            onValueChange={(value) => callback(value ? value.toUpperCase() : value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]}
            pickerStyle={[props.pickerStyle]} />
        
    )
}

export default PickerOrderType

