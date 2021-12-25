import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';

import CurrentScheme from '../constants/CurrentScheme'


const PickerBorder = (props) => {
  const { background, color, borderColor, labelFirst, label, disabled, onValueChange, values, tag, currentValue, nullable } = props
  const styles = createStyles(background, color, borderColor)
  const { colors, trans } = CurrentScheme()
  
  const enabled = disabled ? false : true
  const [ selectedValue, setSelectedValue ] = useState('')

  const containerState =  !enabled ? styles.containerDisabled : null
  const pickerState = !enabled 
        || !selectedValue
        || labelFirst && (labelFirst === selectedValue) 
        || labelFirst && (selectedValue === '') ?  
        styles.pickerDisabled : (color ? {color: color} : null)
 

  useEffect(()=>{
    
    initialValue()

  }, [ values, disabled, selectedValue, /* currentValue */ ] )

  const initialValue = () =>{
    if(!selectedValue){
      if(values && currentValue){
        values.map((value, index)=>{
          if(tag && (value[tag] === currentValue[tag] || value[tag] === currentValue) ){
            onValueChangePicker(value, index)
          } else if(value === currentValue){
            onValueChangePicker(value, index)
          }
        })
      } else if (values && !currentValue){
        if((labelFirst && values.length > 1) || (labelFirst && nullable) ){
          onValueChangePicker(null, 0) //labelFirst
        } else {
          values[0] ? onValueChangePicker(values[0], 0) : null
        }
      }
    }
  }

  const onValueChangePicker = (value, index) => {
    setSelectedValue(value)
    onValueChange(value)
  }

  return (
    <View style={[styles.containerPicker, containerState, props.styles ]}>
      {
        !label ? null :
        <LabelStroke values={{tag:label, styles}} />
      }
      <Picker
        selectedValue={selectedValue}
        mode={'dialog'}
        enabled={enabled}
        style={[ styles.picker, props.pickerStyle, pickerState ]}
        onValueChange={(value, index) => onValueChangePicker(value, index)}  >
          {
            (values.length > 1 || nullable) && labelFirst ? <Picker.Item value={null} label={trans(labelFirst)} /> : null
          }
          {
            values.length === 1  ?
              <Picker.Item value={values[0]} label={tag ? trans(values[0][tag]) : trans(values[0])} />
            
            :
             values.length > 1 ?
              (values).map((value, index) => (
                <Picker.Item key={index} value={value} label={tag ? trans(value[tag]) : trans(value)} />
              )) 

            : <Picker.Item label={' '} value={'0'} />
          }
      </Picker>
      
    </View>
  )
}

const LabelStroke = ({values}) => {
    const {styles, tag} = values
    return (
        <View>
            <Text style={[ styles.label, {textShadowOffset: {width:  1.25, height:  1.25}}]}>{tag}</Text> 
            <Text style={[ styles.label, {textShadowOffset: {width: -1.25, height: -1.25}}]}>{tag}</Text> 
            <Text style={[ styles.label, {textShadowOffset: {width: -1.25, height:  1.25}}]}>{tag}</Text>
            <Text style={[ styles.label, {textShadowOffset: {width:  1.25, height: -1.25}}]}>{tag}</Text>
        </View>
    )
}

const createStyles = (background, color, borderColor) => {
    const { colors, size, isWebDesk } = CurrentScheme()

    const styles = StyleSheet.create({
      containerPicker: {
        backgroundColor: background ? background : colors.input,
        borderWidth: size.borderFine,
        borderColor: borderColor ? borderColor : colors.border, 
        borderRadius: size.radiousTiny,
        marginTop: size.marginSmall,
      },

      picker: {
        backgroundColor: background ? background : colors.input,
        borderRadius: size.radiousTiny,
        paddingHorizontal: size.paddingTiny,
        borderWidth: 0,
        height: size.formSmall, 
        fontSize: size.textSmall,
        color: color ? color : colors.text,
        letterSpacing: 1,
        fontFamily: 'Roboto',
      },

      item: {
        fontSize: size.textSmall,
        color: color ? color : colors.text,
        letterSpacing: 1,
        fontFamily: 'Roboto'
      },
      
      label: { 
        position: 'absolute',
        paddingHorizontal: size.paddingMin,
        marginLeft: size.marginTiny, 
        color: colors.default, 
        fontSize: size.textSmall, 
        zIndex: 2, 
        top: -size.marginTiny-3,
        textShadowColor: colors.input, 
        textShadowRadius: 1.5, 
        letterSpacing: 1,
        fontFamily: 'Roboto'
      },

      containerDisabled: { borderColor: colors.input },
      pickerDisabled: { color: colors.default  },

      pickerBlur: { color: colors.primary },

    })
    return styles;
}


export default PickerBorder
