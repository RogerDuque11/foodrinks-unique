import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from '../components/InputText'
import PickerDeparment from '../components/PickerDepartment'
import PickerPartner from '../components/PickerPartner'
import PickerCompany from '../components/PickerCompany'
import PickerLocal from '../components/PickerLocal'
import PickerPlace from '../components/PickerPlace'
import PickerEmployee from '../components/PickerEmployee'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'


const ContentEmployee = ( props ) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, trans } = CurrentScheme()
    const { employee, callback, disabled, currentValue } = props
    //const [ cities, setCities ] = useState(city ? [city] : ['select'])

    const partner = currentValue && currentValue.partner ? {displayName: currentValue.partner, uid: currentValue.partnerUid} : null
    const company = currentValue && currentValue.company ? {name: currentValue.company, code: currentValue.companyCode} : null
    const local = currentValue && currentValue.local ? {name: currentValue.local, code: currentValue.localCode} : null
    const place = currentValue && currentValue.place ? {name: currentValue.place, code: currentValue.placeCode} : null
    const department = currentValue && currentValue.department ? {name: currentValue.department, code: currentValue.departmentCode} : null
    const position = currentValue && currentValue.position ? currentValue.position : null
    
    const permissions = {
        selectPartner: PROFILE.usertype === 'ROOT' ? true : false,
        selectCompany: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'
        || (PROFILE.position === 'ADMIN' && !PROFILE.companyCode) ? true : false,
        selectLocal: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' 
        || (PROFILE.position === 'ADMIN' && !PROFILE.localCode) ? true : false,
        //selectDepartment: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'=== 'ADMIN' ? true : false
    }

    const newPartner = partner ? partner
    : PROFILE.usertype === 'PARTNER' ? PROFILE
    : PROFILE.usertype === 'EMPLOYEE' ? {uid: PROFILE.partnerUid, displayName: PROFILE.partner }
    : null

    employee.partner = newPartner ? newPartner.displayName: ''
    employee.partnerUid = newPartner ? newPartner.uid: ''
    employee.company = COMPANY ? COMPANY.name: ''
    employee.companyCode = COMPANY ? COMPANY.code: ''
    /* employee.local = LOCAL ? LOCAL.name: ''
    employee.localCode = LOCAL ? LOCAL.code: '' */

    useEffect(() => {
        
    }, [ currentValue, employee, disabled ])

    return (
        <View style={[ styles.column ]}>

            <Text style={[ styles.textInfo, styles.textCenter ]}>
                {trans('infoPosition')}
            </Text>

            {
                permissions.selectPartner ?
                <PickerPartner 
                    label={trans('partner')} 
                    labelFirst={'select'} 
                    currentValue={newPartner}
                    callback={ (value) => {
                        employee.partner = (value && value.uid ? value.displayName : '')
                        employee.partnerUid = (value && value.uid ? value.uid : '')
                    } } />
                : null
            }
            {
                permissions.selectCompany ? 
                <PickerCompany 
                    label={trans('company')} 
                    labelFirst={'select'} 
                    currentValue={company}
                    nullable={true}
                    disabled={disabled}
                    callback={ (value) => {
                        employee.company = (value && value.code ? value.name : '')
                        employee.companyCode = (value && value.code ? value.code : '')
                    } } />
                : <InputText
                    tag={trans('company')} type={'default'} editable={false}
                    value={COMPANY ? (COMPANY.name).toString() : ''}/>
            }
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
            <PickerEmployee
                labelFirst={'select'}
                label={trans('position')}
                currentValue={position}
                styles={[  ]}
                disabled={disabled}
                callback={ (value) => { employee.position = value } } />
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickerDeparment
                    labelFirst={'select'}
                    label={trans('workDepartment')}
                    currentValue={department}
                    styles={[ {width: '48%'} ]}
                    disabled={disabled}
                    callback={ (value) => {
                        employee.department = (value && value.code ? value.name : '')
                        employee.departmentCode = (value && value.code ? value.code : '')
                    } } />
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

