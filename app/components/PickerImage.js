import React, { useState, useEffect } from 'react'
import { View, Platform } from "react-native"
import * as ImagePicker from 'expo-image-picker';

import CurrentScheme from '../constants/CurrentScheme'
import Avatar from './Avatar'

const CustomImagePicker = (props) => {
  const { styles, colors, size } = CurrentScheme()
  const { aspectImage, imageUri, quality, imageSize, imageRounded, callback, containerStyle } = props
  const [image, setImage] = useState(imageUri)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [imageUri]);

  const pickImage = async () => {
    if(callback){
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: aspectImage ? aspectImage : [5, 6],
      quality: quality ? quality : 1,
      });
          
      if(!result.cancelled) {
        setImage(result.uri)
        callback(result.uri)
      }
    }
  } 

  const cancelImage = () => {
    //setImage(null)
    callback(null)
  }

  return (
    <Avatar 
        rounded={ imageRounded }
        size={ imageSize } 
        source={ !image ? null : { uri: image } } 
        title={ !image ? 'US': null}
        onPress={ callback ? pickImage : null }
        containerStyle={[styles.bgInput, containerStyle]}
        option={ !image || !callback ? null : {
            name: 'delete-outline', color: colors.text, size: size.iconSmall, style:[styles.bgOpacityTheme], onPress:()=>cancelImage()
        }}
      />
    
  )
}

export default CustomImagePicker
