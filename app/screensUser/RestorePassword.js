import React, {useState, useContext } from 'react';
import { View } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import InputTextIcon from '../components/InputTextIcon'
import Button from '../components/Button'

import Controller from  '../controllers/UserController'


const RestorePasswordScreen = ({route, navigation}) => {
    const { styles, colors, trans, isWebDesk} = CurrentScheme()
    const width = isWebDesk ? '40%' : '100%'

    const { user } = route.params

    const onPressRestore = async () => {
        try { 
            await Controller.restorePassword(user.email)
            navigation.goBack(null)
        } catch (error) { alert(error) }
    }

    return (
        <View style={[styles.container, styles.alignCenter, styles.justifyCenter  ]}>
            <View style={[styles.column, styles.paddingMedium, styles.widthForm ]}>
                <InputTextIcon
                    tag={trans('email')} type={'email-address'} inputSize={styles.inputMedium}
                    value={user.email} icon={'email-outline'} autocomplet={'email'}
                    onChangeText={(text) => user.email = text } />

                <View style={[styles.row, styles.marginLarge_T]}>
                    <Button 
                        type="outline" title={trans('goBack')} 
                        containerStyle={[styles.grow]}
                        onPress={()=>navigation.goBack(null)} />
                    <Button 
                        title={trans('emailSend')} 
                        containerStyle={[styles.grow, styles.marginTiny_L]}
                        onPress={()=>onPressRestore()} />
                </View>
            </View>
        </View>
    )
}

export default RestorePasswordScreen

