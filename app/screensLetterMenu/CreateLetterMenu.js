import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import Switch from '../components/Switch'

import FBController from  '../controllers/FirebaseController'
import LetterMenu from  '../models/LetterMenu'

const _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateLetterMenuScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ letterMenu, setLetterMenu ] = useState(new LetterMenu())

    var date = new Date()
    letterMenu.code = DateFormat.code(date)
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('letterMenuCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(letterMenu, trans)
        if( ! exceptionsValidate && LOCAL.code ){
            try {
                setLoading(true)
                await FBController.FS_Create('LETTERSMENU', letterMenu.code, letterMenu, '')
                letterMenu.enable ? callbackItem('CREATE', letterMenu) : null
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateLetterMenu/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR SUMINISTRO:\n' + Object.values(exceptionsValidate))
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
                        value={(letterMenu.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => letterMenu.name = text } />
                    <InputText
                        tag={trans('details')} type={'default'}
                        onChangeText={(text) => letterMenu.details = text } />
                        
                </View> 
                
            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'code' || key === 'name'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateLetterMenuScreen

