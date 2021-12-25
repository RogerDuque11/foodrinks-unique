import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import PickerUsertype from '../components/PickerUsertype'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import User from  '../models/User'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateUserScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    
    const [user, setUser] = useState(new User())
    const privileges = {
        isRoot: PROFILE.usertype === 'ROOT' ? true : false,
        selectPartner: PROFILE.usertype === 'ROOT' ? true : false,
        selectCompany: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.usertype === 'ADMIN' ? true : false
    }
    
    user.usertype = route.params.usertype ? route.params.usertype : ''
    user.passwordConfirm = ''
    var date = new Date()
    user.dateCreate = DateFormat.date(date)
    user.author = PROFILE ? PROFILE.uid : ''

    //data test
    user.displayName = 'Jesus Duque'
    user.email = 'jesus@gmail.com'
    user.phoneNumber = '3154234404'
    user.password = '123456'
    user.passwordConfirm = '123456'
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check',  color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('userCreate'), left, right}}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(user, trans)
        if( ! exceptionsValidate ){
            try {
                user.email = user.email.toLowerCase()
                const duplicate = await FBController.FS_ReadBy('USERS', 'email', '==', user.email)
                if(duplicate.length > 0){
                    alert('ERROR => CREAR USUARIO:\n' + 'Ya existe un usuario con el email:\n' + user.email)
                }else{
                    user.uid = 'TEMP_' + DateFormat.code(date)
                    user.usertype = user.usertype.toUpperCase()
                    delete user['passwordConfirm']
                    completeProfile(user.usertype)
                }
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateUser/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR USUARIO:\n' + Object.values(exceptionsValidate))
        }
    }

    const callbackCreate = async (profile, ref) => {
        try {
            setLoading(true)
            await FBController.FS_Create('USERS', profile.uid, profile, 'ORIGIN')
            setLoading(false)
            navigation.goBack(null)
        } catch (error) {
            Constants.NOTIFY('ERROR', error.code, 'CreateUser/callbackCreate', error.message)
        }
    }

    const completeProfile = (profile) =>{
        switch (profile) {
            case 'PARTNER': navigation.navigate('CreatePartner', {user: user, callbackCreate: callbackCreate}); break
            case 'ADMIN': navigation.navigate('CreateEmployee', {user: user, callbackCreate: callbackCreate}); break
            case 'COMPANY': navigation.navigate('CreateCompany', {user: user, callbackCreate: callbackCreate}); break
            case 'EMPLOYEE': navigation.navigate('CreateEmployee', {user: user, callbackCreate: callbackCreate}); break
            default: break
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }
    

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />
                : <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    
                    <PickerUsertype 
                        label={trans('usertype')} 
                        labelFirst={'select'} 
                        currentValue={user.usertype}
                        callback={ (value) => user.usertype = value }
                        disabled={user.usertype ? true : false} />
                    
                    <InputText
                        tag={trans('name')} type={'default'} autocomplet={'name'}
                        onChangeText={(text) => user.displayName = text } />
                    <InputText
                        tag={trans('email')} type={'email-address'} autocomplet={'email'}
                        onChangeText={(text) => user.email = text } />
                    <InputText
                        tag={trans('phone')} type={'numeric'} autocomplet={'tel'}
                        onChangeText={(text) => user.phoneNumber = text } />
                        
                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <InputText
                            tag={trans('password')} type={'default'} secure={true}
                            onChangeText={(text) => user.password = text }
                            containerStyle={[{width: '48%'}]} />
                        <InputText
                            tag={trans('passwordConfirm')} type={'default'} secure={true}
                            onChangeText={(text) => user.passwordConfirm = text }
                            containerStyle={[{width: '48%'}]} />
                    </View>

                </View>
                }    

            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
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

export default CreateUserScreen

