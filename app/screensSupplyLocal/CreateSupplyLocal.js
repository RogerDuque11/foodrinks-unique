import React, {useState, useLayoutEffect, useEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import PickerSupply from '../components/PickerSupply'
import PickerMeasure from '../components/PickerMeasure'
import PickerPlace from '../components/PickerPlace'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import SupplyLocal from  '../models/SupplyLocal'

const _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateSupplyLocalScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ supplyLocal, setSupplyLocal ] = useState(new SupplyLocal())
    
    var date = new Date()
    supplyLocal.code = DateFormat.code(date)
    supplyLocal.place = PROFILE.place ? PROFILE.place : ''
    supplyLocal.placeCode = PROFILE.placeCode ? PROFILE.placeCode : ''
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('supplyCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(supplyLocal, trans)
        if( ! exceptionsValidate && (LOCAL && LOCAL.code) ){
            try {
                setLoading(true)
                await FBController.FS_Create('SUPPLIESLOCAL', supplyLocal.code, supplyLocal, {REF: 'LOCALS', CHILD: LOCAL.code})
                supplyLocal.enable ? callbackItem('CREATE', supplyLocal) : null
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateSupplyLocal/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR SUMINISTRO LOCAL:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>
                
                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />  : null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(supplyLocal.code).toString()} />
                    <PickerSupply
                        labelFirst={'select'}
                        label={trans('supply')}
                        callback={ (value) => {
                            supplyLocal.name = (value && value.code ? value.name : '')
                            supplyLocal.supplyCode = (value && value.code ? value.code : '')
                        } }/>
                        
                    <PickerPlace
                        labelFirst={'enabledForAll'}
                        label={trans('place')}
                        currentValue={supplyLocal.place ? {name: supplyLocal.place} : null }
                        nullable={PROFILE.placeCode ? false : true}
                        disabled={PROFILE.placeCode ? true : false}
                        callback={ (value) => {
                            supplyLocal.place = (value && value.code ? value.name : '')
                            supplyLocal.placeCode = (value && value.code ? value.code : '')
                        } } />
                    

                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <PickerMeasure
                            labelFirst={'select'}
                            label={trans('measure')}
                            callback={ (value) => {
                                supplyLocal.measure = (value && value.code ? value.name : '')
                                supplyLocal.measureCode = (value && value.code ? value.code : '')
                            } }
                            styles={[ {width: '48%'}]}/>
                        <InputText
                            tag={trans('quantity')} type={'numeric'}
                            onChangeText={(text) => supplyLocal.quantity = text }
                            containerStyle={[ {width: '24%'}]} />
                        <InputText
                            tag={trans('price')} type={'numeric'}
                            onChangeText={(text) => supplyLocal.price = text }
                            containerStyle={[ {width: '24%'}]} />
                    </View>

                    <View style={[ styles.row, styles.justifyEnd ]}>
                        <InputText
                            tag={trans('Stock')} type={'numeric'}
                            onChangeText={(text) => supplyLocal.stock = text }
                            containerStyle={[ {width: '24%'}]} />
                    </View>
                    
                    <InputText
                        tag={trans('details')} type={'default'}
                        onChangeText={(text) => supplyLocal.details = text } />

                    {/* <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={supplyLocal.enable} color={colors.primary} onValueChange={(value) => supplyLocal.enable = value }></Switch>
                    </View> */}
                </View> 
                
            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'code' || key === 'name' || key === 'price' || key === 'quantity' 
        || key === 'measure' || key === 'place' || key === 'supplyCode' || key === 'placeCode'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateSupplyLocalScreen

