import React, { useState, useEffect } from 'react'
import { View, Text, RefreshControl, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import _ from "lodash"

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import LoadingScreen from './LoadingScreen'
import Icon from './Icon'
import Avatar from './Avatar'
import PickerLetterMenu from './PickerLetterMenu'
import ShowProductSelected from './ShowProductsSelected'

import FBController from  '../controllers/FirebaseController'


const AddProductsToOrder = (props) => {
    const { PROFILE, LOCAL, COMPANY } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { callback, disabled, currentValue, nullable } = props
    
    const [ isLoading, setLoading ] = useState(true)
    const [ products, setProducts ] = useState(currentValue ? currentValue : [])
    const [ data, setData ] = useState([])
    const [ dataFiltered, setDataFiltered ] = useState(null)
    const [ letterMenu, setLetterMenu ] = useState({})

    useEffect(() => {
        if (data.length === 0 && !disabled){ getData() }
        else {
            setLoading(false)
        }
        /* if(letterMenu && letterMenu.code){
            setLoading(true)
            const filtered =  _.filter(data, [ 'letterMenuCode', letterMenu.code ] )
            console.log(filtered.length)
            //setDataFiltered(filtered)
            setLoading(false)
        }else{
            setDataFiltered(null)
        } */
    }, [ currentValue, products, letterMenu, disabled ])

    async function getData() {
        if(LOCAL && LOCAL.code ){
            await FBController.FS_ReadBy('PRODUCTSLOCAL', 'enable', '==', true, {REF: 'LOCALS', CHILD:LOCAL.code})
            .then((result)=>{ 
                setLoading(true)
                setData(result) 
            })
            .finally(()=>{ setLoading(false) })
            .catch(error => { Constants.NOTIFY('ERROR', error.code, 'PickerProductLocal/loadProductsLocal', error.message) })
        }
    }

    const addToList = (value) => {
        var product = {
            code: value.code,
            details: '', 
            letterMenu: value.letterMenu,
            name: value.name,
            photoUrl: value.photoUrl,
            place: value.place,
            placeCode: value.placeCode,
            price: value.price,
            quantity: 1,
            state: value.state,
            supplies: value.supplies
        }

        /* var supplies = []
        Object.entries(value.supplies).map(([key, supply]) =>{
            supplies[key] = {  name: supply.name, disabled: supply.disabled ? true : false }
        })
        product.supplies = supplies */

        products[product.code] = product
        setProducts(newProducts => ({...products, ...newProducts}))
    }

    return (
        <ScrollView style={[  ]}>

            { isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} />   : null }
            {
                disabled ? null :
                <View style={[ styles.bgCard, styles.borderFine, styles.radiusTiny, styles.paddingTiny ]}>
                    <View style={[ styles.row, styles.alignCenter, styles.borderBottom, styles.paddingTiny_B ]}>
                        <Icon name={'fast-food-outline'} library={'Ionicons'} color={colors.primary} size={size.iconSmall} />
                        <Text style={[ styles.textHeader, styles.textSmall, styles.paddingTiny_L ]}>
                            {trans('menu')}:
                        </Text>
                        <PickerLetterMenu
                            labelFirst={'all'}
                            nullable={true}
                            callback={ (value) => {
                                if(value && value.name){
                                    const filtered =  _.filter(data, (product) => { return product.letterMenu === value.name })
                                    setDataFiltered(filtered.length > 0 ? filtered : null)
                                }else{
                                    setDataFiltered(null)
                                }
                            } }
                            styles={[ styles.bgCard, styles.borderNone, styles.flex, {marginTop: 0}]} />
                    </View>
                    <FlatList
                        data={dataFiltered ? dataFiltered : data}
                        horizontal={true}
                        keyExtractor={(item, index) => index+""}
                        renderItem={({item, index})=> ( <RenderItemSelect key={index} props={{ item, addToList, index }} /> )}
                        refreshControl={ <RefreshControl refreshing={isLoading} onRefresh={getData} /> } 
                        style={[ styles.marginTiny_T, {height: 130} ]}/>
                </View>
            }

            <ShowProductSelected
                currentValue={products}
                disabled={disabled}
                callback={ (products, total) => {
                    callback(products, total)
                }}
            />

        </ScrollView>

    )
}

const RenderItemSelect = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { item, addToList, index } = props
    return (
        <TouchableOpacity onPress={()=>addToList(item, index)} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, {width: 90}  ]} underlayColor={colors.transparent} >
            <View style={[ styles.alignCenter ]}>
                <Avatar 
                    size={size.imageTiny}  
                    title={item.name[0]}
                    source={ item.photoUrl ? {uri: item.photoUrl} : null} 
                    containerStyle={[styles.imageCover, {width: '100%', height: size.imageTiny} ]} />
            </View>
            <View style={[ styles.radiusTiny_Y]}>
                <Text numberOfLines={3} style={[styles.textTiny, styles.textCenter ]}>{item.name}</Text>
                <Text style={[styles.textTiny, styles.textCenter, styles.colorPrimary ]}>$ {item.price}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default AddProductsToOrder

