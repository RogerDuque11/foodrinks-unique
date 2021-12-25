import React, { useState, useEffect } from 'react'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from '../constants/Constants'
import PickeBorder from './PickerBorder'
import InputText from './InputText'
import { size } from 'lodash'

//import FBController from  '../controllers/FirebaseController'


const PickerPayment = (props) => {
    const { PROFILE } = Constants.SESION
    const { PAYMENTS } = Constants.CURRENT
    const { styles, colors, size, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props

    //const [ data, setData ] = useState(Object.values(PAYMENTS))
    const [ data, setData ] = useState( ['CASH', 'TARJECT', 'BANCOLOMBIA', 'DAVIPLATA', 'NEQUI'] )

    /* useEffect(() => {
        if (data.length === 0 && !disabled){ loadPayments() }
    }, [ currentValue, disabled ]) */

    /* async function loadPayments() {
        await FBController.FS_ReadBy('PAYMENTS', 'enable', '==', true, 'ORIGIN')
        .then((result)=>{ 
            setData(result) 
            Constants.CURRENT.PAYMENTS = result
        })
        .finally(()=>{ })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerPayments/loadPayments', error.message) })
    } */

    return (
        !disabled && data.length > 0 ?
        <PickeBorder 
            labelFirst={labelFirst}
            label={label}
            values={data} 
            //tag={'name'}  
            nullable={nullable}
            currentValue={currentValue ? currentValue : ''}
            onValueChange={(value) => callback(value) } 
            background={background}
            color={color}
            disabled={disabled}
            styles={[props.styles]}
            pickerStyle={[props.pickerStyle]} />
        : <InputText
            label={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue ? trans(currentValue) : '')}
            inputStyle={[ styles.textMedium, styles.colorDefault ]}
            inputContainerStyle={[styles.bgTransparent, {height: size.formMin},  ]}
            containerStyle={[ props.styles]} />    
    )
}

export default PickerPayment

