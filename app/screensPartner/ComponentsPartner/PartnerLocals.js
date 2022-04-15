import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import CurrentScheme from "../../constants/CurrentScheme"
import Constants from "../../constants/Constants"
import LoadingScreen from '../../components/LoadingScreen'
import Icon from '../../components/Icon'


const PartnerCompany = ({ props }) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { company, navigation, isLoading, callbackItem } = props
    
    useEffect(() => {
    }, [ isLoading ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <View style={[ styles.column, styles.card, styles.marginSmall_B ]}>
            <View style={[ styles.row, styles.paddingTiny, styles.alignCenter, styles.border_B ]}>
                <Icon name={'storefront'} library={'MaterialIcons'} color={colors.default} size={size.iconSmall} />
                <Text style={[ styles.flex, styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('company')}</Text>
                <View style={[ styles.row, styles.justifyBetween, styles.alignCenter ]}>
                    {
                        company && company.name ?
                        <TouchableOpacity style={[ styles.paddingTiny_X ]} onPress={()=>launchScreen('UpdateCompany', { company: company, index: 0, callbackUpdate: callbackItem })}>
                            <Text style={[ styles.colorAccent, styles.uppercase ]}>{trans('ver')}</Text>
                        </TouchableOpacity> 
                        :
                        <TouchableOpacity style={[ styles.paddingTiny_X ]} onPress={()=>launchScreen('CreateCompany', {callbackCreate: callbackItem})}>
                            <Text style={[ styles.colorAccent, styles.uppercase ]}>{trans('create')}</Text>
                        </TouchableOpacity> 
                    }
                </View>
            </View>
            {
                company && company.name ?
                <View style={[ styles.column, styles.paddingTiny_Y, styles.paddingSmall_X ]}>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <Text style={[ styles.textBold ]}>{trans('name')}: </Text>
                        <Text>{company ? company.name : ''}</Text>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <Text style={[ styles.textBold ]}>{trans('slogan')}: </Text>
                        <Text>{company ? company.slogan : ''}</Text>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('phone')}: </Text>
                            <Text>{company ? company.phoneNumber : ''}</Text>
                        </View>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('NIT')}: </Text>
                            <Text>{company ? company.nit : ''}</Text>
                        </View>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <Text style={[ styles.textBold ]}>{trans('email')}: </Text>
                        <Text>{company ? company.email : ''}</Text>
                    </View>
                    <View style={[ styles.row, styles.justifyBetween, styles.paddingTiny_B ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('created')}: </Text>
                            <Text>{company ? company.created : ''}</Text>
                        </View>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textBold ]}>{trans('enabled')}: </Text>
                            <Text>{company ? trans(company.enable+'') : ''}</Text>
                        </View>
                    </View>
                </View>
                : <></>
            }
        </View>
    )
} 



export default PartnerCompany