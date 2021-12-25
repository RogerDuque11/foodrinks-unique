import React, { useState, useEffect } from 'react'

import PickeBorder from './PickerBorder'


const PickerOrderState = (props) => {
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable, values } = props

    const [ data, setData ] = useState( values ? values : ['pending', 'confirmed', 'preparing', 'terminated', 'dispatched', 'delivered', 'finished'])

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
            disabled={disabled}
            styles={[props.styles]}
            pickerStyle={[props.pickerStyle]} />
        
    )
}

export default PickerOrderState

