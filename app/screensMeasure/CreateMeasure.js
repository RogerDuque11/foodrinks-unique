import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import Measure from  '../models/Measure'

const _F = Constants.FUNCTIONS

const CreateMeasureScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ measure, setMeasure ] = useState(new Measure())

    var date = new Date()
    //measure.code = DateFormat.code(date)
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('measureCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        measure.code = _F.createKey(measure.name)
        var exceptionsValidate = validation(measure, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                measure.key = measure.key ? measure.key.toLocaleLowerCase() : ""
                await FBController.FS_Create('MEASURES', measure.code, measure, 'ORIGIN')
                callbackItem('CREATE', measure)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateMeasure/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR MEDIDA:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> : null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    {/* <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(measure.code).toString()} /> */}
                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <InputText
                            tag={trans('name')} type={'default'}
                            onChangeText={(text) => measure.name = text } 
                            containerStyle={[ {width: '72%'} ]}/>
                        <InputText
                            tag={trans('key')} type={'default'}
                            onChangeText={(text) => measure.key = text } 
                            containerStyle={[ {width: '24%'} ]}/>
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
        if(key === 'name' || key === 'key'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateMeasureScreen

