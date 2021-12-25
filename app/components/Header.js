import React from "react";
import { View, Text, StyleSheet } from "react-native"

import CurrentScheme from '../constants/CurrentScheme'
import HeaderLeft from './HeaderLeft'
import HeaderRight from './HeaderRight'


const CustomHeader = ({ params, onPressLeft, onPressRight }) => {
    const styles = createStyles()
    const { colors } = CurrentScheme()
    const { left, right, title, contentStyle, titleStyle, textAlign } = params
    
    return (
        <View style={[styles.content, contentStyle ]}>
            { left ? <HeaderLeft params={left} onPressLeft={ left.disabled ? null : onPressLeft } /> : null }
            <Text style={[ styles.contentTitle, styles.title, {textAlign: textAlign? textAlign : 'center'}, titleStyle ]}>{title}</Text> 
            { right ? <HeaderRight params={right} onPressRight={ right.disabled ? null : onPressRight } /> : null }
        </View>
    )
}

const createStyles = () => {
    const { colors, size, isWeb } = CurrentScheme()

    const styles = StyleSheet.create({
        content: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            height: size.headerSize,
            backgroundColor: colors.background,
            marginTop: isWeb ? 0 : size.statusBarSize
        },
        title: {
            flex: 1,
            paddingVertical: size.paddingSmall,
            fontWeight: "normal",
            fontSize: 20,
            color: colors.text,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: 'Roboto',
        },
    })
    return styles;
}
        


export default CustomHeader;

