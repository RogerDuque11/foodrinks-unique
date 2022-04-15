import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'

import CurrentScheme from "../../constants/CurrentScheme"
import Constants from "../../constants/Constants"
import LoadingScreen from '../../components/LoadingScreen'
import Icon from '../../components/Icon'
import Avatar from '../../components/Avatar'

import FBController from  '../../controllers/FirebaseController'


const HomeLocals = ({ props }) => {
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans } = CurrentScheme()
    const { navigation, callbackItem } = props
    const [ isLoading, setLoading ] = useState(false)
    const [ locals, setLocals ] = useState([])

    const permissions = {
        createLocal: PROFILE.usertype === 'ROOT' ? true : false,
    }

    function readLocals(){
        var props = {  REFS: { LOCALS: '' }  }
        return FBController.FS_Read2({...props})
        .onSnapshot( snapshot => {
            setLoading(true)
            var locals = []
            snapshot.forEach((doc) => { 
                locals.push(doc.data()) 
            });
            setLocals(locals)
            setLoading(false)
        }, (error) => { Constants.NOTIFY('ERROR', error.code, 'HomeLocals/readLocals', error.message) }
        )
    }
    
    useEffect(() => {
        const getLocals = readLocals()
        return () => getLocals()
    }, [  ])
    
    const launchScreen = (screen, params) => {                                                                                                                                   
        navigation.navigate(screen, params)
    }
    
    const callbackLocal = (item) =>{
        navigation.navigate('UpdateLocal', {local:item, index:0, callbackUpdate:null})
    }

    return ( 
        isLoading ? <LoadingScreen loading={isLoading} size={'large'} color={colors.primary} /> 
        : <View style={[  ]}>
            <View style={[ styles.row, styles.justifyBetween ]}>
                <Text style={[ styles.textSmall, styles.uppercase, styles.colorDefault, styles.marginTiny_Y ]}>{trans('locals')}</Text>
                {
                    !permissions.createLocal ? null :
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('CreateLocal', {callbackCreate: null})}  
                        underlayColor={colors.transparent}
                        style={[ styles.paddingTiny ]} >
                            <Text style={[ styles.textSmall, styles.uppercase, styles.colorAccent]}>{trans('create')}</Text>
                    </TouchableOpacity>
                }
            </View>
            {
                !locals || locals.length === 0 ? null :
                <FlatList
                    data={locals}
                    horizontal={true}
                    keyExtractor={(item, index) => index+""}
                    renderItem={({item, index})=> ( <RenderItemSelect key={index} props={{ item, callbackLocal, index }} /> )}
                    showsHorizontalScrollIndicator={false}
                    style={[  ]}/>
            }
    </View>
        
        
    )
} 
 
const RenderItemSelect = ({ props }) => {
    const { styles, colors, size } = CurrentScheme()
    const { item, callbackLocal, index } = props
    return (
        <TouchableOpacity 
            onPress={()=>callbackLocal(item)}  
            underlayColor={colors.transparent}
            style={[ styles.row, styles.bgCard, styles.radiusSmall, styles.paddingSmall, styles.alignCenter, styles.marginTiny_R, {width: 190} ]} >
            
            {/* <Avatar 
                size={ size.imageMin }  
                source={ item.imageCover ? {uri: item.imageCover} : null} 
                rounded={true}
                avatarStyle={[ styles.radiusSmall_T ]}
                containerStyle={[styles.imageCover, styles.marginTiny_R ]} /> */}

            <Icon name={'storefront'} library={'MaterialIcons'} color={colors.default} size={size.iconMedium} />
            <View style={[ styles.marginTiny_L ]}>
                <Text numberOfLines={1} style={[ styles.textSmall, styles.textBold ]}>{item.location.city}</Text>
                <Text numberOfLines={3} style={[ styles.textSmall, styles.colorDefault ]}>{item.name}</Text>
            </View>

        </TouchableOpacity>
    )
}



export default HomeLocals