import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Platform } from 'react-native'
import { AppearanceProvider } from 'react-native-appearance'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LogBox } from "react-native"

import CurrentScheme from './app/constants/CurrentScheme'
import NavigationFlow from "./app/navigation/NavigationFlow"

export default function App() {
  const { styles, colors } =  CurrentScheme()

  if(Platform.OS !== 'web'){
    LogBox.ignoreLogs([
      "Setting a timer", 
      "Non-serializable values were found in the navigation state"
    ]);
  }

  return (
    <SafeAreaProvider>
      <AppearanceProvider >
        <StatusBar style="auto" />
        <View style={[ styles.container, {backgroundColor: colors.background}]}>
          <NavigationFlow/>
        </View>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}