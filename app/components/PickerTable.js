import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const PickerTable = (props) => {
    const { PROFILE, LOCAL, COMPANY } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    
    const [ data, setData ] = useState([])
    
    useEffect(() => {
        if (data.length === 0 && !disabled){ loadTables() }
    }, [ currentValue ])

    async function loadTables() {
        if(LOCAL && LOCAL.code){
            await FBController.FS_ReadBy('TABLES', 'enable', '==', true, {REF: 'LOCALS', CHILD: LOCAL.code})
            .then((result)=>{ setData(result) })
            .finally(()=>{  })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerTable/loadTables', error.message) })
        }
    }

    return (
        !disabled ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            currentValue={currentValue}
            tag={'number'}  
            nullable={nullable}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]} />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue['number']) ? (currentValue['number']).toString() : ''}
            inputStyle={[styles.colorDefault]}
            containerStyle={[props.styles]} />
    )
}


export default PickerTable

