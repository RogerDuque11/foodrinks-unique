import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import PickerSupply from '../components/PickerSupply'
import PickerMeasure from '../components/PickerMeasure'
import PickerPlace from '../components/PickerPlace'
import LoadingScreen from '../components/LoadingScreen'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import SupplyLocal from  '../models/SupplyLocal'


const UpdateSupplyLocalScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { supplyLocal, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...supplyLocal})
    const [ update, setUpdate ] = useState(false)

    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false ,
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false,
        selectPlace: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'
        || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode ) ? true : false
    }

    const updateHeader = () => {
        const title = update ? 'supplyLocalEdit' : 'supplyLocalDetails'
        const left = { icon: 'close', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={{ title: trans(title), left, right }}  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />)
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new SupplyLocal().setValuesFromObject(copy, supplyLocal)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate && (LOCAL && LOCAL.code) ){
            try {
                setLoading(true)
                setUpdate(false)
                await FBController.FS_Update('SUPPLIESLOCAL', copy.code, copy, {REF: 'LOCALS', CHILD: LOCAL.code})
                new SupplyLocal().setValuesFromObject(supplyLocal, copy)
                //callbackItem('UPDATE', copy, index)
                navigation.goBack(null)
                setLoading(false)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateSupplyLocal/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR SUMINISTRO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['state'] = 'DELETED'
        FBController.FS_Update('SUPPLIESLOCAL', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null } 
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(copy.code).toString()} />
                    
                    <PickerSupply
                        labelFirst={'select'}
                        label={trans('supply')}
                        currentValue={ copy.supplyCode ? {name: copy.name, code: copy.supplyCode} : null }
                        disabled={!update}
                        callback={ (value) => {
                            copy.name = (value && value.code ? value.name : '')
                            copy.supplyCode = (value && value.code ? value.code : '')
                        } } />
                        
                    <PickerPlace
                        labelFirst={'enabledForAll'}
                        label={trans('place')}
                        nullable={ PROFILE.placeCode ? false : true }
                        currentValue={ copy.placeCode ? {name: copy.place, code: copy.placeCode} : null }
                        disabled={ PROFILE.placeCode || !permissions.selectPlace ? true : !update }
                        callback={ (value) => {
                            copy.place = (value && value.code ? value.name : '')
                            copy.placeCode = (value && value.code ? value.code : '')
                        } }/>

                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <PickerMeasure
                            labelFirst={'select'}
                            label={trans('measure')}
                            disabled={!update}
                            currentValue={ copy.measure ? {name: copy.measure, code: copy.measureCode} : null }
                            callback={ (value) => {
                                copy.measure = (value && value.code ? value.name : '')
                                copy.measureCode = (value && value.code ? value.code : '')
                            } }
                            styles={[ {width: '48%'}]}/>
                        <InputText
                            tag={trans('quantity')} type={'numeric'} editable={update}
                            value={(copy.quantity).toString()}
                            onChangeText={(text) => copy.quantity = text }
                            containerStyle={[ {width: '24%'}]} />
                        <InputText
                            tag={trans('price')} type={'numeric'} editable={update}
                            value={(copy.price).toString()}
                            onChangeText={(text) => copy.price = text }
                            containerStyle={[ {width: '24%'}]} />
                    </View>

                    <View style={[ styles.row, styles.justifyEnd ]}>
                        <InputText
                            tag={trans('Stock')} type={'numeric'} editable={update}
                            value={(copy.stock).toString()}
                            onChangeText={(text) => copy.stock = text }
                            containerStyle={[ {width: '24%'}]} />
                    </View>
                    
                    <InputText
                        tag={trans('details')} type={'default'} editable={update}
                        value={(copy.details).toString()}
                        onChangeText={(text) => copy.details = text } />

                    {/* <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={copy.enable} color={colors.primary} onValueChange={!update? null : (value) => copy.enable = value }></Switch>
                    </View> */}
                    {
                        update && permissions.delete ?
                        <Button  
                            type="clear"
                            title={trans('delete')} 
                            titleStyle={[styles.colorError ]}
                            containerStyle={[styles.marginMedium_T]}
                            onPress={onPressDelete} 
                        /> : null
                    }
                    
                </View> 

            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'code' || key === 'name' || key === 'price' || key === 'quantity' 
        || key === 'measure' || key === 'place' || key === 'supplyCode' || key === 'placeCode'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateSupplyLocalScreen

