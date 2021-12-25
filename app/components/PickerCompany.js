import React, { useState, useEffect } from 'react'

import References from '../navigation/Refs'
import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const PickerCompany = (props) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    const PARTNER = PROFILE && PROFILE.usertype === 'PARTNER' ? true : false
    const EMPLOYEE = PROFILE && PROFILE.usertype === 'EMPLOYEE' ? true : false
    const ADMIN = EMPLOYEE && PROFILE.usertype === 'ADMIN' ? true : false
    const partnerUid = PARTNER ? PROFILE.uid : ''
    const companyCode = EMPLOYEE ? PROFILE.companyCode : ''
    
    const [ data, setData ] = useState([])

    useEffect(() => {
        if (data.length === 0 && !disabled){ loadCompanies() }
    }, [ currentValue ])

    async function loadCompanies() {
        if(PARTNER && partnerUid){
            await FBController.FS_ReadByTwo('COMPANIES', 'enable', '==', true, 'partnerUid', '==', partnerUid, 'ORIGIN')
            .then((result)=>{ setData(result) })
            .finally(()=>{  })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerCompany/loadCompanies', error.message) })
        } else if (EMPLOYEE && companyCode){
            await FBController.FS_ReadByTwo('COMPANIES', 'enable', '==', true, 'code', '==', companyCode, 'ORIGIN')
            .then((result)=>{ setData(result) })
            .finally(()=>{  })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerCompany/loadCompanies', error.message) })
        }else{
            
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
            nullable={nullable}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]}
            pickerStyle={[props.pickerStyle]} />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue['name']) ? (currentValue['name']).toString() : ''}
            containerStyle={[props.styles]} />
    )
}


export default PickerCompany

