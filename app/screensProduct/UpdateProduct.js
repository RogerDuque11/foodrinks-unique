import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import PickerLocal from '../components/PickerLocal'
import PickerImage from '../components/PickerImage'
import PickerLetterMenu from '../components/PickerLetterMenu'
import AddSupplies from '../components/AddSupplies'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import Product from  '../models/Product'


const UpdateProductScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { product, index, callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...product})
    const [ update, setUpdate ] = useState(false)
    
    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false ,
        selectLocal: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'
        || (PROFILE.position === 'ADMIN' && !PROFILE.localCode ) ? true : false
    }
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidh/3 : size.fullWidh/10) - size.paddingSmall

    const updateHeader = () => {
        const title = update ? 'productEdit' : 'productDetails'
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
            new Product().setValuesFromObject(copy, product)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate && LOCAL.companyCode ){
            try {
                setLoading(true)
                setUpdate(false)
                var ref = 'COMPANIES/'+LOCAL.companyCode+'/PRODUCTS/'+product.code
                if(copy.photoUrl !== product.photoUrl){
                    copy.photoUrl = await FBController.ST_Upload(ref, copy.photoUrl, 'ORIGIN')
                } 
                if(copy.supplies !== product.supplies){
                    copy.details = ''
                    Object.values(copy.supplies).forEach((supply)=>{
                        copy.details = (copy.details ? copy.details : '') + supply.name + ', ' 
                    })
                } 
                copy.details = (copy.details).toLowerCase()
                await FBController.FS_Update('PRODUCTS', copy.code, copy)
                new Product().setValuesFromObject(product, copy)
                callbackItem('UPDATE', copy, index)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateProduct/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR ORDEN:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['enable'] = false
        FBController.FS_Update('productS', copy.code, copy)
        callbackItem('DELETE', copy, index)
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   :  null }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm ]}>
                    
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
                    
                    <PickerLocal 
                        label={trans('local')} 
                        labelFirst={'enabledForAll'} 
                        nullable={ PROFILE.localCode ? false : true }
                        currentValue={ copy.local ? {name: copy.local, code: copy.localCode} : {name: trans('enabledForAll')} }
                        disabled={ !permissions.selectLocal ? true : !update }
                        callback={ (value) => {
                            copy.local = (value && value.code ? value.name : '')
                            copy.localCode = (value && value.code ? value.code : '')
                        } } />
                    
                    <PickerLetterMenu 
                        label={trans('letterMenu')} 
                        currentValue={ copy.letterMenu ? {name: copy.letterMenu, code: copy.letterMenuCode} : {name: trans('enabledForAll')} }
                        disabled={ !update }
                        callback={ (value) => {
                            copy.letterMenu = (value && value.code ? value.name : '')
                            copy.letterMenuCode = (value && value.code ? value.code : '')
                        } } />

                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(copy.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'} editable={update}
                        value={(copy.name).toString()}
                        onChangeText={(text) => copy.name = text } />
                    
                    <AddSupplies
                        labelFirst={'select'}
                        label={trans('supply')}
                        disabled={!update}
                        currentValue={copy.supplies}
                        callback={ (value) => copy.supplies = value }
                        styles={[ ]}/>

                    {
                        ! update ? null 
                        : <Button  
                            type="clear"
                            title={trans('delete')} 
                            titleStyle={[styles.colorError ]}
                            containerStyle={[styles.marginMedium_T]}
                            onPress={onPressDelete} 
                            />
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
        if(key === 'code' || key === 'name'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
        if(key === 'supplies' && value.supplies && value.supplies.length === 0){
            exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateProductScreen

