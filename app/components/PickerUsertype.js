import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from '../constants/Constants'
import PickeBorder from './PickerBorder'


const PickerUsertype = (props) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props

    const types = {
        'ROOT': ['partner', 'employee'],
        'PARTNER': ['employee'],
        'EMPLOYEE': ['employee']
    }
    const values = types[PROFILE.usertype] ? types[PROFILE.usertype] : []
    const [ data, setData ] = useState(values)

    useEffect(() => {
    }, [ currentValue, disabled ])

    return (
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            nullable={nullable}
            currentValue={currentValue ? (currentValue).toLowerCase() : ''}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]} />
        
    )
}

export default PickerUsertype

