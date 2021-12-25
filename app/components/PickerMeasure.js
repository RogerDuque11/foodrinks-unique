import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const PickerMeasure = (props) => {
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, tag, currentValue, nullable } = props
    
    const [ data, setData ] = useState([])
    const tagLabel = tag ? tag : 'name'

    useEffect(() => {
        if (data.length === 0 && !disabled){ loadMeasures() }
    }, [ currentValue ])

    async function loadMeasures() {
        await FBController.FS_ReadBy('MEASURES', 'enable', '==', true, 'ORIGIN')
        .then((result)=>{ setData(result) })
        .finally(()=>{  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerMeasure/loadMeasures', error.message) })
    }

    return (
        !disabled ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            currentValue={currentValue}
            tag={tagLabel}  
            nullable={nullable}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]} />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue[tagLabel]) ? (currentValue[tagLabel]).toString() : ''}
            containerStyle={[props.styles]} />
    )
}


export default PickerMeasure

