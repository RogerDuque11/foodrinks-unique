import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import CurrentScheme from '../constants/CurrentScheme'
import Icon from './Icon';


export default function MenuFloating({props, onPressItem}) {
  const { styles, colors, size } = CurrentScheme()
  const { options } = props
  const [ open, setOpen ] = useState(false)
  const [ icon, setIcon ] = useState('plus')

  const selectItem = (func) => {
    onPressItem(func)
    openMenu()
  }

  const openMenu = () =>{ 
    setIcon(!open ? 'close' : 'plus') 
    setOpen(!open) 
  }

  return (
    <>
      { !open ? null : 
      <View style={[ styles.absolute, styles.alignEnd, styles.justifyEnd, {height: '100%', width: '100%'}]}>
          <TouchableOpacity style={[ styles.bgOpacityTheme, styles.absolute, {height: '100%', width: '100%'}]} onPress={openMenu} activeOpacity={0.85}> 
          </TouchableOpacity>
          <View style={[ styles.alignEnd, styles.paddingMedium_R, {paddingBottom: 120}]}>
            { Object.entries(options).map(([key, params]) =>  ( 
                <TouchableOpacity key={key} style={[ styles.row, styles.alignCenter, styles.paddingTiny, styles.marginTiny_B ]} onPress={() => selectItem(params.onPress) }>
                    <Text style={[styles.textTitle, styles.marginSmall_R ]} >{params.label}</Text>
                    <Icon name={params.icon} size={size.iconMedium} color={colors.text} library={params.library} />
                </TouchableOpacity>
            )) }
          </View>
      </View>
      }
    
      <View style={[ styles.absolute, {right: size.spacingSmall, bottom: size.spacingSmall}]}>   
          <TouchableOpacity style={[ styles.buttonCircle, styles.buttonFloating, styles.shadowTiny ]} onPress={openMenu} >
              <Icon name={icon} size={size.iconMedium} color={colors.background} library={''} />
          </TouchableOpacity>
      </View>
    </>
  )

}
