import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import LoadingScreen from '../components/LoadingScreen'
import PickerLocal from '../components/PickerLocal'
import PickerLetterMenu from '../components/PickerLetterMenu'
import PickerImage from '../components/PickerImage'
import AddSupplies from '../components/AddSupplies'

import FBController from  '../controllers/FirebaseController'
import Product from  '../models/Product'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat

const CreateProductScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callbackItem } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ product, setProduct ] = useState(new Product())
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall

    const permissions = {
        selectLocal: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' ? true : false,
    }

    var date = new Date()
    product.code = DateFormat.code(date)
    product.local = PROFILE.local ? PROFILE.local : ''
    product.localCode = PROFILE.localCode ? PROFILE.localCode : ''
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('productCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(product, trans)
        if( ! exceptionsValidate && LOCAL.companyCode ){
            try {
                setLoading(true)
                var ref = 'COMPANY/'+LOCAL.companyCode+'/PRODUCTS/'+product.code
                if(product.photoUrl){
                    product.photoUrl = await FBController.ST_Upload(ref, product.photoUrl, 'ORIGIN')
                } 
                Object.values(product.supplies).forEach((supply)=>{
                    product.details = (product.details ? product.details : '') + supply.name + ', ' 
                })
                product.details = (product.details).toLowerCase()
                await FBController.FS_Create('PRODUCTS', product.code, product)
                product.enable ? callbackItem('CREATE', product) : null
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateProduct/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR PRODUCTO:\n' + Object.values(exceptionsValidate))
        }
    }

    const onPressCancel = () => {
        navigation.goBack(null)
    }

    return (
        <>
        <ScrollView style={[ ]}>
            <View style={[ styles.container, styles.alignCenter ]}>

                { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> : null  }
                <View style={[ styles.column, styles.paddingMedium_X, styles.widthForm, styles.marginMedium_B ]}>
                    
                    <View style={[ styles.alignCenter ]} >
                        <PickerImage 
                            imageRounded
                            imageUri={product.photoUrl}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ (uri)=> product.photoUrl = uri}
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[ styles.borderFine, styles.bgInput ]}
                            style={styles.alignCenter} />
                    </View>
                    
                    <PickerLocal 
                        label={trans('local')} 
                        labelFirst={'enabledForAll'} 
                        currentValue={ PROFILE.local ? {name: PROFILE.local, code: PROFILE.localCode} : null }
                        nullable={ PROFILE.local ? false : true}
                        disabled={ (PROFILE.localCode || !permissions.selectLocal) ? true : false }
                        callback={ (value) => {
                            product.local = (value && value.code ? value.name : '')
                            product.localCode = (value && value.code ? value.code : '')
                        } } />
                    
                    <PickerLetterMenu 
                        label={trans('letterMenu')} 
                        callback={ (value) => {
                            product.letterMenu = (value && value.code ? value.name : '')
                            product.letterMenuCode = (value && value.code ? value.code : '')
                        } } />
                    
                    <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(product.code).toString()} />
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => product.name = text } />
                    
                    <AddSupplies
                        labelFirst={'select'}
                        label={trans('supply')}
                        callback={ (value) => product.supplies = value }
                        styles={[ ]}/>

                </View> 
                
            </View>
        </ScrollView>
        
    </>
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

export default CreateProductScreen

