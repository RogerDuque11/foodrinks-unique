import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import ContentLocation from '../components/ContentLocation'
import ContentEmployee from '../components/ContentEmployee'
import Button from '../components/Button'
import PickerImage from '../components/PickerImage'

import FBController from  '../controllers/FirebaseController'
import Employee from  '../models/Employee'


const UpdateEmployeeScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { employee, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...employee})
    const [ update, setUpdate ] = useState(false)
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidh/3 : size.fullWidh/10) - size.paddingSmall
    const privileges = {
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER',
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false ,
        selectCompany: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'EMPLOYEE' || PROFILE.usertype === 'ADMIN' ? true : false
    }

    const updateHeader = () => {
        const title = update ? 'employeeEdit' : 'employeeDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={ privileges.update ? { title: trans(title), left, right} : { title: trans(title), left } }  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />
            )
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new Employee().setValuesFromObject(copy, employee)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                setUpdate(false)
                var ref = '/USERS/'+copy.uid
                if(copy.photoUrl !== employee.photoUrl){
                    copy.photoUrl = await FBController.ST_Upload(ref, copy.photoUrl, 'ORIGIN')
                } 
                await FBController.FS_Update('EMPLOYEES', copy.uid, copy)
                await FBController.FS_Update('USERS', copy.uid, { displayName: copy.displayName, photoUrl: copy.photoUrl, phoneNumber: copy.phoneNumber, state: 'UPDATED' }, 'ORIGIN')
                new Employee().setValuesFromObject(employee, copy)
                callbackItem('UPDATE', copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateEmployee/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR ASOCIADO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['state'] = 'DELETED'
        FBController.FS_Update('EMPLOYEES', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   :  null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    {
                        <View style={[ styles.alignCenter ]} >
                            <PickerImage 
                                imageRounded
                                imageUri={copy.photoUrl}
                                aspectImage={size.aspectAvatar}
                                imageSize={size.imageSmall}
                                callback={ !update? null : (uri)=> copy.photoUrl = uri}
                                imageWidth={imageWidth}
                                quality={0.7}
                                containerStyle={!update ? [ styles.borderNone, styles.bgInput ] : [ styles.borderFine, styles.bgInput ]}
                                style={styles.alignCenter} />
                        </View>
                    }
                    <InputText
                        label={trans('identification')} type={'numeric'} editable={update} 
                        value={(copy.identification).toString()} 
                        onChangeText={(text) => copy.identification = text } />
                    <InputText
                        label={trans('name')} type={'default'} editable={update} 
                        value={(copy.displayName).toString()} 
                        onChangeText={(text) => copy.displayName = text } />
                    <ContentLocation 
                        location={copy.location} 
                        currentValue={copy.location}
                        callback={(location)=>copy.location = location}
                        disabled={!update} />
                    <ContentEmployee
                        employee={copy} 
                        currentValue={copy}
                        callback={(value)=> console.log(value)}
                        disabled={!update} />
                    {
                        update && privileges.delete ? 
                        <Button  
                            type="clear"
                            title={trans('delete')} 
                            titleStyle={[styles.colorError ]}
                            containerStyle={[styles.marginMedium_T]}
                            onPress={onPressDelete} 
                            />
                        : null
                    }
                    
                </View> 
                
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

export default UpdateEmployeeScreen

