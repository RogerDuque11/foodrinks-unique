import React, { useState, useEffect, useLayoutEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import PickerPartner from '../components/PickerPartner'
import PickerImage from '../components/PickerImage'
import PickeBorder from '../components/PickerBorder'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import Company from  '../models/Company'


const UpdateCompanyScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { company, index, callbackUpdate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...company})
    const [ update, setUpdate ] = useState(false)
    const partner = copy.partner ? {displayName: copy.partner, uid: copy.partnerUid} : null
    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' ? true : false ,
        delete: PROFILE.usertype === 'ROOT' ? true : false,
        selectPartner: PROFILE.usertype === 'ROOT' ? true : false,
        selectCompany: PROFILE.usertype === 'ROOT' ? true : false
    }

    const [regime, setRegime] = useState([ 'Común', 'Simplificado', 'Ninguno' ])
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidh/3 : size.fullWidh/10) - size.paddingSmall

    const updateHeader = () => {
        const title = update ? 'companyEdit' : 'companyDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={ permissions.update ? { title: trans(title), left, right} : { title: trans(title), left } }  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />)
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new Company().setValuesFromObject(copy, company)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                //setUpdate(false)
                var ref = 'COMPANIES/'+company.code+'/logo'
                if(company.logo !== copy.logo){
                    copy.logo = await FBController.ST_Upload(ref, copy.logo, 'ORIGIN')
                } 
                await FBController.FS_Update('COMPANIES', copy.code, copy, 'ORIGIN')
                new Company().setValuesFromObject(company, copy)
                callbackUpdate(copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateCompany/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR EMPRESA:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['state'] = 'DELETED'
        FBController.FS_Update('COMPANIES', copy.code, copy, 'ORIGIN')
        callbackUpdate('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> : null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    
                    <View style={[ styles.alignCenter ]} >
                        <PickerImage 
                            imageRounded
                            imageUri={copy.logo}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ !update? null : (uri)=> copy.logo = uri }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={ !update ? [ styles.borderNone ] : [ styles.borderFine ] } />
                    </View>
                    
                    {
                        permissions.selectPartner ?
                        <PickerPartner 
                            label={trans('partner')} 
                            labelFirst={'select'} 
                            currentValue={partner}
                            callback={ (value) => {
                                copy.partner = (value && value.uid ? value.displayName : '')
                                copy.partnerUid = (value && value.uid ? value.uid : '')
                            } } />
                        : <InputText
                            tag={trans('partner')} type={'default'} editable={false}
                            value={partner ? (partner.displayName).toString() : ''}/>
                    }

                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <PickeBorder 
                            label={trans('regime')} 
                            labelFirst={'select'} 
                            currentValue={copy.regime}
                            disabled={!update} 
                            values={regime} 
                            onValueChange={(value) => copy['regime'] = value }
                            styles={[ {width: '48%'} ]}/>  
                        <InputText
                            tag={trans('nit')} type={'numeric'} 
                            value={(copy.nit).toString()} editable={update}
                            onChangeText={(text) => copy.nit = text }
                            containerStyle={[ {width: '48%'} ]} />
                    </View>
                    
                    <InputText
                        tag={trans('name')} type={'default'} 
                        value={(copy.name).toString()} editable={update}
                        onChangeText={(text) => copy.name = text } />
                    <InputText
                        tag={trans('slogan')} type={'default'} 
                        value={(copy.slogan).toString()} editable={update}
                        onChangeText={(text) => copy.slogan = text } />
                    <InputText
                        tag={trans('email')} type={'email-address'} autocomplet={'email'}
                        value={(copy.email).toString()} editable={update}
                        onChangeText={(text) => copy.email = text } />
                    <InputText
                        tag={trans('phone')} type={'numeric'} autocomplet={'tel'}
                        value={(copy.phoneNumber).toString()} editable={update}
                        onChangeText={(text) => copy.phoneNumber = text } />

                    {
                        PROFILE.companytype === 'ROOT' ?
                        <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                            <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                            <Switch value={copy.enable} color={colors.primary} onValueChange={(value) => copy.enable = value }></Switch>
                        </View> : null
                    }

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

const validation = (attrs) =>{
    const exep = {};
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        key === 'name' ? _v.verifyString(value) ? null : exep.nombre = '\n * Ingrese un nombre valido' : null
        key === 'email' ? _v.verifyString(value) ? null : exep.email = '\n * Ingrese un email valido' : null
    })
    return Object.entries(exep).length !== 0 ? exep : null
}


export default UpdateCompanyScreen


