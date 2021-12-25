import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Keyboard} from 'react-native'
import { Input } from 'react-native-elements';

import CurrentScheme from '../constants/CurrentScheme'


const InputCustom = (props) => {
    const { inputStyle, containerStyle, submit } = props
    const styles = createStyles(props.lines)
    const { colors, size, isWeb } = CurrentScheme()

    const [ isFocus, setIsFocus ] = useState()
    const [ value, setValue ] = useState(props.value)

    const editable = props.editable != null && !props.editable ? false : true    
    const marginTop = {marginTop: props.label ? 0: size.marginSmall} 

    const inputContainerState = !editable ? styles.inputDisabled
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
        <Input  
            containerStyle={[ styles.containerStyle, marginTop, props.containerStyle ]}

            disabled={ props.disabled }
            disabledInputStyle={[ props.disabledInputStyle ]}

            errorMessage={ props.errorMessage }
            errorProps={ props.errorProps }
            errorStyle={[ props.errorMessage ? styles.errorStyle: styles.errorStyleNone, props.errorStyle ]}

            InputComponent={ props.InputComponent }
            inputContainerStyle={[ styles.inputContainerStyle, inputContainerState, props.inputContainerStyle ]}
            inputStyle={[ styles.inputStyle, isWeb && {outline: "none"}, !editable && {color: colors.default}, props.inputStyle ]} 

            label={ props.tag ? null : props.label }
            labelProps={ props.labelProps }
            labelStyle={[ styles.label, labelState, props.labelStyle ]}

            leftIcon={ !props.leftIcon ? null : <Icon name={props.leftIcon.name} size={props.leftIcon.size} color={props.leftIcon.color} library={props.leftIcon.library} /> }
            leftIconContainerStyle={[ props.leftIconContainerStyle ]}

            placeholder={ props.tag }

            renderErrorMessage={ props.renderErrorMessage }

            rightIcon={ !props.rightIcon ? null : <Icon name={props.rightIcon.name} size={props.rightIcon.size} color={props.rightIcon.color} library={props.rightIcon.library} /> }
            rightIconContainerStyle={[ props.rightIconContainerStyle ]}

            keyboardType={ props.type }
            multiline={props.multiline} 
            numberOfLines={props.lines}
            editable={editable}
            onChangeText={onChangeText}
            //label={props.type}
            onFocus={() => setIsFocus(true) }
            onBlur={() => setIsFocus(false) }
            value={value}
            secureTextEntry={props.secure? props.secure : false}
            autoCompleteType={props.autocomplete? props.autoComplete : 'off'}
            onSubmitEditing={submit ? submit : !props.lines ? Keyboard.dismiss: null}
            /* style={[
                isWeb && {outline: "none"},
                styles.input,
                inputState,
                inputStyle,
            ]} */

        />
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

const createStyles = (lines) => {
    const { colors, size } = CurrentScheme()

    const styles = StyleSheet.create({
        containerStyle: {
            paddingHorizontal: 0,
            //marginTop: size.paddingSmall
        },
        inputContainerStyle: {
            backgroundColor: colors.input, 
            paddingHorizontal: size.paddingTiny,
            borderWidth: size.borderFine,
            borderColor: colors.border, 
            borderRadius: size.radiousTiny,
            height: lines ? lines * (size.formSmall - size.paddingSmall): size.formSmall, 
            borderBottomWidth: size.borderFine,
        },
        inputStyle: {
            color: colors.text,
            fontSize: size.textSmall,
            letterSpacing: 1,
            fontWeight: '100',
            fontFamily: 'Roboto'
        },
        label: { 
            //position: 'absolute',
            paddingHorizontal: size.paddingMin,
            marginLeft: size.marginTiny, 
            color: colors.default, 
            fontSize: size.textSmall, 
            zIndex: 2, 
            top: size.marginTiny-2,
            textShadowColor: colors.input, 
            textShadowRadius: 1.5, 
            letterSpacing: 1,
            fontWeight: '100',
            fontFamily: 'Roboto'
        },

        inputDisabled: { color: colors.default, borderColor: colors.input },
        labelDisabled: { color: colors.default },

        inputFocus: { borderColor: colors.primary },
        labelFocus: { color: colors.primary },

        inputBlur: { /* borderColor: colors.text */ },
        labelBlur: { /* color: colors.text */ },

        errorStyle: {
            display: 'flex'
        },
        errorStyleNone: {
            display: 'none'
        }

    })
    return styles;
}


export default InputCustom;