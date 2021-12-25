import React, { useState, useEffect, useLayoutEffect } from 'react'
import { ScrollView, View, Text, Image  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Animated } from "react-native"

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Header from '../components/Header'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import Button from '../components/Button'

import Company from '../models/Company'


const ShowCompanyScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const [company, setCompany] = useState( route.params.company ? route.params.company : new Company() )

    useLayoutEffect(() => {
        const left  = { icon: 'arrow-left', color: colors.text }
        const right = { icon: 'edit-3', color: colors.text, library: 'Feather', label:trans('edit') }
        const contentStyle = [styles.bgTransparent]
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{title:'', left, right, contentStyle }}  
            onPressLeft={()=>navigation.goBack(null)}  
            onPressRight={()=>updateCompany()} />)
        })
    }, [navigation]);

    useEffect(() => {
        setCompany( route.params.company ? route.params.company : new Company() )
    }, [company])

    const updateCompany = () =>{
        navigation.navigate('UpdateCompany', { company: company, index: 0, callbackUpdate: callbackUpdate })
    }

    const callbackUpdate = (value, index) => {
        Constants.COMPANY = value
        setCompany(value)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { ! company.name ? <></>
                : <View style={[ styles.column, styles.widthForm]}>
                    
                    <View style={[styles.container ]}>
                        <Avatar 
                            size={size.fullWidth}  
                            title={company.name[0]}
                            source={ company.images.cover ? {uri: company.images.cover} : null} 
                            containerStyle={[styles.imageLarge, styles.imageCover, {width: '100%'} ]} 
                            />
                        <View style={[ styles.imageLarge, styles.bgOpacityTheme, {marginTop: -size.imageLarge} ]} ></View>
                        {/* <LinearGradient
                            colors={["rgba(26, 0, 156, .8)", "rgba(26, 188, 156, .8)"]}
                            style={[ styles.imageScreen, {marginTop: - size.imageScreen } ]} 
                        /> */}
                    </View>
            
                    <View style={[ styles.bgCard, styles.paddingSmall_X, styles.paddingSmall_B, styles.marginTiny_X, styles.radiusSmall, {marginTop: - size.imageLarge/3} ]} >
                        <View style={[ styles.alignCenter ]} >
                            <Avatar 
                                rounded
                                size={size.imageSmall}  
                                title={company.name[0]}
                                source={ company.images.logo ? {uri: company.images.logo} : null} 
                                containerStyle={[ styles.marginTiny_B, {marginTop: -size.imageSmall/2 }]} />

                            <View style={[ styles.alignCenter, styles.paddingTiny ]}>
                                <Text style={[ styles.textHeader, styles.textBold ]} >{company.name} </Text>
                                <Text style={[ styles.textMedium, ]}>{ company.slogan }</Text>
                            </View>
                        </View>

                        <View style={[ styles.row, styles.marginSmall_T ]}>
                            <Icon name="phone" size={size.iconTiny} color={colors.text} library={'Feather'} />
                            <Text style={[styles.textMedium, styles.marginTiny_L ]} >{company.phoneNumber + ' / ' + company.phoneNumber}</Text>
                        </View>
                        <View style={[ styles.row, styles.marginTiny_Y ]}>
                            <Icon name="email-outline" size={size.iconTiny} color={colors.text} />
                            <Text style={[styles.textMedium, styles.marginTiny_L ]} >{company.email}</Text>
                        </View> 
                        <View style={[ styles.row, styles.marginTiny_B ]}>
                            <Icon name="map-marker-outline" size={size.iconTiny} color={colors.text} />
                            <Text style={[styles.textMedium, styles.marginTiny_L ]} >{company.location.city + ' - ' + company.location.department + '\n' + company.location.address}</Text>
                        </View> 
                    </View>
                
                    {
                        //user.displayName == 'company' ?
                        <View style={[styles.bgCard, styles.paddingSmall, styles.marginTiny, styles.radiusSmall, ]} >
                            <View style={[styles.row]}>
                                <Text style={[styles.textMedium, styles.marginTiny_L ]} >NIT: {company.nit} </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.textMedium, styles.marginTiny_L ]} >Regimen: {company.regime} </Text>
                            </View>
                        </View>
                        //: null
                    }
                </View>
                }
            </View>
        </ScrollView>
    )
}


export default ShowCompanyScreen


