import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'
import ButtonGroup from './ButtonGroup'

import FBController from  '../controllers/FirebaseController'


const ButtonsLetterMenu = (props) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    
    const [ data, setData ] = useState([])
    const [ data2, setData2 ] = useState(['todos'])
    const [ select, setSelect] = useState(0)

    useEffect(() => {
        if (data.length === 0 && !disabled){ loadPlace() }
    }, [ currentValue, data ])

    async function loadPlace() {
        await FBController.FS_ReadBy('PLACES', 'enable', '==', true, {REF: 'LOCALS', CHILD: LOCAL.code})
        .then((result)=>{ 
            (result).forEach((value)=>{
                data.push(value.name)
            })
            //setData(result) 
        })
        .finally(()=>{  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ButtonsPlace/loadPlace', error.message) })
    }

    return (
        !disabled && data.length > 1 ?
        <ScrollView horizontal={true} >
        <ButtonGroup
            onPress={setSelect}
            selectedIndex={select}
            buttons={data}
            />
        </ScrollView>
        : <ButtonGroup
            onPress={setSelect}
            selectedIndex={0}
            buttons={['TODOS']}
            />
    )
}
{/* <InputText
            tag={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue['name']) ? (currentValue['name']).toString() : ''}
            containerStyle={[props.styles]} /> */}

export default ButtonsLetterMenu

