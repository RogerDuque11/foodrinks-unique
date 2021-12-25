import React from 'react';
import {Platform, View, ActivityIndicator, Modal} from "react-native";

import CurrentScheme from '../constants/CurrentScheme'

const LoadingScreen = (props) => {
  const { styles, colors } = CurrentScheme()
  
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={props.loading}
        style={ Platform.OS === 'web' ? [styles.modalWeb] : [] }>
          <View style={[styles.container, styles.bgTheme, styles.justifyCenter ]}>
            <ActivityIndicator size={24} color={colors.accent} />
          </View>
    </Modal>
  )
}


export default LoadingScreen
