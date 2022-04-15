import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform, TouchableOpacity } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"

import Button from '../components/Button'
import Icon from '../components/Icon'

var _F = Constants.FUNCTIONS

const OptionsLocal = ({ props }) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { local, navigation } = props

    return (
        <View style={[ styles.row, styles.justifyBetween, styles.marginSmall_Y ]} >

            <TouchableOpacity 
                style={[ styles.card, styles.paddingTiny, styles.column, styles.alignCenter, {width: '48%'} ]}
                onPress={()=>navigation.navigate('ReadPlacesPreparation', {local} )} >
                <Icon name={'fire'} size={size.iconSmall} color={colors.accent} library={'SimpleLineIcons'} />
                <Text>{trans('places')}</Text>
            </TouchableOpacity> 

            <TouchableOpacity 
                style={[ styles.card, styles.paddingTiny, styles.column, styles.alignCenter, {width: '48%'} ]}
                onPress={()=>navigation.navigate('ReadEmployees', {local} )} >
                <Icon name={'account-circle-outline'} size={size.iconSmall} color={colors.accent} library={''} />
                <Text>{trans('employees')}</Text>
            </TouchableOpacity> 

        </View>
    )

}


export default OptionsLocal