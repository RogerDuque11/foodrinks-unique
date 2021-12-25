import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import InputText from './InputText'

const ContentContact = ({ props, callback }) => {
    const { styles, trans } = CurrentScheme()
    const { contact } = props

    useEffect(() => {
    }, [ ])

    function changeInfoContact (key, value) {
        key === 'email' ? contact.email = value
        : contact.phoneNumber = value
        callback(contact)
    }

    return (
        !contact ? <></>
        :<View style={[ styles.column ]}>
            <InputText
                tag={trans('email')} type={'email-address'} autocomplet={'email'}
                onChangeText={(value) => changeInfoContact('email', value) } />
            <InputText
                tag={trans('phone')} type={'numeric'} autocomplet={'tel'}
                onChangeText={(value) => changeInfoContact('phoneNumber', value) } />
        </View>
    )
}


export default ContentContact

