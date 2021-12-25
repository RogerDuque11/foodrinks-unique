import React, { useState, useLayoutEffect, useEffect } from 'react'
import { ScrollView, View } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import ContentLocation from '../components/ContentLocation'

import Partner from  '../models/Partner'


const CreatePartnerScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { user, callbackCreate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    
    const [partner, updatePartner] = useState({...(new Partner()), ...user})
    const [typeID, setTypeID] = useState([ 'Tipo Identificación', 'Cédula de ciudadanía', 'Cedula extranjería', 'Pasaporte' ])
    
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check',  color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('partnerCreate'), left, right}}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(partner, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                delete partner['setValuesFromObject']
                delete partner['partner']
                callbackCreate(partner, 'PARTNERS')
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreatePartner/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR ASOCIADO:\n' + Object.values(exceptionsValidate))
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
                
                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />
                : <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B  ]}>
                    <InputText
                        tag={trans('name')} type={'default'} editable={false} 
                        value={(partner.displayName).toString()} />
                    <InputText
                        tag={trans('identification')} type={'numeric'} 
                        onChangeText={(text) => partner.identification = text } />
                    <ContentLocation 
                        location={partner.location}
                        callback={(location)=>partner.location = location} />
                </View>
                }

            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'displayName' || key === 'email' || key === 'identification'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreatePartnerScreen

