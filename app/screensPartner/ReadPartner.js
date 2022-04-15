import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import LoadingScreen from '../components/LoadingScreen'
import PartnerPerson from './ComponentsPartner/PartnerPerson'
import PartnerCompany from './ComponentsPartner/PartnerCompany'

import FBController from  '../controllers/FirebaseController'


const ReadPartnerScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY, PARTNER} = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const [isLoading, setLoading] = useState(false)
    const [partner, setPartner] = useState(PARTNER)
    const [company, setCompany] = useState(COMPANY)
    const [locals, setLocals] = useState([])


    function getData(){
        readPartner()
        readCompany()
        readLocals()
    }

    function readPartner(){
        setLoading(true)
        FBController.FS_Read('PARTNER')
        .then((data)=>{ 
            setPartner(data[0])
            Constants.SESION.PARTNER = data[0]
         })
        .finally(()=>{ setLoading(false) })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadPartner/getData', error.message) })
    }

    function readCompany(){
        setLoading(true)
        FBController.FS_Read('COMPANY')
        .then((data)=>{ 
            setCompany(data[0]) 
            Constants.SESION.COMPANY = data[0]
        })
        .finally(()=>{ setLoading(false)  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadCompany/getData', error.message) })
    }

    function readLocals(){
        setLoading(true)
        FBController.FS_Read('LOCALS')
        .then((data)=>{ 
            setLocals(data) 
        })
        .finally(()=>{ setLoading(false)  })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadLocals/getData', error.message) })
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('home'),
        });
    }, [navigation]);
    
    useEffect(() => {
        getData()
    }, [  ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    const callbackItem = (action, value, index) => {
        getData()
    }

    const callbackList = (value, index) => {
        launchScreen('UpdatePartner', { partner: value, index: index, callbackItem: callbackItem })
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <ScrollView 
            refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> }
            style={[ styles.paddingSmall_X ]}>

            <PartnerPerson props={{ partner, navigation, callbackItem }} />
            <PartnerCompany props={{ company, navigation, callbackItem }} />


        </ScrollView>
    )
}




export default ReadPartnerScreen