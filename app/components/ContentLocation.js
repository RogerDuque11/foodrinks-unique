import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import InputText from './InputText'
import PickeBorder from './PickerBorder'

var functions = Constants.FUNCTIONS

const COUNTRIES = [
    {
        name: "Colombia",
        departments: [
            {
                name: "Valle del cauca",
                cities: [ { name: 'Buga'}, { name: 'Cali' }, { name: 'Palmira' }, { name: 'Yumbo'} ]
            }
        ]
    }
]

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
        setCountries(COUNTRIES)
    }

    async function loadDepartments(country) {
        setCities([])
        location['country'] = country && country.name ? country.name : ''
        if(location.country){
            setDepartaments(country.departments ? country.departments : []) 
        } else{
            setDepartaments([])
            callback(location)
        }
    }

    async function loadCities(department) {
        location['department'] = department && department.name ? department.name : ''
        if(location.department){
            setCities(department.cities ? department.cities : [])
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
                    disabled={ (disabled || !location.department || !location.country) ? true : false} 
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

