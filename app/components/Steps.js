import React, { useState } from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-elements'

import CurrentScheme from '../constants/CurrentScheme'


export default function CustomSteps( props) {
  const { styles, colors, size } = CurrentScheme()
  const { stepsNumber, active, activeColor, inactiveColor, style } = props

  const createBadges = () =>{
    const badges = []
    for (let index = 1; index <= stepsNumber; index++) {
       badges.push(
        <Badge key={index} 
          containerStyle={[ styles.paddingMin, { }]}
          badgeStyle={[styles.borderFine,{backgroundColor: index === active ? activeColor : inactiveColor}]} 
        />
        )
    }
    return badges
  } 

  return (
    !stepsNumber ? null : 
      <View style={[ styles.row, styles.wrap, styles.justifyCenter, style]}>
        { createBadges() }
      </View>
  )

}
