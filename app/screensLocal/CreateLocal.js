import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
import Switch from '../components/Switch'
import PickerCompany from '../components/PickerCompany'
import PickerPartner from '../components/PickerPartner'
import PickerImage from '../components/PickerImage'
import ContentLocation from '../components/ContentLocation'

import FBController from  '../controllers/FirebaseController'
import Local from  '../models/Local'

var _F = Constants.FUNCTIONS
var DateFormat = _F.DateFormat

const CreateLocalScreen = ({route, navigation}) => {
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callbackCreate } = route.params
    const [ isLoading, setLoading ] = useState(false)
    const [ local, setLocal ] = useState(new Local())
    const permissions = {
        selectCompany: PROFILE.usertype === 'ROOT' ? true : false,
        selectPartner: PROFILE.usertype === 'ROOT' ? true : false,
    }
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidh/3 : size.fullWidh/10) - size.paddingSmall
    
    local.partner = PROFILE.usertype === 'PARTNER' ? PROFILE.displayName: ''
    local.partnerUid = PROFILE.usertype === 'PARTNER' ? PROFILE.uid: ''

    var date = new Date()
    local.code = DateFormat.code(date)
    local.company = COMPANY ? COMPANY.name: ''
    local.companyCode = COMPANY ? COMPANY.code: ''
    local.name = COMPANY ? COMPANY.name: ''
    local.slogan = COMPANY ? COMPANY.slogan: ''
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('localCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        var exceptionsValidate = validation(local, trans)
        if( ! exceptionsValidate ){
            try {
                setLoading(true)
                local.email = local.email ? local.email.toLowerCase() : ''
                var ref = 'COMPANIES/'+local.companyCode+'/LOCALS/'+local.code+'/'
                if(local.imageCover){
                    local.imageCover = await FBController.ST_Upload(ref+'(cover)', local.imageCover, 'ORIGIN')
                }
                if(local.imageLogo){
                    local.imageLogo = await FBController.ST_Upload(ref+'(logo)', local.imageLogo, 'ORIGIN')
                }
                await FBController.FS_Create('LOCALS', local.code, local, 'ORIGIN')
                callbackCreate(local)
                setLoading(false)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateLocal/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR LOCAL:\n' + Object.values(exceptionsValidate))
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
                    
                    <View style={[styles.flex, styles.alignCenter ]} >
                        <PickerImage 
                            imageSize={size.fullWidth-size.marginLarge}
                            imageUri={local.imageCover}
                            aspectImage={size.aspectBanner}
                            callback={ (uri)=> local.imageCover = uri }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[styles.imageMedium, styles.imageCover, styles.bgCard ]} />
                        <PickerImage 
                            imageRounded
                            imageUri={local.imageLogo}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ (uri)=> local.imageLogo = uri }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[ styles.borderFine, {marginTop: -size.imageSmall/2, borderWidth: 2 }]} />
                    </View>

                    {
                        permissions.selectPartner ?
                        <PickerPartner 
                            label={trans('partner')} 
                            labelFirst={'select'} 
                            callback={ (value) => {
                                local.partner = (value && value.uid ? value.displayName : '')
                                local.partnerUid = (value && value.uid ? value.uid : '')
                            } } />
                        : null
                    }
                    {
                        permissions.selectCompany ? 
                        <PickerCompany 
                            label={trans('company')} 
                            labelFirst={'select'} 
                            currentValue={COMPANY ? COMPANY : null}
                            callback={ (value) => {
                                local.company = (value && value.code ? value.name : '')
                                local.companyCode = (value && value.code ? value.code : '')
                            } } />
                        : null
                    }
                    {
                        PROFILE.usertype === 'ROOT' ? null :
                        <Text style={[ styles.textInfo, styles.textCenter]}>
                            {local.company+'\n'+local.code}
                        </Text>
                    }
                    <InputText
                        tag={trans('local')} type={'default'}
                        value={(local.name).toString()}
                        onChangeText={(text) => local.name = text } />
                    {/* <InputText
                        tag={trans('details')} type={'default'}
                        value={(local.details).toString()}
                        onChangeText={(text) => local.details = text } /> */}
                    <InputText
                        tag={trans('email')} type={'email-address'}
                        value={(local.email).toString()}
                        onChangeText={(text) => local.email = text } />
                    <InputText
                        tag={trans('phoneNumber')} type={'numeric'}
                        value={(local.phoneNumber).toString()}
                        onChangeText={(text) => local.phoneNumber = text } />
                    
                    <ContentLocation 
                        location={local.location} 
                        currentValue={local.location}
                        callback={(location)=>local.location = location}  />

                    {/* <View style={[ styles.row, styles.paddingSmall_Y, styles.justifyBetween ]}>
                        <Text style={[ styles.colorText, styles.paddingTiny_X ]}>{trans('enabled')}</Text>
                        <Switch value={local.enable} color={colors.primary} onValueChange={(value) => local.enable = value }></Switch>
                    </View> */}

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

export default CreateLocalScreen

