import React, {useState, useLayoutEffect, useRef} from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import LoadingScreen from '../components/LoadingScreen'
import PickerPartner from '../components/PickerPartner'
import PickerCompany from '../components/PickerCompany'
import PickerPlace from '../components/PickerPlace'
import PickerImage from '../components/PickerImage'
import PickerRecipe from '../components/PickerRecipe'
import AddSupplies from '../components/AddSupplies'

import FBController from  '../controllers/FirebaseController'
import ProductLocal from  '../models/ProductLocal'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat

const CreateProductLocalScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const [ isLoading, setLoading ] = useState(false)
    const [ productLocal, setProductLocal ] = useState(new ProductLocal())
    const product = useRef(productLocal)
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall

    const permissions = {
        selectPlace: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' 
        || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode) ? true : false,
    }

    product.current.place = PROFILE.place ? PROFILE.place : ''
    product.current.placeCode = PROFILE.placeCode ? PROFILE.placeCode : ''
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        const contentStyle = [styles.bgTransparent]
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('productLocalCreate'), left, right, contentStyle }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(product.current, trans)
        if( ! exceptionsValidate && LOCAL.code){
            try {
                setLoading(true)
                product.current.images['image1'] = ''
                product.current['local']
                product.current['localCode']
                await FBController.FS_Create('PRODUCTSLOCAL', product.current.code, product.current, {REF: 'LOCALS', CHILD: LOCAL.code})
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateProductLocal/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR PRODUCTO LOCAL:\n' + Object.values(exceptionsValidate))
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
                <View style={[ styles.column, styles.widthForm, styles.marginMedium_B ]}>
                    
                    {
                        !productLocal || !productLocal.code ? 
                        <PickerRecipe
                            labelFirst={'select'}
                            label={trans('recipe')}
                            callback={ (value) => {
                                setProductLocal(value)
                                product.current = {...product.current, ...value}
                            } } 
                            styles={[ styles.marginSmall, {marginTop: size.statusHeaderSize + size.marginSmall} ]}
                            />
                        : <>
                        <View style={[ styles.container ]} >
                            <PickerImage 
                                //imageRounded
                                imageUri={productLocal.photoUrl}
                                aspectImage={size.aspectAvatar}
                                imageSize={size.imageSmall}
                                imageWidth={imageWidth}
                                quality={0.7}
                                //containerStyle={[ styles.borderFine, styles.bgInput ]}
                                containerStyle={[styles.imageLarge, styles.imageCover, {width: '100%'} ]}
                                style={styles.alignCenter} />
                                
                            <View style={[ styles.imageLarge, styles.bgOpacityTheme, {marginTop: -size.imageLarge} ]} ></View>
                        </View>

                        <View style={[ styles.paddingMedium_X]}>
                            <InputText
                                tag={trans('code')} type={'default'} editable={false}
                                value={(productLocal.code).toString()} />
                            <InputText
                                tag={trans('name')} type={'default'} editable={false}
                                value={(productLocal.name).toString()} />
                            
                            <View style={[ styles.row, styles.justifyBetween ]}>
                                <PickerPlace
                                    label={trans('placePreparation')}
                                    styles={[ {width: '74%'} ]}
                                    disabled={PROFILE.placeCode ? true : false}
                                    currentValue={PROFILE.placeCode ? {name: PROFILE.place, code: PROFILE.placeCode}: null}
                                    callback={ (value) => {
                                        product.current.place = (value && value.code ? value.name : '')
                                        product.current.placeCode = (value && value.code ? value.code : '')
                                    } } />
                                {/* <InputText
                                    tag={trans('cost')} type={'numeric'}
                                    onChangeText={(text) => {
                                        productLocal.cost = text
                                        product.current.cost = text
                                    } } 
                                    containerStyle={[ {width: '24%'} ]} /> */}
                                <InputText
                                    tag={trans('price')} type={'numeric'}
                                    onChangeText={(text) => {
                                        productLocal.price = text
                                        product.current.price = text
                                    } } 
                                    containerStyle={[ {width: '24%'} ]} />
                            </View>

                            <AddSupplies
                                labelFirst={'select'}
                                label={trans('supplies')}
                                disabled={true}
                                currentValue={productLocal.supplies}
                                styles={[ ]}/>

                        </View>
                    </>
                    }
                    

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
        if(key === 'code' || key === 'name' || key === 'place' || key === 'price'){
            _v.verifyString(value) ? null : exep[key] = '\n * ' + trans(key) + ': Obigatorio'
        }
    })
    return Object.entries(exep).length !== 0 ? exep : null
}

export default CreateProductLocalScreen

