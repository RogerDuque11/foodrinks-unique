import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadSuppliesLocalScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])

    async function getData(){
        if (LOCAL && LOCAL.code && PROFILE.placeCode){
            setLoading(true)
            await FBController.FS_ReadByTwo('SUPPLIESLOCAL', 'enable', '==', true, 'placeCode', '==', PROFILE.placeCode, {REF: 'LOCALS', CHILD: LOCAL.code})
            .then((suppliesLocal)=>{ setData(suppliesLocal) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadSuppliesLocal/getData', error.message) })
        } else if (LOCAL && LOCAL.code){
            setLoading(true)
            await FBController.FS_ReadBy('SUPPLIESLOCAL', 'enable', '==', true, {REF: 'LOCALS', CHILD: LOCAL.code})
            .then((suppliesLocal)=>{ setData(suppliesLocal) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadSuppliesLocal/getData', error.message) })
        }
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('suppliesLocal'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateSupplyLocal', {callbackItem: callbackItem})}/> )
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
        launchScreen('UpdateSupplyLocal', { supplyLocal: value, index: index, callbackItem: callbackItem })
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
            columns: [ 'name' ]
        },
        enableFilter: true,
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
            icon: { name: 'kitchen', library: 'MaterialIcons', color: colors.default, size: size.iconSmall },
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


export default ReadSuppliesLocalScreen