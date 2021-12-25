import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadEmployeesScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const privileges = {
        create: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false,
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false,
    }

    async function getData(){
        if (COMPANY && COMPANY.code){
            setLoading(true)
            await FBController.FS_ReadByTwo('EMPLOYEES', 'enable', '==', true, 'companyCode', '==', COMPANY.code)
            .then((employes)=>{ setData(employes) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadEmployees/getData', error.message) })
        } else {
            setLoading(true)
            await FBController.FS_ReadBy('EMPLOYEES', 'enable', '==', true, '')
            .then((employes)=>{ setData(employes) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadEmployees/getData', error.message) })
        }
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('employees'),
          headerRight: ()=>( 
            !privileges.create ? null :
            <HeaderRight params={right} onPressRight={()=>launchScreen('CreateUser', {callbackItem: callbackItem, usertype: 'employee'})}/> )
        });
    }, [navigation]);
    
    useEffect(() => {
        getData()
    }, [ ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    const callbackItem = (action, value, index) => {
        switch (action) {
            case 'CREATE': setData(data => [value, ...data]); break
            case 'UPDATE': setData(data => [...data]); break
            case 'DELETE': delete data.splice(index, 1); setData(data => [...data]); break
            default: break
        }
    }

    const callbackList = (value, index) => {
        if(privileges.update){
            launchScreen('UpdateEmployee', { employee: value, index: index, callbackItem: callbackItem })
        }
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <PlatformList props={{ data, isLoading, getData, callbackList }} />
    )
}

const PlatformList = ({ props }) => {
    const { data, isLoading, getData, callbackList } = props
    const { colors, size, isWebDesk } = CurrentScheme()
    const paramsDataList = {
        columnsWidth: !isWebDesk ? [ '22%', '34%', '22%', '22%' ] : [ '10%', '35%', '15%', '10%', '30%' ],
        enableOrder: false,
        paramsOrderList: {
            labelFirst: 'orderby',
            columns: [ 'displayName', 'phoneNumber', 'email', '', 'state' ]
        },
        enableFilter: false,
        paramsFilterList: {
            label: 'search',
            columns: [ 'displayName', 'phoneNumber', 'email', '', 'state' ]
        },
        enableExport: false,
        paramsExportList: {
            labelFirst: 'export',
            formats: [ 'EXCEL', 'PDF', 'JSON', ]
        },
        paramsItem: {
            type: 'CARD',
            image: { rounded: true, label: 'photoUrl', size: size.imageMin },
            margin: size.marginTiny
        }
    }
    return ( 
        <FlatList
            data={data}
            props={paramsDataList} 
            callback={callbackList}
            refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> } 
            style={[  ]}/>
    )
} 



export default ReadEmployeesScreen