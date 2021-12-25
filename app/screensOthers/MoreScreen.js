import React, {useState, useContext } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import Icon from '../components/Icon';

const MoreOptions = {
    //Account: {'icon': 'account-outline', 'onPress':'navigation.navigate("ProductForm")' },
    SALIR: {'icon': 'exit-to-app', 'onPress':'onPressLogOut()' }
}

const AdminOptions = {
    //Products: {'icon': 'shopping', 'onPress':'navigation.navigate("ProductForm")' },
    //Users: {'icon': 'account-group-outline', 'onPress':'navigation.navigate("ProductForm")' }
}

const MoreScreen = ({route, navigation}) => {
    const { styles, colors, size } = CurrentScheme()
    const { LOG_OUT } = useContext(route.params.AuthContext)

    
    const onPressLogOut = () => {
        LOG_OUT('')
    }

    return (
        <View style={[styles.container, styles.paddingTiny_X]}>

            <View style={[styles.flexRow, styles.wrap]}>
                {
                    Object.entries({ ...MoreOptions, ...AdminOptions }).map(([key, params]) =>  ( 
                        <View key={key} style={[styles.paddingTiny, styles.grow, {minWidth: 130} ]}>
                            <TouchableOpacity style={[ styles.button, styles.bgTranslucent, styles.column, styles.paddingSmall_Y ]} onPress={() => eval(params.onPress) }>
                                <Icon name={params.icon} size={size.iconMedium} color={colors.text} />
                                <Text style={[styles.textSmall, styles.colorText, styles.uppercase, styles.marginTiny_T]} >{key}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </View>
            {/* <Button title="Sign out" /> */}
        </View>
    )
}

export default MoreScreen


