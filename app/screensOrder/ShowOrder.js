import React, { } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { BottomSheet } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Header from '../components/Header'

import OrderType from './componentsOrder/OrderType'
import OrderCustomer from './componentsOrder/OrderCustomer'
import OrderPayment from './componentsOrder/OrderPayment'
import OrderListProducts from './componentsOrder/OrderListProducts'


const ShowOrderScreen = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { order, visible, setVisible, callbackItem, disabled } = props
    const { products, type, state, code } = order
    
    const permissions = {
        admin: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode ) ? true : false,
        update: !disabled && state !== 'FINISHED' ? true : false,
        delete: PROFILE.usertype === 'ROOT' || PROFILE.usertype === 'PARTNER' || (PROFILE.position === 'ADMIN' && !PROFILE.placeCode ) ? true : false
    }
    
    const left  = { icon: 'close', color: colors.text }
    const right = { icon: 'edit-3', color: !permissions.update && !permissions.admin ? colors.default : colors.accent, library: 'Feather', disabled:(!permissions.update && !permissions.admin) }
    const contentStyle = [ styles.bgCard, styles.radiusMedium_T, { marginTop: 0}, ]
    const titleStyle = [ styles.textMedium, { marginTop: 0}, ]

    return (
        !visible ? null :
        <BottomSheet
            containerStyle={[ styles.bgOpacityDark, styles.column, styles.justifyEnd ]}
            animationType="slide"
            isVisible={visible}
            modalProps={{
                statusBarTranslucent: true,
                hardwareAccelerated: true,
                transparent: true,
                onRequestClose: () => { setVisible(false) },
            }}
            //style={ Platform.OS === 'web' ? [styles.modalWeb] : [] }
            >
                <TouchableOpacity 
                    style={[ styles.row, styles.alignEnd, { height: size.fullHeight -size.statusBarSize } ]} 
                    onPress={()=>{ setVisible(false) }}  
                    activeOpacity={.9} >

                    <ScrollView style={[  ]} >
                        <TouchableOpacity style={[ styles.bgTheme, styles.radiusMedium_T ]} activeOpacity={1}>
                            <View style={[ styles.column, styles.border_B, styles.justifyBetween ]}>
                                <Header 
                                    params={{ title:code, left, right, contentStyle, titleStyle }}  
                                    onPressLeft={ ()=>{setVisible(false)} }  
                                    onPressRight={ ()=> { 
                                        callbackItem('EDIT', order)
                                        setVisible(false)
                                        }
                                    } />
                            </View>
                            <View style={[ styles.column, styles.paddingTiny ]}>
                                <OrderType props={{ order, type, setType:()=>{}, state, setState:()=>{}, disabled:true }} />
                                <OrderCustomer props={{ order, type, disabled:true }} />
                                <OrderPayment props={{ order, type, products, disabled:true }} />
                                <OrderListProducts props={{ products, callback:()=>{}, disabled:true }} />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>

                </TouchableOpacity>

            </BottomSheet>
    )
}


export default ShowOrderScreen

