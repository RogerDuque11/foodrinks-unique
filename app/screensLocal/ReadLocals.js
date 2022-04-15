import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl, Text } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadLocalsScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const permissions = {
        create: PROFILE.usertype === 'ROOT' ? true : false,
        read: (PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER') ? true : false,
    }

    function getData(){
        setLoading(true)
        if(Constants.SESION.COMPANY && Constants.SESION.COMPANY.name){
            FBController.FS_ReadBy('LOCALS', 'enable', '==', true, 'ORIGIN')
            .then((locals)=>{ setData(locals) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadLocals/getData', error.message) })
        }else {
            setLoading(false)
        }
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('locals'),
          headerRight: ()=>(
            !permissions.create ? null :
            <HeaderRight params={right} onPressRight={()=>launchScreen('CreateLocal', {callbackCreate: callbackItem})}/> )
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
        Constants.SESION.LOCAL = value;
        launchScreen('UpdateLocal', { local: value, index: index, callbackUpdate: callbackItem })
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : !permissions.read ? <Text style={[ styles.paddingMedium ]}>No existe una empresa ó no tiene permiso para ver los locales</Text>
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
            columns: [ 'name', 'phoneNumber' ]
        },
        enableFilter: false,
        paramsFilterList: {
            label: 'search',
            columns: [ 'name' ]
        },
        enableExport: false,
        paramsExportList: {
            labelFirst: 'export',
            formats: [ 'EXCEL', 'PDF', 'JSON', ]
        },
        paramsItem: {
            type: 'GRIDCOVER',
            image: { rounded: false, label: 'imageCover', size: size.imageMedium },
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


export default ReadLocalsScreen