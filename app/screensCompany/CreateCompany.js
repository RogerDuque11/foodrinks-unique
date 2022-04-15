import React, { useState, useLayoutEffect, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import PickerImage from '../components/PickerImage'
import PickeBorder from '../components/PickerBorder'

import FBController from  '../controllers/FirebaseController'
import Company from  '../models/Company'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat

const CreateCompanyScreen = ({route, navigation}) => {
    const { PROFILE, PARTNER } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callbackCreate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    
    const [company, updateCompany] = useState(new Company())
    const [regime, setRegime] = useState([ 'Común', 'Simplificado', 'Ninguno' ])
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall
    
    var date = new Date()

    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check',  color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('companyCreate'), left, right}}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation])

    const onPressCreate = async () => {
        company.code = DateFormat.code(date)
        var exceptionsValidate = validation(company)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                company.email = company.email.toLowerCase()
                company.enable = PARTNER && PARTNER.state === 'ACTIVE' ? true : false
                var ref = 'COMPANY/logo'
                if(company.logo){
                    company.logo = await FBController.ST_Upload(ref, company.logo, 'ORIGIN')
                }
                await FBController.FS_Create('COMPANY', 'CURRENT', company, 'ORIGIN')
                callbackCreate(company)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateCompany/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR EMPRESA:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }

    useEffect(() => {
    }, [ ])

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null  }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B  ]}>
                    
                    <View style={[styles.alignCenter ]} >
                        <PickerImage 
                            imageRounded
                            imageUri={company.logo}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ (uri)=> company.logo = uri }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[ styles.borderFine, styles.bgInput ]} />
                    </View>

                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <PickeBorder 
                            label={trans('regime')} 
                            labelFirst={'select'} 
                            values={regime} 
                            onValueChange={(value) => company['regime'] = value }
                            styles={[ {width: '48%'} ]}/>  
                        <InputText
                            tag={trans('nit')} type={'numeric'} 
                            onChangeText={(text) => company.nit = text }
                            containerStyle={[ {width: '48%'} ]} />
                    </View>
                    
                    <InputText
                        tag={trans('name')} type={'default'} 
                        onChangeText={(text) => company.name = text } />
                    <InputText
                        tag={trans('slogan')} type={'default'} 
                        onChangeText={(text) => company.slogan = text } />
                    <InputText
                        tag={trans('email')} type={'email-address'} autocomplet={'email'}
                        onChangeText={(text) => company.email = text } />
                    <InputText
                        tag={trans('phone')} type={'numeric'} autocomplet={'tel'}
                        onChangeText={(text) => company.phoneNumber = text } />

                </View>
                
            </View>
        </ScrollView>
    )
}

const validation = (attrs) =>{
    const exep = {};
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        key === 'name' ? _v.verifyString(value) ? null : exep.nombre = '\n * Ingrese un nombre valido' : null
        key === 'email' ? _v.verifyString(value) ? null : exep.email = '\n * Ingrese un email valido' : null
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateCompanyScreen

