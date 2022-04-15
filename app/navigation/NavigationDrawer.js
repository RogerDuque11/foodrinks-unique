import React, {useState, useEffect, useContext} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import Icon from '../components/Icon'
import Button from '../components/Button'
import LoadDataSesion from '../components/LoadDataSesion'
import PickerLocal from '../components/PickerLocal'
import EmptyScreen from '../screensOthers/EmptyScreen'
import Avatar from '../components/Avatar'


const Drawer = createDrawerNavigator();

const NavigationDrawer = ({route, navigation}) =>{
    const { PROFILE, COMPANY } = Constants.SESION
    const { styles, colors, size, trans, isWebDesk, theme, scheme} = CurrentScheme()
    const itemColor = scheme == 'dark' ? colors.text : colors.background

    const [ screens, setScreens ] = useState(route.params.screens)
    const [ isLoading, setLoading ] = useState(false)
    const { LOG_OUT } = useContext(route.params.AuthContext)
    
    const [ dataSesion, setDataSesion ] = useState({ partner: null, company: null })
    const [ local, setLocal ] = useState({})
    const [ reload, setReload ] = useState(false)
    
    useEffect(() => {
        if(isLoading || dataSesion.company || reload){
            setScreens(screens => Object.assign(screens, route.params.screens))
            setLoading(false)
            setReload(false)
        }
        //Constants.SESION.PARTNER = dataSesion.partner
        //Constants.SESION.COMPANY = dataSesion.company
    }, [isLoading, dataSesion, local, reload])

    const showCompany = () => {
        /* !dataSesion && dataSesion.company ? null : REVISAR CALLBACK dataSesion
        navigation.navigate('UpdateCompany', {company: dataSesion.company, callbackUpdate: (company)=>setCompany(company)}) */
    }

    const showLocal = () => {
        /* local ? navigation.navigate('UpdateLocal', {local: local, callbackUpdate: (local)=>setLocal(local)})
        : navigation.navigate('CreateLocal', {callbackCreate: (local)=>setLocal(local) }) */
    }

    return (
        <Drawer.Navigator 
            //overlayColor="transparent" //fondo color
            drawerType={isWebDesk ? 'permanent' : 'back'}
            edgeWidth={0} // disabled swipe
            //statusBarAnimation={''}
            drawerStyle={{
                width: isWebDesk ? 350 : '80%', 
                backgroundColor: colors.primary,
            }}
            drawerContentOptions={{
                activeTintColor: itemColor,
                inactiveTintColor: itemColor,
                labelStyle: { textTransform: 'uppercase' },
                //itemStyle: { alignItems:'flex-end' },

            }}
            drawerContent={ props => 
                <CustomDrawerContent 
                    {...props} 
                    itemColor={itemColor} 
                    LOG_OUT={LOG_OUT} 
                    
                    dataSesion={dataSesion} 
                    showCompany={showCompany} 
                    callbackDataSesion={(value)=>{
                        setDataSesion(dataSesion=>({...dataSesion, ...value}))
                        setLoading(true)
                    }} 
                    local={local} 
                    showLocal={showLocal} 
                    selectLocal={(value)=>{
                        setLocal(local=>({...local, ...value}))
                        setLoading(true)
                    }} 
                /> } 
            //initialRouteName="Help"
        >
                
            {
                screens && !isLoading && !reload && (PROFILE.usertype === 'ROOT' || dataSesion) ?
                Object.entries(screens).map(([key, props]) => ( 
                    <Drawer.Screen 
                        key={key} 
                        name={trans(key)} 
                        component={props.component} 
                        initialParams={{ ...props.params, setReload }} 
                        options={{ 
                            headerShown: true, 
                            headerStyle: /* isWebDesk ? null : */ styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTitleAlign: isWebDesk ? 'left' : 'center',
                            headerLeft: () => (
                                isWebDesk ? null :
                                <CustomDrawerToggle navigation={navigation} color={colors.text} size={size.iconSmall} />
                            ),
                            drawerIcon: ({focused, color }) => (
                                props.iconName ? <Icon color={color} size={size.iconSmall} library={props.iconLibrary} name={focused ? props.iconName : props.iconName} /> : null
                            )
                        }}
                    />
                ))
                : <Drawer.Screen name={'Home'} component={EmptyScreen} options={{ 
                    headerShown: true, 
                    headerStyle: styles.headerStyle, 
                    headerTitleStyle: styles.headerTitleStyle, 
                    headerTitleAlign: isWebDesk ? 'left' : 'center',
                    headerLeft: () => (
                        isWebDesk ? null :
                        <CustomDrawerToggle navigation={navigation} color={colors.text} size={size.iconSmall} />
                    )
                }} />
            }
            
        </Drawer.Navigator>
    );
}

const CustomDrawerToggle = (props) => {
    const { colors, size } = CurrentScheme()
    return (
        <Button 
            type={'clear'}
            icon={{ color: colors.text, name: 'menu', size: size.iconSmall }} 
            onPress={ ()=>(props.navigation.dispatch(DrawerActions.toggleDrawer())) }
        />
    );
};


function CustomDrawerContent(props) {
    const { styles, colors, size, isWebDesk, trans} = CurrentScheme()
    const { PROFILE } = Constants.SESION
    const usertype = trans(PROFILE.usertype)

    
    return (
        <DrawerContentScrollView {...props} style={styles.container} >
            {
                /* isWebDesk ? null :
                <View style={[styles.row, styles.justifyEnd]}>
                    <TouchableOpacity style={[styles.paddingTiny]} onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}>
                        <Icon name="close" size={size.iconSmall} color={colors.text} />
                    </TouchableOpacity>
                </View> */
            }
            <View style={[ styles.row, styles.paddingSmall, styles.alignEnd ]}>
                <Avatar 
                    rounded
                    size={size.iconLarge}  
                    title={PROFILE.displayName[0] ? PROFILE.displayName[0] : 'US'}
                    containerStyle={[ styles.bgPrimary, styles.borderFine ]}
                    source={ PROFILE.photoUrl ? {uri: PROFILE.photoUrl} : null} />
                
                <View style={[styles.marginSmall_L]}>
                    <Text style={[styles.textSmall, styles.textBold, styles.bgPrimary ]}>{PROFILE.displayName ? PROFILE.displayName : ' - '}</Text>
                    <Text style={[styles.textTiny, styles.bgPrimary ]}>{PROFILE.email ? PROFILE.email : ' - '}</Text>
                    <View style={[styles.row, styles.justifyBetween ]}>
                        <Text style={[ styles.textTiny, styles.bgPrimary, styles.uppercase ]}>{trans('company')}: </Text>
                        <LoadDataSesion
                            callbackDataSesion={(dataSesion)=>{ props.callbackDataSesion(dataSesion) }}
                            styles={[ styles.textTiny, styles.borderNone, styles.bgPrimary, styles.flex, {marginTop: 0} ]} />
                            {
                                PROFILE.usertype !== 'ROOT' && props.dataSesion.company ?
                                <Button 
                                    iconRight
                                    icon={ { color: props.itemColor, name:'chevron-right', library:'Feather', size: size.iconSmall }} 
                                    buttonStyle={[ styles.paddingNone, styles.paddingTiny_X]}
                                    onPress={ ()=>( props.showCompany()) } />
                                : null
                            }
                        
                    </View> 
                    {/* <Text style={[styles.textTiny, styles.bgPrimary ]}>{usertype}</Text> */}
                </View>
            </View>
            
            {/* {
                PROFILE.usertype !== 'ROOT' && props.company ?
                <View style={[ styles.paddingSmall_X, styles.row, styles.justifyBetween, styles.alignCenter, styles.marginTiny_Y ]}>
                    <Icon color={props.itemColor} size={size.iconSmall} library={'MaterialIcons'} name={'storefront'} />
                    <Text style={[ styles.textSmall, styles.bgPrimary, styles.uppercase, {marginLeft: 32} ]}>{trans('local')}: </Text>
                    <PickerLocal
                        callback={(local)=>{ props.selectLocal(local) }}
                        background={colors.primary} 
                        color={props.itemColor}
                        styles={[styles.borderNone, styles.flex, {marginTop: 0} ]}
                        pickerStyle={[ ]} />
                    <Button 
                        iconRight
                        title={ (PROFILE.usertype === 'PARTNER' && !props.company) ? trans('localCreate') : null }
                        icon={ (PROFILE.usertype === 'PARTNER' && !props.company) ? null: { color: props.itemColor, name:'chevron-right', library:'Feather', size: size.iconSmall }} 
                        buttonStyle={[ styles.paddingNone, styles.paddingTiny_X]}
                        onPress={ ()=>( props.showLocal()) } />
                </View>
                : null
            } */}
            
            <DrawerItemList {...props} />
            
            <DrawerItem
                labelStyle={{color: props.itemColor}}
                label="CERRAR SESIÓN"
                icon={() => <Icon color={props.itemColor} size={size.iconSmall} name={'exit-outline'} library={'Ionicons'} />}
                onPress={() => props.LOG_OUT('')}
            />
        </DrawerContentScrollView>
    );
}

export default NavigationDrawer 
