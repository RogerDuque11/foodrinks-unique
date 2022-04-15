import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from '../components/InputText'
import PickerLocal from '../components/PickerLocal'
import PickerPlace from '../components/PickerPlace'
import PickerEmployee from '../components/PickerEmployee'


const ContentEmployee = ( props ) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, trans } = CurrentScheme()
    const { employee, callback, disabled, currentValue } = props

    const local = currentValue && currentValue.local ? {name: currentValue.local, code: currentValue.localCode} : null
    const place = currentValue && currentValue.place ? {name: currentValue.place, code: currentValue.placeCode} : null
    const department = currentValue && currentValue.department ? {name: currentValue.department, code: currentValue.departmentCode} : null
    const position = currentValue && currentValue.position ? currentValue.position : null
    
    const permissions = {
        selectLocal: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' 
        || (PROFILE.position === 'ADMIN' && !PROFILE.localCode) ? true : false,
        //selectDepartment: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'=== 'ADMIN' ? true : false
    }

    /* employee.local = LOCAL ? LOCAL.name: ''
    employee.localCode = LOCAL ? LOCAL.code: '' */

    useEffect(() => {
        
    }, [ currentValue, employee, disabled ])

    return (
        <View style={[ styles.column ]}>

            <Text style={[ styles.textInfo, styles.textCenter ]}>
                {trans('infoPosition')}
            </Text>
            {/* {
                permissions.selectLocal ?  */}
                <PickerLocal 
                    labelFirst={'enabledForAll'} 
                    label={trans('local')} 
                    currentValue={local}
                    nullable={true}
                    disabled={(disabled || !permissions.selectLocal)}
                    callback={ (value) => {
                        if(value && value.name && value.code){
                            local.name = (value && value.code ? value.name : '')
                            local.code = (value && value.code ? value.code : '')
                            employee.local = (value && value.code ? value.name : '')
                            employee.localCode = (value && value.code ? value.code : '')
                        }
                    } } />
                {/* : <InputText
                    tag={trans('local')} type={'default'} editable={false}
                    value={LOCAL ? (LOCAL.name).toString() : ''}/>
            } */}
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickerEmployee
                    labelFirst={'select'}
                    label={trans('position')}
                    currentValue={position}
                    styles={[ {width: '48%'}  ]}
                    disabled={disabled}
                    callback={ (value) => { employee.position = value } } />
                <PickerPlace
                    labelFirst={'enabledForAll'}
                    label={trans('workPlace')}
                    currentValue={place}
                    styles={[ {width: '48%'} ]}
                    disabled={disabled}
                    nullable={true}
                    callback={ (value) => {
                        if(value && value.name && value.code){
                            place.name = (value && value.code ? value.name : '')
                            place.code = (value && value.code ? value.code : '')
                            employee.place = (value && value.code ? value.name : '')
                            employee.placeCode = (value && value.code ? value.code : '')
                        }
                    } } />
            </View>
                    
        </View>
        
    )
}


export default ContentEmployee

