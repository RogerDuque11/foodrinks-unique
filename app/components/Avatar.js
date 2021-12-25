import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';

import CurrentScheme from '../constants/CurrentScheme'
import Icon from './Icon';

const CustomAvatar = (props) => {
  const { colors, size } = CurrentScheme()
  const styles = createStyles(props.rounded)
  
  return (
    <Avatar  

      activeOpacity={ props.activeOpacity ? props.activeOpacity : '0.7'}

      avatarStyle={[ styles.avatarStyle, props.avatarStyle ]}

      Component={ props.Component }

      containerStyle={[ styles.containerStyle, props.containerStyle ]}

      icon={  !props.icon ? null : <Icon name={props.icon.name} size={props.icon.size} color={props.icon.color} library={props.icon.library} />  }
      iconStyle={[ props.iconStyle ]}

      ImageComponent={ props.ImageComponent }
      imageProps={ props.imageProps }

      onLongPress={ props.onLongPress ? ()=> props.onLongPress() : null }
      onPress={ props.onPress ? ()=> props.onPress() : null }

      overlayContainerStyle={[ props.overlayContainerStyle ]}

      placeholderStyle={[ props.placeholderStyle ]}

      renderPlaceholderContent={ props.renderPlaceholderContent }

      rounded={ props.rounded }

      size={ props.size }

      source={ props.source }

      title={ props.title }
      titleStyle={[ props.titleStyle ]}
      >
        {
          ! props.option ? null
          : <TouchableOpacity style={[styles.option, props.option.style]} onPress={props.option.onPress ? ()=>props.option.onPress() : null} >
              <Icon name={props.option.name} size={props.option.size} color={props.option.color} />
          </TouchableOpacity>
        }
      
    </Avatar>
  )
}

const createStyles = (rounded) => {
  const { colors, size } = CurrentScheme()

  const styles = StyleSheet.create({
    containerStyle: {
      backgroundColor: colors.input
    },
    titleStyle: {
      fontFamily: 'Roboto',
      fontWeight: '300'
    },
    option: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      borderColor: colors.border,
      //borderWidth: 0.5,
      borderRadius: rounded ? 50 : 0,
      padding: size.paddingTiny
    }, 
    avatarStyle: {
      //backgroundColor: colors.card
    }
  })
  return styles;
}

export default CustomAvatar