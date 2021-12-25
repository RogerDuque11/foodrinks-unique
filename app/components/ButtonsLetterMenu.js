import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { ButtonGroup } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const ButtonsLetterMenu = (props) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { labelFirst, label, color, background, callback, disabled, currentValue, nullable } = props
    
    const [ data, setData ] = useState([])
    const [ data2, setData2 ] = useState(['todos'])
    const [ select, setSelect] = useState(0)

    useEffect(() => {
        if (data.length === 0 && !disabled){ loadLettersMenu() }
    }, [ currentValue ])

    async function loadLettersMenu() {
        await FBController.FS_ReadBy('LETTERSMENU', 'enable', '==', true)
        .then((result)=>{ 
            (result).forEach((value)=>{
                data.push(value.name)
            })
            //setData(result) 
        })
        .finally(()=>{  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ButtonsLetterMenu/loadLettersMenu', error.message) })
    }

    return (
        !disabled && data.length > 1 ?
        <ScrollView horizontal={true} >
        <ButtonGroup
            onPress={setSelect}
            selectedIndex={select}
            buttons={data}
            textStyle={[ styles.colorDefault ]}
            selectedTextStyle={[ styles.colorPrimary ]}
            selectedButtonStyle={[ styles.bgTransparent ]}
            containerStyle={[ styles.borderNone, {height: size.iconSmall} ]}
            buttonStyle={[ styles.paddingTiny_X, /* {width: 100} */ ]}
            buttonContainerStyle={[ ]}
            />
        </ScrollView>
        : <ButtonGroup
            onPress={setSelect}
            selectedIndex={0}
            buttons={['TODOS']}
            textStyle={[ styles.colorDefault ]}
            selectedTextStyle={[ styles.colorPrimary ]}
            selectedButtonStyle={[ styles.bgTransparent, {borderColor: colors.primary}]}
            containerStyle={[ styles.marginSmall_X, {height: size.formSmall}]}
            />
    )
}
{/* <InputText
            tag={label ? trans(label) : null} type={'default'} editable={false}
            value={ (currentValue && currentValue['name']) ? (currentValue['name']).toString() : ''}
            containerStyle={[props.styles]} /> */}

export default ButtonsLetterMenu

