import React, {useState, useContext} from 'react';
import { View } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import InputTextIcon from '../components/InputTextIcon';
import Button from '../components/Button';

import FBController from  '../controllers/FirebaseController'
import Controller from  '../controllers/UserController'
import User from  '../models/User'
import Company from '../models/Company';


const RegisterScreen = ({route, navigation}) => {
    const { styles, colors } = CurrentScheme()
    const [user, updateUser] = useState(new User())
    const {LOG_IN} = useContext(route.params.AuthContext)

    user.email = 'errede.soft@gmail.com'
    user.password = '123456'
    user.phoneNumber = '3185636845'
    user.displayName = 'Errede Soft'

    const onPressCreate = async () => {
        if(user.email != '' && user.password != ''){
            try {

                if(user.email.indexOf('#') === 0 && user.email.lastIndexOf('#') === (user.email).length - 1){
                    user.usertype = 'ROOT'
                    Controller.createUser(user)
                } else if(user.email.indexOf('#') === 0 ){
                    user.usertype = 'COMPANY'
                    Controller.createUser(user)
                } else if(user.email.lastIndexOf('#') === (user.email).length - 1 ){
                    user.usertype = 'SELLER'
                    Controller.createUser(user)
                } else {
                    user.usertype = 'CUSTOMER'
                    Controller.createUser(user)
                }
                
                //collector.briefcase = profile.briefcase
                //delete collector.account
                /* var user = new User().userFromAccount(account)
                await FBController.FS_Create('USERS', user.uid, user)
                await FBController.FS_Create('USERS', collector.id, collector)
                var user = new User().userFromCollector(collector)
                user.briefcase = collector.briefcase
                await ControllerUser.createUser(user)
                navigation.goBack(null) */

            } catch (error) {
                alert(error)
            }
        }
    }

    return (
        <View style={[styles.container, styles.row, styles.justifyBetween ]}>
            <View style={[styles.container, styles.paddingMedium, styles.justifyCenter, styles.widthForm ]}>
                <InputTextIcon
                    tag={'Nombre'} type={'default'} inputSize={styles.inputMedium}
                    value={user.email} icon={'account-box-outline'} autocomplet={'name'}
                    onChangeText={(text) => user.displayName = text } />
                <InputTextIcon
                    tag={'Teléfono'} type={'numeric'} inputSize={styles.inputMedium}
                    value={user.email} icon={'cellphone-android'} autocomplet={'tel'}
                    onChangeText={(text) => user.phoneNumber = text } />
                <InputTextIcon
                    tag={'Correo'} type={'email-address'} inputSize={styles.inputMedium}
                    value={user.email} icon={'email-outline'} autocomplet={'email'}
                    onChangeText={(text) => user.email = text } />
                <InputTextIcon
                    tag={'Contraseña'} type={'default'} inputSize={styles.inputMedium}
                    value={user.email} icon={'lock-outline'} autocomplet={'password'} secure={true}
                    onChangeText={(text) => user.password = text } />

                <View style={[styles.row, styles.marginLarge_T]}>
                    <Button 
                        type="outline" title="Iniciar sesion" 
                        containerStyle={[styles.grow]}
                        onPress={()=>navigation.goBack(null)} />
                    <Button 
                        title="Registrarme" 
                        containerStyle={[styles.grow, styles.marginTiny_L]}
                        onPress={()=>onPressCreate()()} />
                </View>
                        
            </View>
        </View>
    )
}

export default RegisterScreen

