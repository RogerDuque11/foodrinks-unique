import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import Button from '../components/Button'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import Tax from  '../models/Tax'


const UpdateTaxScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { tax, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...tax})
    const [ update, setUpdate ] = useState(false)

    const updateHeader = () => {
        const title = update ? 'taxEdit' : 'taxDetails'
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
            new Tax().setValuesFromObject(copy, tax)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy)
        if( ! exceptionsValidate ){
            try {
                copy.name = (copy.name).toUpperCase()
                setUpdate(false)
                await FBController.FS_Update('TAXES', copy.code, copy)
                new Tax().setValuesFromObject(tax, copy)
                callbackItem('UPDATE', copy, index)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateTax/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR IMPUESTO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['state'] = 'DELETED'
        FBController.FS_Update('TAXES', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : 
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(copy.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'} editable={update}
                        value={(copy.name).toString()}
                        onChangeText={(text) => copy.name = text } />
                    <InputText
                        tag={trans('porcentage')} type={'numeric'} editable={update}
                        value={(copy.porcentage).toString()}
                        onChangeText={(text) => copy.porcentage = text } />
                    <InputText
                        tag={trans('detail')} type={'default'} editable={update}
                        value={(copy.detail).toString()}
                        onChangeText={(text) => copy.detail = text } />

                    <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={copy.enable} color={colors.primary} onValueChange={!update? null : (value) => copy.enable = value }></Switch>
                    </View>
                    {
                        ! update ? null 
                        : <Button  
                            type="clear"
                            title={trans('delete')} 
                            titleStyle={[styles.colorError ]}
                            containerStyle={[styles.marginMedium_T]}
                            onPress={onPressDelete} 
                            />
                    }
                    
                </View> 
                }

            </View>
        </ScrollView>
    )
}

const validation = (attrs) =>{
    const exep = {};
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        key === 'name' ? _v.verifyString(value) ? null : exep.nombre = '\n * Ingrese un nombre valido' : null
        key === 'porcentage' ? _v.verifyHigherEqual(value, 0) ? null : exep.porcentage = '\n * Ingrese un porcentage valido' : null
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateTaxScreen

