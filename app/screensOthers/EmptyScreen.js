import React, {Component, useState} from 'react';
import { Text, View } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'

const EmptyScreen = ({navigation}) => {
    const {styles} = CurrentScheme()
    
    return (
        <View style={[styles.container, styles.justifyCenter ]}>
            <Text style={[styles.textTitle, styles.textCenter]}>Vacio</Text>
        </View>
    )
}

export default EmptyScreen

