import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import LetterMenu from  '../models/LetterMenu'


const UpdateLetterMenuScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { letterMenu, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...letterMenu})
    const [ update, setUpdate ] = useState(false)

    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' ? true : false ,
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' ? true : false
    }

    const updateHeader = () => {
        const title = update ? 'letterMenuEdit' : 'letterMenuDetails'
        const left = { icon: 'close', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={{ title: trans(title), left, right }}  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />)
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new LetterMenu().setValuesFromObject(copy, letterMenu)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate && LOCAL.code ){
            try {
                setLoading(true)
                setUpdate(false)
                await FBController.FS_Update('LETTERSMENU', copy.code, copy, '')
                new LetterMenu().setValuesFromObject(letterMenu, copy)
                callbackItem('UPDATE', copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateLetterMenu/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR SUMINISTRO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['enable'] = false
        FBController.FS_Update('LETTERSMENU', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null } 
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(copy.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'} editable={update}
                        value={(copy.name).toString()}
                        onChangeText={(text) => copy.name = text } />
                    <InputText
                        tag={trans('details')} type={'default'} editable={update}
                        value={(copy.details).toString()}
                        onChangeText={(text) => copy.details = text } />
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
        if(key === 'code' || key === 'name' || key === 'price' || key === 'company'
        || key === 'quantity' || key === 'measure' || key === 'place'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateLetterMenuScreen

