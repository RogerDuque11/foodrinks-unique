import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import Icon from './Icon';


export default function MenuCards({props, onPressItem}) {
  const { styles, colors, size } = CurrentScheme()
  const { options } = props

  const selectItem = (func) => {
    onPressItem(func)
  }

  return (
    <View style={[ styles.absolute, {right: size.spacingSmall, bottom: size.spacingSmall}]}>
      <View style={[styles.row, styles.wrap ]} >
          { Object.entries(options).map(([key, params]) =>  ( 
            <TouchableOpacity key={key} style={[styles.button, styles.column, styles.radiusTiny, styles.marginTiny_L ]} onPress={() => selectItem(params.onPress) }>
              <Icon name={params.icon} size={size.iconMedium} color={colors.text} library={params.library} />
              <Text style={[styles.textTiny ]} >{params.label}</Text>
            </TouchableOpacity>
          )) }
      </View>
    </View>
  )

}
