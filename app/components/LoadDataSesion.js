import React, { useState, useEffect, useRef} from 'react'
import { Text } from 'react-native'

import Constants from "../constants/Constants"

import FBController from  '../controllers/FirebaseController'


const LoadDataSesion = (props) => {
    const { PROFILE } = Constants.SESION
    const { styles, callbackDataSesion } = props
    
    const [ dataSesion, setDataSesion ] = useState({})
    const partner = useRef({})
    const company = useRef({})

    function getData(){
        loadPartner()
    }

    function loadPartner(){
        if(PROFILE.usertype !== 'ROOT'){
            FBController.FS_ReadBy('PARTNER', 'state', '==', 'ACTIVE', 'ORIGIN')
            .then((data)=>{ 
                setDataSesion(dataSesion => ({...dataSesion, partner: data[0]}))
                partner.current = data[0]
                Constants.SESION.PARTNER = data[0]
            })
            .finally(()=>{ loadCompany() })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'LoadDataSesion/loadPartner', error.message) })
        } else {
            loadCompany()
        }
    }

    function loadCompany() {
        if(PROFILE.usertype !== 'ROOT'){
            FBController.FS_ReadBy('COMPANY', 'enable', '==', true, 'ORIGIN')
            .then((data)=>{ 
                setDataSesion(dataSesion => ({...dataSesion, company: data[0]}))
                company.current = data[0]
                Constants.SESION.COMPANY = data[0]
            })
            .finally(()=>{ callbackDataSesion({...dataSesion, partner: partner.current, company: company.current}) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'LoadDataSesion/loadCompany', error.message) })
        } else {
            FBController.FS_Read('COMPANY')
            .then((data)=>{ 
                setDataSesion(dataSesion => ({...dataSesion, company: data[0]}))
                company.current = data[0]
                Constants.SESION.COMPANY = data[0]
            })
            .finally(()=>{ callbackDataSesion({...dataSesion, partner: partner.current, company: company.current}) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'LoadDataSesion/loadCompany', error.message) })
        }
    }

    useEffect(() => {
        getData()
    }, [ ])

    return (
        (dataSesion && dataSesion.company && dataSesion.company.name) ?
        <Text style={[styles]}> { (dataSesion.company.name).toString() } </Text>
        : <></>
    )
}


export default LoadDataSesion

