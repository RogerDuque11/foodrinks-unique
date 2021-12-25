import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

import FBController from  '../controllers/FirebaseController'

var functions = Constants.FUNCTIONS

const ContentLocation = ( props ) => {
    const { styles, trans } = CurrentScheme()
    const { location, callback, disabled, currentValue } = props
    const [ countries, setCountries ] = useState([])
    const [ departments, setDepartaments ] = useState([])
    const [ cities, setCities ] = useState([])

    useEffect(() => {
        if (countries.length === 0){ loadCountries() }
    }, [ currentValue, location, disabled ])

    async function loadCountries() {
        await FBController.FS_ReadBy('COUNTRIES', 'enable', '==', true, 'ORIGIN')
        .then((result)=>{ setCountries(result) })
        .finally(()=>{  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ContentLocation/loadCountries', error.message) })
    }

    async function loadDepartments(country) {
        location['country'] = country && country.name ? country.name : ''
        if(location.country){
            var REF = location.country.toUpperCase()
            await FBController.FS_ReadBy('COUNTRIES/'+REF+'/DEPARTMENTS', 'enable', '==', true, 'ORIGIN')
            .then((result)=>{ setDepartaments(result) })
            .finally(()=>{ callback(location) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ContentLocation/loadDepartments', error.message) })
        } else{
            setDepartaments([])
            callback(location)
        }
    }

    async function loadCities(department) {
        location['department'] = department && department.name ? department.name : ''
        if(location.department){
            var REF = location.country.toUpperCase()
            var REF2 = functions.removeSpaces(location.department).toUpperCase()
            await FBController.FS_ReadBy('COUNTRIES/'+REF+'/DEPARTMENTS/'+REF2+'/CITIES', 'enable', '==', true, 'ORIGIN')
            .then((result)=>{ setCities(result) })
            .finally(()=>{ callback(location) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ContentLocation/loadCities', error.message) })
        } else{
            setCities([])
            callback(location)
        }
    }

    return (
        <View style={[ styles.column ]}>

            <Text style={[ styles.textInfo, styles.textCenter ]}>
                {trans('infoLocation')}
            </Text>
            
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickeBorder 
                    labelFirst={'select'} 
                    label={trans('country')} 
                    tag={'name'}
                    values={countries}  
                    currentValue={currentValue ? currentValue.country : null}
                    onValueChange={(value) => loadDepartments(value) } 
                    disabled={disabled}
                    styles={[{width: '48%'}]} />
                <PickeBorder 
                    labelFirst={'select'} 
                    label={trans('department')} 
                    tag={'name'}
                    values={departments}  
                    currentValue={currentValue ? currentValue.department : null}
                    onValueChange={(value) => loadCities(value) } 
                    disabled={ (disabled || !location.country) ? true : false} 
                    styles={[{width: '48%'}]} />
            </View>
            
            <View style={[ styles.row, styles.justifyBetween ]}>
                <PickeBorder 
                    labelFirst={'select'} 
                    label={trans('city')} 
                    tag={'name'}
                    values={cities}  
                    currentValue={currentValue ? currentValue.city : null}
                    onValueChange={(value) => location['city'] = value ? value.name : '' } 
                    disabled={ (disabled || !location.department) ? true : false} 
                    styles={[{width: '48%'}]}/>
                <InputText
                    label={trans('postalCode')} type={'numeric'} 
                    value={(location.postalCode).toString()} editable={!disabled}
                    onChangeText={(text) => location.postalCode = text }
                    containerStyle={[ {width: '48%'} ]} />
            </View>
                    
            <InputText
                label={trans('address')} type={'default'} autocomplet={'street-address'}
                value={(location.address).toString()} editable={!disabled}
                onChangeText={(text) => location.address = text } />
            <InputText
                label={trans('addressDetails')} type={'default'}
                value={(location.addressDetails).toString()} editable={!disabled}
                onChangeText={(text) => location.addressDetails = text } />
        </View>
        
    )
}


export default ContentLocation

