import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import TableList from '../components/CustomTableList'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadUsersScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const privileges = {
        create: PROFILE.usertype === 'ROOT' ? true : false,
        update: PROFILE.usertype === 'ROOT' ? true : false
    }

    async function getData(){
        if (PROFILE && PROFILE.usertype === 'ROOT'){
            setLoading(true)
            await FBController.FS_ReadBy('USERS', 'uid', '!=', PROFILE.uid, 'ORIGIN')
            .then((companies)=>{ setData(companies) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadUsers/getData', error.message) })
        } else if (PROFILE && PROFILE.usertype === 'PARTNER'){
            setLoading(true)
            await FBController.FS_ReadBy('USERS', 'partnerUid', '==', PROFILE.uid, 'ORIGIN')
            .then((companies)=>{ setData(companies) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadUsers/getData', error.message) })
        } else {
            setLoading(true)
            await FBController.FS_ReadBy('USERS', 'partnerUid', '==', PROFILE.partnerUid, 'ORIGIN')
            .then((companies)=>{ setData(companies) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadUsers/getData', error.message) })
        }
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('users'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateUser', {callbackItem: callbackItem})}/> )
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
        launchScreen('UpdateUser', { user: value, index: index, callbackItem: callbackItem })
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
        columnsWidth: !isWebDesk ? [ '22%', '34%', '22%', '', '22%' ] : [ '25%', '15%', '25%', '', '15%', '20%' ],
        enableOrder: false,
        paramsOrderList: {
            labelFirst: 'orderby',
            columns: [ 'displayName', 'phoneNumber', 'email', '', 'state', 'usertype' ]
        },
        enableFilter: true,
        paramsFilterList: {
            label: 'search',
            columns: [ 'displayName', 'phoneNumber', 'email', 'state'  ]
        },
        enableExport: false,
        paramsExportList: {
            labelFirst: 'export',
            formats: [ 'EXCEL', 'PDF', 'JSON', ]
        },
        paramsItem: {
            type: 'CARD',
            image: { rounded: true, label: 'photoUrl', size: size.imageMin },
            margin: size.marginMin
        }
    }
    return ( 
        isWebDesk  
        ? <TableList
            data={data} props={paramsDataList} callback={callbackList}
            refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> } 
            style={[  ]}/>
        : <FlatList
            data={data} props={paramsDataList} callback={callbackList}
            refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> } 
            style={[  ]}/>
        
    )
} 


export default ReadUsersScreen