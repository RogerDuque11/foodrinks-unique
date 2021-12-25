import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import Table from  '../models/Table'


const UpdateTableScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { table, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...table})
    const [ update, setUpdate ] = useState(false)
    
    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false ,
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false
    }

    const updateHeader = () => {
        const title = update ? 'tableEdit' : 'tableDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={ permissions.update ? { title: trans(title), left, right} : { title: trans(title), left } }  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />
            )
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new Table().setValuesFromObject(copy, table)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                setUpdate(false)
                await FBController.FS_Update('TABLES', copy.code, copy, {REF: 'LOCALS', CHILD: LOCAL.code})
                new Table().setValuesFromObject(table, copy)
                callbackItem('UPDATE', copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateTable/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR MESA:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['enable'] = false
        FBController.FS_Update('TABLES', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   :  null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    <InputText
                        tag={trans('number')} type={'numeric'} editable={false}
                        value={(copy.number).toString()} />
                    {
                        update && permissions.delete ?
                        <Button  
                            type="clear"
                            title={trans('delete')} 
                            titleStyle={[styles.colorError ]}
                            containerStyle={[styles.marginMedium_T]}
                            onPress={onPressDelete} 
                        /> : null
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
        if(key === 'number'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateTableScreen

