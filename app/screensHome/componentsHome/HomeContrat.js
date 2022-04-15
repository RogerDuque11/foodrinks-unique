import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import CurrentScheme from "../../constants/CurrentScheme"
import Constants from "../../constants/Constants"
import Icon from '../../components/Icon'

import FBController from  '../../controllers/FirebaseController'


const HomeContrat = ({ props }) => {
    const { PROFILE, PARTNER, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { navigation, callbackItem } = props
    const [ isLoadingPartner, setLoadingPartner ] = useState(false)
    const [ isLoadingCompany, setLoadingCompany ] = useState(false)
    const [ partner, setPartner] = useState(PARTNER)
    const [ company, setCompany] = useState(COMPANY)

    const permissions = {
        createPartner: PROFILE.usertype === 'ROOT' ? true : false,
        createCompany: PROFILE.usertype === 'ROOT' ? true : false,
        //read: (PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER') ? true : false,
    }
    
    function readPartner(){
        var props = {  REFS: { PARTNER: 'CURRENT' }  }        
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoadingPartner(true)
            setPartner(snapshot.data()) 
            Constants.SESION.PARTNER = snapshot.data()
            setLoadingPartner(false)
        }, (error) => { Constants.NOTIFY('ERROR', error.code, 'HomeLocals/readPartner', error.message) }
        )
    }

    function readCompany(){
        var props = {  REFS: { COMPANY: 'CURRENT' }  }        
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoadingCompany(true)
            setCompany(snapshot.data()) 
            Constants.SESION.COMPANY = snapshot.data()
            setLoadingCompany(false)
        }, (error) => { Constants.NOTIFY('ERROR', error.code, 'HomeLocals/readCompany', error.message) }
        )
    }

    useEffect(() => {
        const getPartner = readPartner()
        return () => getPartner()
    }, [ ])

    useEffect(() => {
        const getCompany = readCompany()
        return () => getCompany()
    }, [ ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }

    return ( 
        <>

        <Text style={[ styles.textSmall, styles.uppercase, styles.colorDefault, styles.marginTiny_B ]}>{trans('contrat')}</Text>
        
        <TouchableOpacity 
            style={[ styles.card, styles.paddingSmall, styles.borderNone, styles.marginTiny_B ]}
            onPress={()=> 
                !permissions.createPartner ? null :
                !partner || !partner.displayName ? launchScreen('CreateUser', {callbackItem: callbackItem, usertype: 'partner'})
                : launchScreen('UpdatePartner', { partner: partner, index: 0, callbackItem: callbackItem })
                } >
                <View style={[ styles.row, styles.alignCenter ]}>
                    <Icon name={'account-circle-outline'} library={''} color={colors.accent} size={size.iconMedium} />
                    <View style={[ styles.marginTiny_L, styles.flex ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textSmall, styles.textBold ]}>{trans('partner')}</Text>
                            <Text style={[ styles.textSmall  ]}>{partner ? trans(partner.state) : ''}</Text>
                        </View>
                        
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>
                            {
                                isLoadingPartner ? trans('loading')
                                : partner ? partner.displayName 
                                : ' - '
                            }
                        </Text>
                    </View>
                </View>
        </TouchableOpacity>
        
        {
        !partner ? null :
        <TouchableOpacity 
            style={[ styles.card, styles.paddingSmall, styles.borderNone, styles.marginTiny_B ]}
            onPress={()=> 
                !permissions.createCompany || !partner ? null :
                !company || !company.name ? launchScreen('CreateCompany', {callbackCreate: callbackItem})
                : launchScreen('UpdateCompany', { company: company, index: 0, callbackUpdate: callbackItem })
                } >
                <View style={[ styles.row, styles.alignCenter ]}>
                    <Icon name={'storefront'} library={'MaterialIcons'} color={colors.accent} size={size.iconMedium} />
                    <View style={[ styles.marginTiny_L, styles.flex ]}>
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <Text style={[ styles.textSmall, styles.textBold ]}>{trans('company')}</Text>
                            <Text style={[ styles.textSmall  ]}>{company ? company.enable ? trans('enabled') : trans('disabled') : ''}</Text>
                        </View>
                        <Text style={[ styles.textSmall, styles.colorDefault ]}>
                            {
                                isLoadingCompany ? trans('loading')
                                : company ? company.name 
                                : ' - '
                            }
                        </Text>
                    </View>
                </View>
        </TouchableOpacity>
        }

        </>
    )
} 



export default HomeContrat