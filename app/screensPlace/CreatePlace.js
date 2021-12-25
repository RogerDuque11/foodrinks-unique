import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import Place from  '../models/Place'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreatePlaceScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ place, setPlace ] = useState(new Place())

    var date = new Date()
    place.code = DateFormat.code(date)
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('placeCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(place, trans)
        if( ! exceptionsValidate && (LOCAL && LOCAL.code) ){
            try {
                setLoading(true)
                await FBController.FS_Create('PLACES', place.code, place, {REF: 'LOCALS', CHILD: LOCAL.code})
                place.enable ? callbackItem('CREATE', place) : null
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreatePlace/onPressCreate', error.message)
                setLoading(false)
            }
        }else{
            alert('ERROR => CREAR LUGAR PREPARACIÓN:\n' + Object.values(exceptionsValidate))
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
                        value={(place.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => place.name = text } />
                    <InputText
                        tag={trans('details')} type={'default'}
                        value={(place.details).toString()}
                        onChangeText={(text) => place.details = text } />

                    <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={place.enable} color={colors.primary} onValueChange={(value) => place.enable = value }></Switch>
                    </View>

                </View> 

            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'name' || key === 'code'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreatePlaceScreen

