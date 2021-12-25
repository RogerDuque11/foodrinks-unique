import React, { useState } from 'react';
import { Switch } from 'react-native-elements';

import CurrentScheme from '../constants/CurrentScheme'

const CustomSwitch = (props) => {
  const { styles, colors } = CurrentScheme()
  const [enable, setEnable] = useState(props.value)

  const updateEnable = (value) => {
    if(props.onValueChange){
      setEnable(value)
      props.onValueChange(value)
    }
  }
  
  return (
    <Switch 
      value={enable} 
      color={props.color} 
      onValueChange={updateEnable}
      style={[props.style]}></Switch>
  )
}


export default CustomSwitch