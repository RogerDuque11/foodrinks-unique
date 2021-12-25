import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const PickerDepartment = (props) => {
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    
    const [ data, setData ] = useState([])

    useEffect(() => {
        if (data.length === 0 && !disabled){ loadDepartments() }
    }, [ currentValue, disabled ])

    async function loadDepartments() {
        await FBController.FS_ReadBy('DEPARTMENTS', 'enable', '==', true, '')
        .then((result)=>{ setData(result) })
        .finally(()=>{  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerDepartment/loadDepartments', error.message) })
    }

    return (
        !disabled ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data}
            currentValue={currentValue}
            tag={'name'}  
            nullable={nullable}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]} />
        : <InputText
            label={label ? trans(label) : ''} type={'default'} editable={false}
            value={ (currentValue && currentValue['name']) ? (currentValue['name']).toString() : ''}
            containerStyle={[props.styles]} />
    )
}


export default PickerDepartment

