import * as React from 'react';
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements';

import CurrentScheme from '../constants/CurrentScheme'
import Icon from './Icon';

const CustomButton = (props) => {
  const styles = createStyles()
  
  return (
    <Button  
      type={props.type} 

      title={props.title}
      titleStyle={[ styles.titleStyle, props.titleStyle ]}
      titleProps={props.titleProps}
      
      icon={ !props.icon ? null : <Icon name={props.icon.name} size={props.icon.size} color={props.icon.color} library={props.icon.library} /> }
      iconRight={props.iconRight}
      iconContainerStyle={[props.iconContainerStyle]}

      loading={props.loading}
      loadingProps={props.loadingProps}
      loadingStyle={[props.loadingStyle]}
     
      buttonStyle={[ styles.buttonStyle, props.buttonStyle ]}
      onPress={()=>props.onPress ? props.onPress() : null} 

      disabled={props.disabled}
      disabledStyle={[props.disabledStyle]}
      disabledTitleStyle={[props.disabledTitleStyle]}

      raised={props.raised}
      containerStyle={[props.containerStyle]}
      linearGradientProps={props.linearGradientProps}
      TouchableComponent={props.TouchableComponent}
      ViewComponent={props.ViewComponent}
    />
  )
}

const createStyles = () => {
  const { colors, size } = CurrentScheme()

  const styles = StyleSheet.create({
    titleStyle: {
      fontFamily: 'Roboto',
      fontWeight: '300',
      letterSpacing: 1
    },
    buttonStyle: {
      borderRadius: size.radiousTiny
    }
  })
  return styles;
}

export default CustomButton