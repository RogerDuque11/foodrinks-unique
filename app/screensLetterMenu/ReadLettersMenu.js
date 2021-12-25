import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadLettersMenuScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])

    async function getData(){
        setLoading(true)
        await FBController.FS_ReadBy('LETTERSMENU', 'enable', '==', true )
        .then((lettersMenu)=>{ setData(lettersMenu) })
        .finally(()=>{ setLoading(false) })
        .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadLettersMenu/getData', error.message) })
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('lettersMenu'),
          headerRight: ()=>( <HeaderRight params={right} onPressRight={()=>launchScreen('CreateLetterMenu', {callbackItem: callbackItem})}/> )
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
        launchScreen('UpdateLetterMenu', { letterMenu: value, index: index, callbackItem: callbackItem })
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <PlatformList props={{ data, isLoading, getData, callbackList }} />
    )
}

const PlatformList = ({ props }) => {
    const { data, isLoading, getData, callbackList } = props
    const { styles, colors, size, isWebDesk } = CurrentScheme()
    const paramsDataList = {
        columnsWidth: !isWebDesk ? [ '22%', '34%', '22%', '22%' ] : [ '10%', '35%', '15%', '10%', '30%' ],
        enableOrder: false,
        paramsOrderList: {
            labelFirst: 'orderby',
            columns: [ 'name', 'details' ]
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
            type: 'GRID',
            icon: { name: 'kitchen', library: 'MaterialIcons', color: colors.default, size: size.iconLarge },
            margin: size.marginTiny,
            styleText1: [ styles.textLighter, styles.uppercase ],
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


export default ReadLettersMenuScreen