import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import CurrentScheme from "../../constants/CurrentScheme"
import Constants from "../../constants/Constants"
import LoadingScreen from '../../components/LoadingScreen'
import Icon from '../../components/Icon'


const PartnerPerson = ({ props }) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { partner, navigation, isLoading, callbackItem } = props
    
    useEffect(() => {
    }, [ isLoading ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <View style={[ styles.column, styles.card, styles.marginSmall_B ]}>
            <View style={[ styles.row, styles.paddingTiny, styles.alignCenter, styles.border_B ]}>
                <Icon name={'account-circle-outline'} library={''} color={colors.default} size={size.iconSmall} />
                <Text style={[ styles.flex, styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('partner')}</Text>
                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                    {
                        partner && partner.displayName ?
                        <TouchableOpacity style={[ styles.paddingTiny_X ]} onPress={()=>launchScreen('UpdatePartner', { partner: partner, index: 0, callbackItem: callbackItem })}>
                            <Text style={[ styles.colorAccent, styles.uppercase ]}>{trans('ver')}</Text>
                        </TouchableOpacity> 
                        :
                        <TouchableOpacity style={[ styles.paddingTiny_X ]} onPress={()=>launchScreen('CreateUser', {callbackItem: callbackItem, usertype: 'partner'})}>
                            <Text style={[ styles.colorAccent, styles.uppercase ]}>{trans('create')}</Text>
                        </TouchableOpacity> 
                    }
                </View>
            </View>
            {
                partner && partner.displayName ?
                <View style={[ styles.column, styles.paddingTiny_Y, styles.paddingSmall_X ]}>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <Text style={[ styles.textBold ]}>{trans('name')}: </Text>
                        <Text>{partner ? partner.displayName : ''}</Text>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('phone')}: </Text>
                            <Text>{partner ? partner.phoneNumber : ''}</Text>
                        </View>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('identification')}: </Text>
                            <Text>{partner ? partner.identification : ''}</Text>
                        </View>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <Text style={[ styles.textBold ]}>{trans('email')}: </Text>
                        <Text>{partner ? partner.email : ''}</Text>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('created')}: </Text>
                            <Text>{partner ? partner.created : ''}</Text>
                        </View>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('state')}: </Text>
                            <Text>{partner ? trans(partner.state) : ''}</Text>
                        </View>
                    </View>
                </View>
                : <></>
            }
        </View>
    )
} 



export default PartnerPerson