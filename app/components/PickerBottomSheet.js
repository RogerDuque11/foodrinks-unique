import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { BottomSheet, ListItem } from 'react-native-elements';

import CurrentScheme from '../constants/CurrentScheme'

const PickerBottomSheet = (props) => {
  const { background, color, labelFirst, label, disabled, value, onValueChange, values } = props
  const styles = createStyles(background)
  const { colors, trans } = CurrentScheme()
  const [colorText, setColorText] = useState(color ? color : colors.default)
  const inputSize = props.inputSize ? props.inputSize : styles.inputSmall
  //const labelFirst = props.labelFirst ? true : false
  const enabled = disabled ? false : true
  const [isVisible, setIsVisible] = useState(false);
  
  const [selectedValue, setSelectedValue] = useState(value ? value : null)

  const onSelect = (value, index) => {
    setSelectedValue(value)
    setIsVisible(false)
      
      /* if(index === 0 && labelFirst){
        setColorText(colors.default)
        onValueChange(null)
      } else if(index === 0 && !labelFirst){
        setColorText(colors.text)
        onValueChange(value)
      } else {
          setColorText(colors.text)
          onValueChange(value)
      } */
    
  }

  return (
    <>
      {
        !label ? null :
        <LabelStroke values={{tag:label, styles}} />
      }
      <Text
        style={[styles.containerPicker, props.styles, inputSize ]} 
        onPress={()=>setIsVisible(true)}>
          {trans(selectedValue)}
      </Text>

    
    <BottomSheet
      onRequestClose={()=>setIsVisible(!isVisible)}
      isVisible={isVisible}
      containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.4)' }}
      modalProps={{
        //onRequestClose={ onSelect }
      }}
    >
      {
            values ?
            Object.entries(values).map(([key, value]) => (
              <ListItem key={key}>
                <ListItem.Content>
                  <ListItem.Title onPress={()=>onSelect(value, key)}>{trans(value)}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )) : <></>
      }
    
    </BottomSheet>
    </>
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
        marginTop: size.marginSmall,
      },
      picker: {
        backgroundColor: background ? background :colors.input,
        borderRadius: size.radiousTiny,
        paddingHorizontal: size.paddingTiny,
        borderWidth: 0,
        fontSize: size.textSmall,
        color: colors.text,
      },
      inputSmall: { 
        flex: 1,
        height: size.formSmall, 
        padding: size.paddingTiny,
        fontSize: size.textSmall,
        color: colors.text,
      },
      
      inputLabel: { 
        position: 'absolute',
        paddingHorizontal: size.paddingMin,
        marginLeft: size.marginTiny, 
        color: colors.default, 
        fontSize: size.textSmall, 
        zIndex: 2, 
        top: size.marginTiny-3,
        textShadowColor: colors.input, 
        textShadowRadius: 1.5, 
    },

    })
    return styles;
}


export default PickerBottomSheet
