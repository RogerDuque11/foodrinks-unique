import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadTaxesScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])

    async function getData(){
        setLoading(true)
        await FBController.FS_ReadBy('TAXES', 'state', '!=', 'DELETED')
        .then((taxes)=>{ setData(taxes) })
        .finally(()=>{ setLoading(false) })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadTaxes/getData', error.message) })
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('taxes'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateTax', {callbackItem: callbackItem})}/> )
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
        launchScreen('UpdateTax', { tax: value, index: index, callbackItem: callbackItem })
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
            columns: [ 'porcentage', 'name', 'detail', 'code', 'enable' ]
        },
        enableFilter: false,
        paramsFilterList: {
            label: 'search',
            columns: [ 'porcentage', 'name', 'detail', ]
        },
        enableExport: false,
        paramsExportList: {
            labelFirst: 'export',
            formats: [ 'EXCEL', 'PDF', 'JSON', ]
        },
        paramsItem: {
            type: 'GRID',
            //image: { rounded: true, label: 'photoUrl', size: size.imageMin },
            icon: { name: 'briefcase-plus-outline', library: '', color: colors.default, size: size.iconSmall },
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


export default ReadTaxesScreen