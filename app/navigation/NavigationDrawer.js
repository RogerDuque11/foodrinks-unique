import React, {useState, useEffect, useContext} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import CurrentScheme from '../constants/CurrentScheme'
import Constants from "../constants/Constants"
import LoadingScreen from '../components/LoadingScreen'
import Icon from '../components/Icon'
import Button from '../components/Button'
import PickerCompany from '../components/PickerCompany'
import PickerLocal from '../components/PickerLocal'
import EmptyScreen from '../screensOthers/EmptyScreen'
import Avatar from '../components/Avatar'


const Drawer = createDrawerNavigator();

const NavigationDrawer = ({route, navigation}) =>{
    const { PROFILE } = Constants.SESION
    const { styles, colors, size, trans, isWebDesk, theme, scheme} = CurrentScheme()
    const itemColor = scheme == 'dark' ? colors.text : colors.background

    const [ screens, setScreens ] = useState(route.params.screens)
    const [ isLoading, setLoading ] = useState(false)
    const { LOG_OUT } = useContext(route.params.AuthContext)
    const [ company, setCompany ] = useState(null)
    const [ local, setLocal ] = useState(null)
    
    useEffect(() => {
        if(isLoading || company){
            setScreens(screens => Object.assign(screens, route.params.screens))
            setLoading(false)
        }
        Constants.SESION.COMPANY = company
        Constants.SESION.LOCAL = local
    }, [isLoading, company, local])

    const showCompany = () => {
        company ? navigation.navigate('UpdateCompany', {company: company, callbackUpdate: (company)=>setCompany(company)})
        : navigation.navigate('CreateCompany', {callbackCreate: (company)=>setCompany(company) })
    }

    const showLocal = () => {
        local ? navigation.navigate('UpdateLocal', {local: local, callbackUpdate: (local)=>setLocal(local)})
        : navigation.navigate('CreateLocal', {callbackCreate: (local)=>setLocal(local) })
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
                    company={company} 
                    showCompany={showCompany} 
                    selectCompany={(value)=>{
                        setCompany(company=>({...company, ...value}))
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
                screens && !isLoading && (PROFILE.usertype === 'ROOT' || (company && local)) ?
                Object.entries(screens).map(([key, props]) => ( 
                    <Drawer.Screen 
                        key={key} 
                        name={trans(key)} 
                        component={props.component} 
                        initialParams={{ ...props.params }} 
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
                    title={PROFILE.displayName[0] ? PROFILE.displayName[0] : 'USw'}
                    containerStyle={[ styles.bgPrimary, styles.borderFine ]}
                    source={ PROFILE.photoUrl ? {uri: PROFILE.photoUrl} : null} />
                
                <View style={[styles.marginSmall_L]}>
                    <Text style={[styles.textSmall, styles.textBold, styles.bgPrimary ]}>{PROFILE.displayName ? PROFILE.displayName : ' - '}</Text>
                    <Text style={[styles.textTiny, styles.bgPrimary ]}>{PROFILE.email ? PROFILE.email : ' - '}</Text>
                    {/* <Text style={[styles.textTiny, styles.bgPrimary ]}>{usertype}</Text> */}
                </View>
            </View>



            {
                PROFILE.usertype !== 'ROOT' ?
                <View style={[ styles.paddingSmall_X, styles.row, styles.justifyBetween, styles.alignCenter, styles.marginTiny_Y ]}>
                    <Icon color={props.itemColor} size={size.iconSmall} library={'MaterialIcons'} name={'storefront'} />
                    <Text style={[ styles.textSmall, styles.bgPrimary, styles.uppercase, {marginLeft: 32} ]}>{trans('company')}: </Text>
                    <PickerCompany
                        callback={(company)=>{ props.selectCompany(company) }}
                        background={colors.primary} 
                        color={props.itemColor}
                        styles={[styles.borderNone, styles.flex, {marginTop: 0} ]}
                        pickerStyle={[ ]} />
                    <Button 
                        iconRight
                        title={ (PROFILE.usertype === 'PARTNER' && !props.company) ? trans('companyCreate') : null }
                        icon={ (PROFILE.usertype === 'PARTNER' && !props.company) ? null: { color: props.itemColor, name:'chevron-right', library:'Feather', size: size.iconSmall }} 
                        buttonStyle={[ styles.paddingNone, styles.paddingTiny_X]}
                        onPress={ ()=>( props.showCompany()) } />
                </View>
                : null
            }
            {
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
            }
            
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
