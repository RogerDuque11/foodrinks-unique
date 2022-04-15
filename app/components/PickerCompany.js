import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'

import Constants from "../constants/Constants"

import FBController from  '../controllers/FirebaseController'


const PickerCompany = (props) => {
    const { styles, callback } = props
    
    const [ company, setCompany ] = useState({})

    function loadCompany() {
        FBController.FS_ReadBy('COMPANY', 'enable', '==', true, 'ORIGIN')
        .then((result)=>{ 
            setCompany(result[0]) 
            Constants.SESION.COMPANY = result[0]
        })
        .finally(()=>{ callback(company) })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerCompany/loadCompany', error.message) })
    }

    useEffect(() => {
        loadCompany()
    }, [ ])

    return (
        <Text style={[styles]}> {(company && company['name']) ? (company['name']).toString() : ''} </Text>
    )
}


export default PickerCompany

