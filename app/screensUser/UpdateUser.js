import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import Button from '../components/Button'
import LoadingScreen from '../components/LoadingScreen'
import PickerImage from '../components/PickerImage'
import PickerUsertype from '../components/PickerUsertype'

import FBController from  '../controllers/FirebaseController'
import User from  '../models/User'


const ShowUserScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { user, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...user})
    const [ update, setUpdate ] = useState(false)
    
    const [usertypes, setUserTypes] = useState({ 0:'profile', admins:'admin', customers:'customer', company:'company', technicals:'technical', sellers:'seller' })
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall
    const permissions = {
        userConfirmed: copy.state === 'PENDING' ? false : true,
    }
    copy.passwordConfirm = copy.password

    const updateHeader = () => {
        const title = update ? 'userEdit' : 'userDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text } 
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
            new User().setValuesFromObject(copy, user)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate ){
            try {
                setUpdate(false)
                var ref = '/USERS/'+copy.uid
                if(user.photoUrl !== copy.photoUrl){
                    copy.photoUrl = await FBController.ST_Upload(ref, copy.photoUrl)
                }
                copy['state'] = permissions.userConfirmed ? 'UPDATED' : 'PENDING'

                /* if(copy.state !== 'PENDING'){
                    var profile = { displayName: copy.displayName, photoUrl: copy.photoUrl, phoneNumber: copy.phoneNumber }
                    var ref2 = copy.usertype === 'PARTNER' ? 'PARTNERS' : 'PARTNERS/'+copy.partner+'/EMPLOYEES'
                    console.log(ref2)
                    await FBController.FS_Update(ref2, copy.uid, profile, 'ORIGIN') 
                } */
                
                await FBController.FS_Update('USERS', copy.uid, copy, 'ORIGIN')
                //await FBController.FS_Update('PARTNERS', copy.uid, { displayName: copy.displayName } ) 

                new User().setValuesFromObject(user, copy)
                callbackItem('UPDATE', copy, index)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateUser/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR USUARIO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        if(permissions.userConfirmed){
            copy['state'] = 'DELETED'
            FBController.FS_Update('USERS', copy.uid, copy, 'ORIGIN')
        }else {
            FBController.FS_Delete('USERS', copy.uid, 'ORIGIN')
        }
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> :
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    {
                        ! permissions.userConfirmed ? null :
                        <View style={[ styles.alignCenter ]} >
                            <PickerImage 
                                imageRounded
                                imageUri={copy.photoUrl}
                                aspectImage={size.aspectAvatar}
                                imageSize={size.imageSmall}
                                callback={ !update? null : (uri)=> copy.photoUrl = uri}
                                imageWidth={imageWidth}
                                quality={0.7}
                                containerStyle={ !update ? [ styles.borderNone ] : [ styles.borderFine ] }
                                style={styles.alignCenter} />
                        </View>
                    }
                    
                    <PickerUsertype 
                        label={trans('usertype')} 
                        labelFirst={'select'} 
                        currentValue={copy.usertype}
                        callback={ (value) => copy.usertype = value }
                        disabled={true} />
                    
                    <InputText
                        tag={trans('name')} type={'default'} autocomplet={'name'}
                        value={(copy.displayName).toString()} editable={update}
                        onChangeText={(text) => copy.displayName = text } />
                    <InputText
                        tag={trans('email')} type={'email-address'} autocomplet={'email'}
                        value={(copy.email).toString()} editable={false} />
                    <InputText
                        tag={trans('phone')} type={'numeric'} autocomplet={'tel'} editable={update}
                        value={(copy.phoneNumber).toString()}
                        onChangeText={(text) => copy.phoneNumber = text } />
                        
                    {
                        PROFILE.usertype !== 'ROOT' ? null :
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <InputText
                                tag={trans('password')} type={'default'} secure={false} editable={update}
                                value={(copy.password).toString()}
                                onChangeText={(text) => copy.password = text }
                                containerStyle={[{width: '48%'}]} />
                            <InputText
                                tag={trans('passwordConfirm')} type={'default'} secure={false} editable={update}
                                value={(copy.passwordConfirm).toString()}
                                onChangeText={(text) => copy.passwordConfirm = text }
                                containerStyle={[{width: '48%'}]} />
                        </View>
                    }
                    
                    <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('disabled')}</Text>
                        <Switch value={copy.disabled} color={colors.primary} onValueChange={!update? null : (value) => copy.disabled = value }></Switch>
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

const validation = (attrs, trans) =>{
    const exep = {};
    const _v = Constants.VALIDATE

    Object.entries(attrs).map(([key, value]) => {
        if(key === 'displayName' || key === 'email' || key === 'phoneNumber' 
        || key === 'password' || key === 'passwordConfirm' || key === 'usertype'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    if((attrs.password && attrs.passwordConfirm) && (attrs.password !== attrs.passwordConfirm)){
        exep['Confirmar'] = '\n * Las contraseñas no coinciden'
    }
    return Object.entries(exep).length !== 0 ? exep : null
}


export default ShowUserScreen


