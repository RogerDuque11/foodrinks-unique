import React, {useState, useContext } from 'react';
import { View, Text } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import InputTextIcon from '../components/InputTextIcon'
import Button from '../components/Button'

import Controller from  '../controllers/UserController'
import User from '../../app/models/User'


const LoginScreen = ({route, navigation}) => {
    const { styles, colors, size, trans} = CurrentScheme()

    const [user, setUser] = useState(new User())
    const {LOG_IN} = useContext(route.params.AuthContext)
    //user.email = 'roger.duque@correounivalle.edu.co'
    //user.email = 'yinethrosana18@gmail.com'
    //user.email = 'roger.duque11@gmail.com'
    //user.email = 'errede.soft@gmail.com'
    //user.password = '123456'

    const onPressLogin = async () => {
        try { 
            await Controller.logInEmailAndPassword(user, LOG_IN)
        } catch (error) { alert(error) }
    }

    return (
        <View style={[styles.container, styles.alignCenter, styles.justifyCenter  ]}>
            <View style={[styles.column, styles.paddingMedium, styles.widthForm ]}>
                <InputTextIcon
                    tag={trans('email')} type={'email-address'} inputSize={styles.inputMedium}
                    value={user.email} icon={'email-outline'} autocomplet={'email'}
                    onChangeText={(text) => user.email = text } />
                <InputTextIcon
                    tag={trans('password')} type={'numeric'} inputSize={styles.inputMedium}
                    value={user.password} icon={'lock-outline'} secure={true}
                    onChangeText={(text) => user.password = text } />

                <View style={[styles.marginLarge_T ]}>
                    <Button title={trans('logIn')} onPress={()=>onPressLogin()} />
                    <Button  
                        type="clear"
                        title={'¿' + trans('passwordForgot') + '?'} 
                        titleStyle={[styles.colorDefault ]}
                        containerStyle={[styles.marginMedium_T]}
                        onPress={()=>navigation.navigate('RestorePass', {user: user})} />
                </View>

            </View>
        </View>
    )
}

export default LoginScreen

