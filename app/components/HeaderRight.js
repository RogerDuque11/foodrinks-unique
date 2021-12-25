import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import CurrentScheme from '../constants/CurrentScheme'
import Icon from './Icon';

const HeaderRight = ({params, onPressRight}) => {
    const styles = createStyles()
    const { size, trans } = CurrentScheme()
    const { color, label, icon, library, disabled } = params

    return (
        <TouchableOpacity 
            style={[styles.button, styles.paddingTiny_R]} onPress={onPressRight}>
            {
                label ? <Text style={[styles.label, {color: color}]}>{trans(label)}</Text>
                : <Icon name={icon} size={size.iconSmall} color={color} library={library} />
            }
        </TouchableOpacity>
    )
}

const createStyles = () => {
    const { colors, size } = CurrentScheme()

    const styles = StyleSheet.create({
        button: {
            padding: size.paddingSmall,
            paddingRight: size.paddingTiny,
        }, 
        label: {
            fontSize: size.textSmall, 
            color: colors.text,
            paddingTop: size.paddingTiny,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'Roboto',
        }
    })
    return styles;
}


export default HeaderRight;

