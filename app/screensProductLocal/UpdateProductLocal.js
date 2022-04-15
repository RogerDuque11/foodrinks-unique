import React, {useState, useEffect } from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import PickerPlace from '../components/PickerPlace'
import PickerImage from '../components/PickerImage'
import AddSupplies from '../components/AddSupplies'
import Button from '../components/Button'

import FBController from  '../controllers/FirebaseController'
import ProductLocal from  '../models/ProductLocal'


const UpdateProductLocalScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { productLocal } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ copy, setCopy ] = useState({...productLocal})
    const [ update, setUpdate ] = useState(false)
    
    const place = copy.place ? {name: copy.place, code: copy.placeCode} : null
    
    const permissions = {
        update: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || PROFILE.position === 'ADMIN' ? true : false ,
        selectCompany: PROFILE.usertype === 'ROOT' ? true : false
    }
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall

    const updateHeader = () => {
        const title = update ? 'productLocalEdit' : 'productLocalDetails'
        const left  = update ? { icon: 'close', color: colors.text }
                             : { icon: 'arrow-left', color: colors.text }
        const right = update ? { icon: 'check', color: colors.accent }
                             : { icon: 'edit-3', color: colors.accent, library: 'Feather' }
        const contentStyle = [styles.bgTransparent]
        navigation.setOptions({
            title: '',
            header: () => ( <Header 
                params={ permissions.update ? { title: trans(title), left, right, contentStyle} : { title: trans(title), left, contentStyle } }  
                onPressLeft={()=> update ? onPressCancel() : navigation.goBack(null)}  
                onPressRight={()=> update ? onPressUpdate(): setUpdate(true)} />)
        });
    }
    
    useEffect(() => {
        updateHeader()
        if( !update ){ 
            new ProductLocal().setValuesFromObject(copy, productLocal)
            setLoading(false)
        }
    }, [update, navigation ])

    const onPressUpdate = async () => {
        var exceptionsValidate = validation(copy, trans)
        if( ! exceptionsValidate && LOCAL.companyCode ){
            try {
                setLoading(true)
                /* var ref = 'COMPANY/'+LOCAL.companyCode+'/LOCALS/'+LOCAL.code+'/PRODUCTSLOCAL/'+productLocal.code+'/'
                if(copy.images.image1 !== productLocal.images.image1){
                    copy.images.image1 = await FBController.ST_Upload(ref+'image1', copy.images.image1, {REF: 'LOCALS', CHILD: LOCAL.code})
                }  */
                await FBController.FS_Update('PRODUCTSLOCAL', copy.code, copy, {REF: 'LOCALS', CHILD: LOCAL.code})
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'UpdateProductLocal/onPressUpdate', error.message)
            }
        }else{
            alert('ERROR => EDITAR PRODUCTO LOCAL:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        setLoading(true)
        setUpdate(false)
    }

    const onPressDelete = () => {
        copy['enable'] = false
        FBController.FS_Update('PRODUCTSLOCAL', copy.code, copy, {REF: 'LOCALS', CHILD: LOCAL.code})
        navigation.goBack(null)
    }
    
    return (
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   :  null }
                <View style={[ styles.column, styles.widthForm, styles.marginMedium_B  ]}>
                    <View style={[ styles.container ]} >
                        <PickerImage 
                            //imageRounded
                            imageUri={copy.images.image1 ? copy.images.image1 : copy.photoUrl}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            //callback={ !update? null : (uri)=> copy.images.image1 = uri}
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[styles.imageLarge, styles.imageCover, {width: '100%'} ]}
                            //containerStyle={!update ? [ styles.borderNone, styles.bgInput ] : [ styles.borderFine, styles.bgInput ]}
                            style={styles.alignCenter} />
                                
                        <View style={[ styles.imageLarge, styles.bgOpacityTheme, {marginTop: -size.imageLarge} ]} ></View>
                    </View>

                    <View style={[ styles.paddingMedium_X]}>
                        <InputText
                            tag={trans('code')} type={'default'} editable={false}
                            value={(copy.code).toString()} />
                        <InputText
                            tag={trans('name')} type={'default'} editable={false}
                            value={(copy.name).toString()} />
                        
                        
                        <View style={[ styles.row, styles.justifyBetween ]}>
                            <PickerPlace
                                labelFirst={'select'}
                                label={trans('placePreparation')}
                                disabled={!update}
                                currentValue={place}
                                styles={[ {width: '54%'} ]}
                                callback={ (value) => {
                                    copy.place = (value && value.code ? value.name : '')
                                    copy.placeCode = (value && value.code ? value.code : '')
                                } } />
                            <InputText
                                tag={trans('price')} type={'numeric'} editable={update}
                                value={(copy.price).toString()}
                                onChangeText={(text) => copy.price = text } 
                                containerStyle={[ {width: '44%'} ]} />
                        </View>
                        
                        <AddSupplies
                            labelFirst={'select'}
                            label={trans('supply')}
                            disabled={true}
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

            </View>
        </ScrollView>
    )
}

const validation = (attrs, trans) =>{
    const exep = {}
    const _v = Constants.VALIDATE
    Object.entries(attrs).map(([key, value]) => {
        if(key === 'code' || key === 'name' || key === 'partner' || key === 'price'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
    }})
    return Object.entries(exep).length !== 0 ? exep : null
}

export default UpdateProductLocalScreen

