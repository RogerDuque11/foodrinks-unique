import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import Tax from  '../models/Tax'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat

const CreateTaxScreen = ({route, navigation}) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ tax, setTax ] = useState(new Tax())

    var date = new Date()
    tax.code = DateFormat.code(date)
    tax.detail = DateFormat.dateNew(date)
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('taxCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(tax)
        if( ! exceptionsValidate ){
            try {
                tax.name = (tax.name).toUpperCase()
                await FBController.FS_Create('TAXES', tax.code, tax)
                tax.enable ? callbackItem('CREATE', tax) : null
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateTax/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR IMPUESTO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>
                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />
                : <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(tax.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => tax.name = text } />
                    <InputText
                        tag={trans('porcentage')} type={'numeric'}
                        value={(tax.porcentage).toString()}
                        onChangeText={(text) => tax.porcentage = text } />
                    <InputText
                        tag={trans('details')} type={'default'}
                        value={(tax.detail).toString()}
                        onChangeText={(text) => tax.detail = text } />

                    <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={tax.enable} color={colors.primary} onValueChange={(value) => tax.enable = value }></Switch>
                    </View>
                </View> 
                }
            </View>
        </ScrollView>
    )
}

const validation = (attrs) =>{
    const exep = {};
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        key === 'name' ? _v.verifyString(value) ? null : exep.nombre = '\n * Ingrese un nombre valido' : null
        key === 'porcentage' ? _v.verifyHigherEqual(value, 0) ? null : exep.porcentage = '\n * Ingrese un porcentage valido' : null
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateTaxScreen

