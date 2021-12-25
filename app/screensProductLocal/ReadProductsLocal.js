import React, { useState, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import HeaderRight from '../components/HeaderRight'
import LoadingScreen from '../components/LoadingScreen'
import FlatList from '../components/CustomFlatList'

import FBController from  '../controllers/FirebaseController'


const ReadProductsLocalScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const privileges = {
        create: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false
    }

    function getData(){
        /* if (LOCAL && LOCAL.code && PROFILE.placeCode){
            setLoading(true)
            await FBController.FS_ReadByTwo('PRODUCTSLOCAL', 'enable', '==', true, 'placeCode', '==', PROFILE.placeCode, {REF: 'LOCALS', CHILD: LOCAL.code})
            .then((productsLocal)=>{ setData(productsLocal) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadProductsLocal/getData', error.message) })
        } else if (LOCAL && LOCAL.code){
            setLoading(true)
            await FBController.FS_ReadBy('PRODUCTSLOCAL', 'enable', '==', true, {REF: 'LOCALS', CHILD: LOCAL.code})
            .then((productsLocal)=>{ setData(productsLocal) })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'ReadProductsLocal/getData', error.message) })
        } */
        var localCode = LOCAL.code ? LOCAL.code : ''
        var placeCode = PROFILE.placeCode ? PROFILE.placeCode : ''
        
        var props = {
            REFS: { LOCALS: localCode, PRODUCTSLOCAL: '' },
            QUERIES: placeCode ? {  0: ['enable', '==', true], 1: ['placeCode', '==', placeCode] } : { 0: ['enable', '==', true] },
            ORDER: { name: 'asc' },
            LIMIT: 1
        }
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoading(true)
            var data = []
            snapshot.forEach((doc) => { data.push(doc.data()) });
            setData(data)
            setLoading(false)
        }, (error) => {
            Constants.NOTIFY('ERROR', error.code, 'ReadProductsLocal/getData', error.message)
            }
        )
    }
    
    useLayoutEffect(() => {
        const right = { icon: 'plus', color: colors.accent }
        navigation.setOptions({
          title: trans('productsLocal'),
          headerRight: ()=>( 
            !privileges.create ? null :
            <HeaderRight params={right} onPressRight={()=>launchScreen('CreateProductLocal' )}/> )
        });
    }, [navigation]);
    
    useEffect(() => {
        const read = getData()
        return () => read()
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
        launchScreen('UpdateProductLocal', { productLocal: value })
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
            columns: [ 'name', 'details', 'code', '' ]
        },
        enableFilter: true,
        paramsFilterList: {
            label: 'search',
            columns: ['name', 'details', ]
        },
        enableExport: false,
        paramsExportList: {
            labelFirst: 'export',
            formats: [ 'EXCEL', 'PDF', 'JSON', ]
        },
        paramsItem: {
            right: true,
            type: isWebDesk ? 'GRIDCOVER' : 'CARD',
            image: { rounded: false, label: 'photoUrl', size: isWebDesk ? size.imageMedium : size.imageTiny },
            margin: size.marginTiny,
            styleText1: [  ],
            styleText2: [ {opacity: 0.8} ],
            styleText3: [ styles.marginTiny_T ],
            //styleText3: [ styles.textHeader, styles.colorAccent ],
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


export default ReadProductsLocalScreen