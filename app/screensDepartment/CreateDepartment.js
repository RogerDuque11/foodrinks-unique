import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import LoadingScreen from '../components/LoadingScreen'

import FBController from  '../controllers/FirebaseController'
import Department from  '../models/Department'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateDepartmentScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ department, setDepartment ] = useState(new Department())

    var date = new Date()
    department.code = DateFormat.code(date)
    department.details = DateFormat.date(date)
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('departmentCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(department, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                await FBController.FS_Create('DEPARTMENTS', department.code, department)
                department.enable ? callbackItem('CREATE', department) : null
                navigation.goBack(null)
                setLoading(false)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateDepartment/onPressCreate', error.message)
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

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />  : null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(department.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => department.name = text } />
                    <InputText
                        tag={trans('details')} type={'default'}
                        value={(department.details).toString()}
                        onChangeText={(text) => department.details = text } />

                    <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={department.enable} color={colors.primary} onValueChange={(value) => department.enable = value }></Switch>
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

export default CreateDepartmentScreen

