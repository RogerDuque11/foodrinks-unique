import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import _ from "lodash"

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import LoadingScreen from '../../components/LoadingScreen'
import Icon from '../../components/Icon'
import Avatar from '../../components/Avatar'
import PickerLetterMenu from '../../components/PickerLetterMenu'

import FBController from  '../../controllers/FirebaseController'


const OrderLetterMenu = ({ props }) => {
    const { LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callback } = props
    
    const [ isLoading, setLoading ] = useState(false)
    const [ data, setData ] = useState(Constants.CURRENT['LETTERENU'] ? Constants.CURRENT['LETTERENU'] : [])
    const [ dataFiltered, setDataFiltered ] = useState(null)
    
    async function getData() {
        if(LOCAL && LOCAL.code ){
            setLoading(true)
            await FBController.FS_ReadBy('PRODUCTSLOCAL', 'enable', '==', true, {REF: 'LOCALS', CHILD:LOCAL.code})
            .then((result)=>{ 
                setData(result) 
                Constants.CURRENT['LETTERENU'] = result
            })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'OrderLetterMenu/getData', error.message) })
        }
    }

    useEffect(() => {
        if (data && data.length === 0){ getData()
        } else { setLoading(false) }
    }, [ isLoading ])

    const callbackProduct = (item) =>{
        // forma de clonar objeto con variables profundas, si se clona de forma directa 
        // cualquier modificacilón en la copia se reflejará también en el objeto de origen
        const product = JSON.parse(JSON.stringify(item)) 
        callback({
            code: product.code,
            details: '', 
            letterMenu: product.letterMenu,
            name: product.name,
            //photoUrl: product.photoUrl,
            place: product.place,
            placeCode: product.placeCode,
            price: parseInt(product.price),
            quantity: 1,
            state: 'CONFIRMED',
            supplies: product.supplies
        })
    }

    return (
        <>
        { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
        <View style={[ styles.column, styles.card, styles.marginTiny_T ]} >

            <View style={[ styles.row, styles.paddingMin, styles.paddingTiny_X, styles.alignCenter, styles.border_B ]}>
                <Icon name={'fast-food-outline'} library={'Ionicons'} color={colors.default} size={size.iconSmall} />
                <Text style={[ styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{trans('letterMenu')}:</Text>
                <PickerLetterMenu
                    labelFirst={'all'}
                    nullable={true}
                    styles={[ styles.bgCard, styles.borderNone, styles.flex, {marginTop: 0}]}
                    callback={ (value) => {
                        if(value && value.name){
                            const filtered =  _.filter(data, (product) => { return product.letterMenu === value.name })
                            setDataFiltered(filtered.length > 0 ? filtered : null)
                        }else{
                            setDataFiltered(null)
                        }
                    } } />
            </View>
            
            <View style={[ styles.column, styles.paddingMin, styles.paddingTiny_X, {paddingTop: 0} ]}>
                {
                    !data || data.length === 0 ? null :
                    <FlatList
                        data={dataFiltered ? dataFiltered : data}
                        horizontal={true}
                        keyExtractor={(item, index) => index+""}
                        renderItem={({item, index})=> ( <RenderItemSelect key={index} props={{ item, callbackProduct, index }} /> )}
                        style={[ styles.marginTiny_T, {height: size.imageSmall + size.marginTiny} ]}/>
                }
            </View>

        </View>
        </>
    )
}
 
const RenderItemSelect = ({ props }) => {
    const { styles, colors, size } = CurrentScheme()
    const { item, callbackProduct, index } = props
    return (
        <TouchableOpacity onPress={()=>callbackProduct(item)} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, {width: 90}  ]} underlayColor={colors.transparent} >
            {/* <View style={[ styles.alignCenter ]}>
                <Avatar 
                    size={size.imageTiny}  
                    source={ item.photoUrl ? {uri: item.photoUrl} : null} 
                    containerStyle={[styles.imageCover, styles.borderFine, styles.radiusMin, {width: '100%', height: size.imageSmall} ]} />
            </View> */}
            <View style={[ styles.radiusTiny_Y, styles.absolute, styles.paddingTiny_Y, styles.bgInput, styles.borderFine, {height: size.imageSmall} ]}>
                <Text numberOfLines={3} style={[styles.textTiny, styles.textCenter, styles.uppercase ]}>{item.name}</Text>
                <Text style={[styles.textTiny, styles.textCenter, styles.colorPrimary ]}>$ {item.price}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default OrderLetterMenu

