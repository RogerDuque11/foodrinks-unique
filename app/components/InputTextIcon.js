import React, {useState, useEffect} from "react";
import { StyleSheet, View, TextInput} from 'react-native'

import CurrentScheme from '../constants/CurrentScheme'
import Icon from '../components/Icon';

var InputCustom = (props) => {
    const { inputStyle, containerStyle, submit } = props
    const styles = createStyles()
    const { colors, size, isWeb } = CurrentScheme()

    const [isFocus, setIsFocus] = useState();
    const [value, setValue] = useState(props.value)

    const icon = props.icon ? props.icon : 'exit-to-app'
    const inputSize = props.inputSize ? props.inputSize : null
    //const inputStyle = props.inputStyle ? props.inputStyle : null
    const groupStyle = props.groupStyle ? props.groupStyle : null
    const editable = props.editable != null && !props.editable ? false : true

    const validate = props.validate != null && !props.validate ? false : true
    const validation = !validate && props.validation ? props.validation : null
    
    const inputDisabled = !editable ? styles.inputDisabled : null
    const inputFocus = isFocus ? styles.inputFocus : null
    const inputValidate = !inputDisabled && !inputFocus && !validate? styles.inputNotValidate : null
    const iconState = isFocus ? colors.primary : !validate ? colors.error : colors.default
    

    const onChangeText = async (text) => {
        setValue(text)
        props.onChangeText(text)
    }

    return (
        <View style={[containerStyle, styles.inputGroup, groupStyle, inputSize, inputFocus, inputDisabled, inputValidate ]}>
            <Icon name={icon} size={size.iconSmall} color={iconState} />
            <TextInput
                keyboardType={props.type}
                multiline={props.multiline} 
                numberOfLines={props.lines}
                editable={editable}
                onChangeText={(text) => onChangeText(text)  }
                label={props.type}
                onFocus={() => setIsFocus(true) }
                onBlur={() => setIsFocus(false) }
                value={value}
                secureTextEntry={props.secure? props.secure : false}
                autoCompleteType={props.autocomplete? props.autoComplete : 'off'}
                placeholderTextColor={colors.default}
                placeholder={props.tag}
                style={[ styles.input, inputStyle, isWeb && {outline: "none"} ]}
            />
        </View>
    )
}

const createStyles = () => {
    const { colors, size, isWeb } = CurrentScheme()

    const styles = StyleSheet.create({
        input: {
            color: colors.text,
            marginLeft: size.marginSmall,
            flex: 1,
        },
        inputGroup: {
            backgroundColor: colors.input, 
            color: colors.text,
            paddingVertical: size.paddingTiny,
            paddingHorizontal: size.paddingTiny,
            borderWidth: size.borderFine,
            borderColor: colors.border, 
            borderRadius: size.radiousTiny,
            height: size.formSmall, 
            fontSize: size.textSmall,
            marginTop: size.marginTiny,
            flexDirection: 'row',
            letterSpacing: 1,
            fontFamily: 'Roboto'
        },

        inputDisabled: { color: colors.default },
        inputFocus: { borderColor: colors.primary },
        inputNotValidate: { borderColor: colors.error },
    })
    return styles;
}


export default InputCustom;

