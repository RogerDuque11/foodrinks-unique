import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Keyboard} from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'


const TextCustom = (props) => {
    const { inputStyle, containerStyle, submit } = props
    const styles = createStyles()
    const { colors, size, isWeb } = CurrentScheme()

    const [ isFocus, setIsFocus ] = useState()
    const [ value, setValue ] = useState(props.value)

    const editable = props.editable != null && !props.editable ? false : true    

    const inputState = !editable ? styles.inputDisabled
                    : isFocus ? styles.inputFocus 
                    : value ? styles.inputBlur 
                    : styles.input

    const labelState = !editable ? styles.labelDisabled
                    : isFocus ? styles.labelFocus 
                    : value ? styles.labelBlur 
                    : styles.label

    const onChangeText = async (text) => {
        setValue(text)
        props.onChangeText(text)
    }

    return (
        ! value ? null :
        <View style={[containerStyle]}>
            { !props.tag ? null :  <LabelStroke values={{props, styles, labelState}} />  }
            
            <Text
                keyboardType={props.type}
                multiline={props.multiline} 
                numberOfLines={props.lines}
                editable={editable}
                onChangeText={onChangeText}
                label={props.type}
                onFocus={() => setIsFocus(true) }
                onBlur={() => setIsFocus(false) }
                value={value}
                secureTextEntry={props.secure? props.secure : false}
                autoCompleteType={props.autocomplete? props.autoComplete : 'off'}
                onSubmitEditing={submit ? submit : Keyboard.dismiss}
                style={[
                    isWeb && {outline: "none"},
                    styles.input,
                    inputState,
                    inputStyle,
                ]}
            >{value}</Text>
        </View>
    )
}



const LabelStroke = ({values}) => {
    const {styles, labelState, props} = values
    return (
        <View>
            <Text style={[ styles.label, labelState, {textShadowOffset: {width:  1.25, height:  1.25}}]}>{props.tag}</Text> 
            <Text style={[ styles.label, labelState, {textShadowOffset: {width: -1.25, height: -1.25}}]}>{props.tag}</Text> 
            <Text style={[ styles.label, labelState, {textShadowOffset: {width: -1.25, height:  1.25}}]}>{props.tag}</Text>
            <Text style={[ styles.label, labelState, {textShadowOffset: {width:  1.25, height: -1.25}}]}>{props.tag}</Text>
        </View>
    )
}

const createStyles = () => {
    const { colors, size } = CurrentScheme()

    const styles = StyleSheet.create({
        input: {
            backgroundColor: colors.input, 
            color: colors.text,
            paddingHorizontal: size.paddingSmall,
            borderWidth: size.borderFine,
            borderColor: colors.border, 
            borderRadius: size.radiousTiny,
            height: size.formSmall, 
            fontSize: size.textSmall,
            marginTop: size.marginSmall
        },
        label: { 
            position: 'absolute',
            paddingHorizontal: size.paddingMin,
            marginLeft: size.marginTiny, 
            color: colors.default, 
            fontSize: size.textSmall, 
            zIndex: 2, 
            top: size.marginTiny-2,
            textShadowColor: colors.input, 
            textShadowRadius: 1.5, 
        },

        inputDisabled: { color: colors.default, borderColor: colors.input },
        labelDisabled: { color: colors.default },

        inputFocus: { borderColor: colors.primary },
        labelFocus: { color: colors.primary },

        inputBlur: { /* borderColor: colors.text */ },
        labelBlur: { /* color: colors.text */ },

    })
    return styles;
}


export default TextCustom;

