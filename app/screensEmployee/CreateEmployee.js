import React, { useState, useLayoutEffect } from 'react'
import { ScrollView, View } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import ContentLocation from '../components/ContentLocation'
import ContentEmployee from '../components/ContentEmployee'

import Employee from  '../models/Employee'


const CreateEmployeeScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { user, callbackCreate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    
    const [employee, updateEmployee] = useState({...(new Employee()), ...user})
    const [typeID, setTypeID] = useState([ 'Tipo Identificación', 'Cédula de ciudadanía', 'Cedula extranjería', 'Pasaporte' ])
    const permissions = {
        selectPartner: PROFILE.usertype === 'ROOT' ? true : false,
        selectCompany: PROFILE.usertype === 'ROOT' ? true : false
    }

    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check',  color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('employeeCreate'), left, right}}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation])

    const onPressCreate = async () => {
        var exceptionsValidate = validation(employee, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                delete employee['setValuesFromObject']
                callbackCreate(employee, 'EMPLOYEES')
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateEmployee/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR CUENTA:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        updateEmployee({...(new Employee()), ...user})
        navigation.goBack(null)
    }

    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />  : null  }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B  ]}>
                    
                    <InputText
                        tag={trans('identification')} type={'numeric'} 
                        onChangeText={(text) => employee.identification = text } />
                    <InputText
                        tag={trans('name')} type={'default'} editable={false} 
                        value={(employee.displayName).toString()} />
                    <ContentLocation 
                        location={employee.location} 
                        callback={(location)=>employee.location = location} />
                    <ContentEmployee
                        employee={employee} 
                        callback={(value)=> console.log(value)} />

                </View>
                
            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {};
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'displayName' || key === 'email' || key === 'password' || key === 'identification'
        || key === 'partner'  || key === 'partnerUid'|| key === 'company' || key === 'companyCode'
        || key === 'position' ){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateEmployeeScreen

