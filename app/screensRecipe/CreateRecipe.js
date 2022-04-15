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
import Recipe from  '../models/Recipe'

var functions = Constants.FUNCTIONS
var DateFormat = functions.DateFormat

const CreateRecipeScreen = ({route, navigation}) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const [ isLoading, setLoading ] = useState(false)
    const [ recipe, setRecipe ] = useState(new Recipe())
    const imageWidth = (Platform.OS !== 'web' ? size.fullWidth/3 : size.fullWidth/10) - size.paddingSmall

    const permissions = {
        selectLocal: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER'
        || (PROFILE.position === 'ADMIN' && !PROFILE.local) ? true : false,
    }

    var date = new Date()
    recipe.local = PROFILE.local ? PROFILE.local : ''
    recipe.localCode = PROFILE.localCode ? PROFILE.localCode : ''
    
    useLayoutEffect(() => {
        const left  = { icon: 'close', color: colors.text }
        const right = { icon: 'check', color: colors.accent }
        navigation.setOptions({
          title: '',
          header: () => ( <Header 
            params={{ title:trans('recipeCreate'), left, right }}  
            onPressLeft={ onPressCancel }  
            onPressRight={ onPressCreate } />)
        });
    }, [navigation]);

    const onPressCreate = async () => {
        recipe.code = DateFormat.code(date)
        var exceptionsValidate = validation(recipe, trans)
        if( ! exceptionsValidate && LOCAL.companyCode ){
            try {
                setLoading(true)
                var ref = 'COMPANY/'+LOCAL.companyCode+'/RECIPES/'+recipe.code
                if(recipe.photoUrl){
                    recipe.photoUrl = await FBController.ST_Upload(ref, recipe.photoUrl, 'ORIGIN')
                } 
                Object.values(recipe.supplies).forEach((supply)=>{
                    recipe.details = (recipe.details ? recipe.details : '') + supply.name + ', ' 
                })
                recipe.details = (recipe.details).toLowerCase()
                await FBController.FS_Create('RECIPES', recipe.code, recipe)
                navigation.goBack(null)
            } catch (error) {
                Constants.NOTIFY('ERROR', error.code, 'CreateRecipe/onPressCreate', error.message)
            }
        }else{
            alert('ERROR => CREAR RECIPEO:\n' + Object.values(exceptionsValidate))
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
                            imageUri={recipe.photoUrl}
                            aspectImage={size.aspectAvatar}
                            imageSize={size.imageSmall}
                            callback={ (uri)=> recipe.photoUrl = uri}
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
                            recipe.local = (value && value.code ? value.name : '')
                            recipe.localCode = (value && value.code ? value.code : '')
                        } } />
                    
                    <PickerLetterMenu 
                        label={trans('letterMenu')} 
                        callback={ (value) => {
                            recipe.letterMenu = (value && value.code ? value.name : '')
                            recipe.letterMenuCode = (value && value.code ? value.code : '')
                        } } />
                    
                    {/* <InputText
                        tag={trans('code')} type={'default'} editable={false}
                        value={(recipe.code).toString()} /> */}
                    <InputText
                        tag={trans('name')} type={'default'}
                        onChangeText={(text) => recipe.name = text } />
                    
                    <AddSupplies
                        labelFirst={'select'}
                        label={trans('supply')}
                        callback={ (value) => recipe.supplies = value }
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

export default CreateRecipeScreen

