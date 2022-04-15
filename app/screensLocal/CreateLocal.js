import React, {useState, useLayoutEffect} from 'react'
import { ScrollView, View, Text, Platform } from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'
import LoadingScreen from '../components/LoadingScreen'
import InputText from '../components/InputText'
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
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall
    
    var date = new Date()
    local.code = DateFormat.code(date)
    
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
                var ref = 'COMPANY/cover_'+local.code
                if(local.imageCover){
                    local.imageCover = await FBController.ST_Upload(ref+'(cover)', local.imageCover, 'ORIGIN')
                }
                await FBController.FS_Create('LOCALS', local.code, local, 'ORIGIN')
                //callbackCreate(local)
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
                            imageUri={COMPANY.logo}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ null }
                            imageWidth={imageWidth}
                            quality={0.7}
                            containerStyle={[ styles.borderFine, {marginTop: -size.imageSmall/2, borderWidth: 2 }]} />
                    </View>
                    {
                        PROFILE.usertype === 'ROOT' ? null :
                        <Text style={[ styles.textInfo, styles.textCenter]}>
                            {local.company+'\n'+local.code}
                        </Text>
                    }
                    <View style={[ styles.row, styles.justifyBetween ]}>
                        <InputText
                            tag={trans('company')} type={'default'} containerStyle={[ {width: '48%'}]}
                            value={(COMPANY.name).toString()} editable={false} />
                        <InputText
                            tag={trans('local')} type={'default'} containerStyle={[ {width: '48%'}]}
                            value={(local.name).toString()}
                            onChangeText={(text) => local.name = text } />
                    </View>
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

