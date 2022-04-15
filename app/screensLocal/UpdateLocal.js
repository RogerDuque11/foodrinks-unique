import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import PickerImage from '../components/PickerImage'
import ContentLocation from '../components/ContentLocation'
import Button from '../components/Button'
import OptionsLocal from './OptionsLocal'

import FBController from  '../controllers/FirebaseController'
import Local from  '../models/Local'

var _F = Constants.FUNCTIONS

const UpdateLocalScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { local, index, callbackUpdate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...local})
    const [ update, setUpdate ] = useState(false)
    
    const permissions = {
        showOptions: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' 
        || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode) ? true : false ,
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' 
        || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode) ? true : false ,
        delete: PROFILE.usertype === 'ROOT'? true : false ,
    }
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall

    const updateHeader = () => {
        const title = update ? 'localEdit' : 'localDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={ permissions.update ? { title: trans(title), left, right} : { title: trans(title), left } }  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />
            )
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new Local().setValuesFromObject(copy, local)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                setUpdate(false)
                var ref = 'COMPANY/cover_'+local.code
                if(local.imageCover !== copy.imageCover){
                    copy.imageCover = await FBController.ST_Upload(ref, copy.imageCover, 'ORIGIN')
                }
                if(local.imageLogo !== copy.imageLogo){
                    copy.imageLogo = await FBController.ST_Upload(ref+'logo', copy.imageLogo, 'ORIGIN')
                }
                await FBController.FS_Update('LOCALS', copy.code, copy, 'ORIGIN')
                new Local().setValuesFromObject(local, copy)
                callbackUpdate(copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateLocal/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR LUGAR PREPARACIÓN:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['state'] = 'DELETED'
        FBController.FS_Update('LOCALS', copy.code, copy)
        callbackUpdate('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   :  null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    
                    <View style={[styles.flex, styles.alignCenter ]} >
                        <PickerImage 
                            imageSize={size.fullWidth-size.marginLarge}
                            imageUri={copy.imageCover}
                            aspectImage={size.aspectBanner}
                            callback={ !update? null : (uri)=> copy.imageCover = uri }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[styles.imageMedium, styles.imageCover, styles.bgCard ]} />
                        <PickerImage 
                            imageRounded
                            imageUri={COMPANY.logo}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ null }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[ styles.borderFine, {marginTop: -size.imageSmall/2, borderWidth: 2 }]} />
                    </View>

                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <InputText
                            tag={trans('company')} type={'default'} containerStyle={[ {width: '48%'}]}
                            value={(COMPANY.name).toString()} editable={false} />
                        <InputText
                            tag={trans('local')} type={'default'} containerStyle={[ {width: '48%'}]} editable={update}
                            value={(copy.name).toString()}
                            onChangeText={(text) => copy.name = text } />
                    </View>
                    <InputText
                        tag={trans('email')} type={'email-address'} editable={update}
                        value={(copy.email).toString()}
                        onChangeText={(text) => copy.email = text } />
                    <InputText
                        tag={trans('phoneNumber')} type={'numeric'} editable={update}
                        value={(copy.phoneNumber).toString()}
                        onChangeText={(text) => copy.phoneNumber = text } />
                    
                    <ContentLocation 
                        location={copy.location} 
                        currentValue={copy.location}
                        callback={(location)=>copy.location = location}
                        disabled={!update} />

                    {
                        update && permissions.delete ? 
                        <>
                            <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                                <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                                <Switch value={copy.enable} color={colors.primary} onValueChange={!update? null : (value) => copy.enable = value }></Switch>
                            </View>
                            <Button  
                                type="clear"
                                title={trans('delete')} 
                                titleStyle={[styles.colorError ]}
                                containerStyle={[styles.marginMedium_T]}
                                onPress={onPressDelete} 
                            /> 
                        </> : null
                    }

                    {
                        !update && permissions.showOptions ? 
                            <OptionsLocal props={{ local, navigation }} />
                        : null
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
        if(key === 'name' || key === 'code'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateLocalScreen

