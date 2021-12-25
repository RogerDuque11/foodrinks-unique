import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const PickerLocal = (props) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    const companyCode = COMPANY && COMPANY.code ? COMPANY.code : ''
    const localCode = LOCAL && LOCAL.code ? LOCAL.code : ''

    const [ data, setData ] = useState([])
    
    useEffect(() => {
        if (data.length === 0 && !disabled){ loadLocals() }
    }, [ currentValue, disabled, COMPANY, LOCAL ])

    async function loadLocals() {
        if(companyCode && localCode){
            await FBController.FS_ReadByTwo('LOCALS', 'enable', '==', true, 'code', '==', localCode, 'ORIGIN')
            .then((result)=>{ setData(result) })
            .finally(()=>{  })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerLocal/loadLocals', error.message) })
        }else if(companyCode ){
            await FBController.FS_ReadByTwo('LOCALS', 'enable', '==', true, 'companyCode', '==', companyCode, 'ORIGIN')
            .then((result)=>{ setData(result) })
            .finally(()=>{  })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerLocal/loadLocals', error.message) })
        }
    }

    return (
        !disabled ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label} 
            values={data} 
            currentValue={currentValue}
            tag={'name'}  
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            nullable={nullable}
            styles={[props.styles]}
            pickerStyle={[props.pickerStyle]}  />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue['name']) ? (currentValue['name']).toString() : ''}
            containerStyle={[props.styles]} />
    )
}


export default PickerLocal

