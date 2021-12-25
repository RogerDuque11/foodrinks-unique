import * as React from 'react'
import { StyleSheet } from 'react-native'
import { ButtonGroup } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'

const CustomButtonGroup = (props) => {
  const styles = createStyles()
  
  return (
    <ButtonGroup  
      buttons={props.buttons}
      buttonStyle={[ styles.buttonStyle, props.buttonStyle ]}
      buttonContainerStyle={[ styles.buttonContainerStyle, props.buttonContainerStyle ]}

      disabled={props.disabled}
      disabledStyle={props.disabledStyle}      
      disabledTextStyle={[ styles.disabledTextStyle, props.disabledTextStyle ]}
      disabledSelectedStyle={props.disabledSelectedStyle}
      disabledSelectedTextStyle={[props.disabledSelectedTextStyle]}
     
      onPress={props.onPress ? props.onPress : null} 

      selectedButtonStyle={[ styles.selectedButtonStyle, props.selectedButtonStyle ]}
      selectedIndex={props.selectedIndex}
      selectedIndexes={props.selectedIndexes}
      selectedTextStyle={[ styles.selectedTextStyle, props.selectedTextStyle ]}
      selectMultiple={props.selectMultiple}

      containerStyle={[ styles.containerStyle, props.containerStyle]}
      innerBorderStyle={props.innerBorderStyle}
      component={props.component} 
      textStyle={[ styles.textStyle, props.textStyle ]}
      underlayColor={props.underlayColor}
      vertical={props.vertical}
    />
  )
}

const createStyles = () => {
  const { colors, size } = CurrentScheme()

  const styles = StyleSheet.create({
    titleStyle: {
      fontFamily: 'Roboto',
      fontWeight: '300'
    },
    buttonStyle: {
      backgroundColor: colors.card
    },
    textStyle: {
      color: colors.default,
      fontSize: size.textSmall,
      fontWeight: "normal",
      letterSpacing: 1,
      textTransform: 'uppercase',
      fontFamily: 'Roboto',
    },
    buttonContainerStyle: {
      borderColor: colors.border
    },
    containerStyle: {
      borderColor: colors.border
    },
    selectedButtonStyle: {
      backgroundColor: colors.card
    },
    selectedTextStyle: {
      color: colors.text,
      //fontWeight: 'bold'
    },
    disabledTextStyle: {
      
    }
  })
  return styles;
}

export default CustomButtonGroup