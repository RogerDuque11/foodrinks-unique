import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';

import CurrentScheme from '../constants/CurrentScheme'

const CustomBottomSheet = (props) => {
  const styles = createStyles(props.background)
  const { colors, trans } = CurrentScheme()
  const [colorText, setColorText] = useState(colors.default)
  const inputSize = props.inputSize ? props.inputSize : styles.inputSmall
  const labelFirst = props.labelFirst ? true : false
  
  const [selectedValue, setSelectedValue] = useState(props.value ? props.value : null)

  const onValueChange = (value, index) => {
    setSelectedValue(value)
    if(index === 0 && labelFirst){
      setColorText(colors.default)
      props.onValueChange(null)
    } else if(index === 0 && !labelFirst){
      setColorText(colors.text)
      props.onValueChange(value)
    } else {
        setColorText(colors.text)
        props.onValueChange(value)
    }
  }

  return (
    <View style={[styles.containerPicker, props.styles, inputSize ]}>
      {
        !props.label ? null :
        <LabelStroke values={{tag:props.label, styles}} />
      }
      <Picker
        selectedValue={selectedValue}
        mode={'dialog'}
        style={[ styles.picker, inputSize, { color: colorText }]}
        onValueChange={(value, index) => onValueChange(value, index)}  >
          {
            props.values ?
            Object.entries(props.values).map(([key, value]) => (
              <Picker.Item key={key} value={value} label={trans(value)} />
            )) : <Picker.Item label={'NO LABEL'} value={'0'} />
          }
      </Picker>
      
    </View>
  )
}

const LabelStroke = ({values}) => {
    const {styles, tag} = values
    return (
        <View>
            <Text style={[ styles.inputLabel, {textShadowOffset: {width:  1.25, height:  1.25}}]}>{tag}</Text> 
            <Text style={[ styles.inputLabel, {textShadowOffset: {width: -1.25, height: -1.25}}]}>{tag}</Text> 
            <Text style={[ styles.inputLabel, {textShadowOffset: {width: -1.25, height:  1.25}}]}>{tag}</Text>
            <Text style={[ styles.inputLabel, {textShadowOffset: {width:  1.25, height: -1.25}}]}>{tag}</Text>
        </View>
    )
}

const createStyles = (background) => {
    const { colors, size, isWebDesk } = CurrentScheme()

    const styles = StyleSheet.create({
      containerPicker: {
        backgroundColor: background ? background :colors.input,
        borderWidth: size.borderFine,
        borderColor: colors.border, 
        borderRadius: size.radiousTiny,
        marginTop: size.marginSmall
      },
      picker: {
        backgroundColor: background ? background :colors.input,
        borderRadius: size.radiousTiny,
        paddingHorizontal: size.paddingTiny,
        borderWidth: 0,
      },
      inputSmall: { 
        height: size.formSmall, 
        fontSize: size.textSmall 
      },
      
      inputLabel: { 
        position: 'absolute',
        paddingHorizontal: size.paddingMin,
        marginLeft: size.marginTiny, 
        color: colors.default, 
        fontSize: size.textSmall, 
        zIndex: 2, 
        top: -size.marginTiny-2,
        textShadowColor: colors.input, 
        textShadowRadius: 1.5, 
    },

    })
    return styles;
}


export default CustomBottomSheet
