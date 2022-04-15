import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from '../constants/Constants'
import InputText from './InputText'
import PickeBorder from './PickerBorder'


const PickerEmployee = (props) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    
    const types = {
        //'ROOT': ['admin', 'cook', 'accountant', 'delivery', 'waiter', 'supervisor'],
        'ROOT': ['admin', 'cook', 'delivery', 'waiter'],
        'PARTNER': ['admin', 'cook', 'delivery', 'waiter'],
        'EMPLOYEE': ['admin', 'cook', 'delivery', 'waiter']
    }
    const values = types[PROFILE.usertype] ? types[PROFILE.usertype] : []
    const [ data, setData ] = useState(values)

    useEffect(() => {
    }, [ currentValue, disabled ])

    return (
        !disabled ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            nullable={nullable}
            currentValue={currentValue ? (currentValue).toLowerCase() : ''}
            onValueChange={(value) => callback(value ? value.toUpperCase() : null) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]} />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ currentValue ? trans(currentValue.toLowerCase()) : ''}
            containerStyle={[props.styles]} />
        
    )
}

export default PickerEmployee

