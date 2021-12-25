import * as React from 'react';
import { 
  MaterialCommunityIcons, 
  MaterialIcons, 
  Ionicons, 
  FontAwesome, 
  FontAwesome5, 
  Fontisto,
  AntDesign,
  Feather,
  EvilIcons,
  Zocial,
  SimpleLineIcons,
  Entypo,
} from '@expo/vector-icons';


export default function TabBarIcon(props) {
  const {name, size, color, library} = props
  return (
    <>
    {
      library === 'MaterialIcons' ? <MaterialIcons  name={name} size={size} color={color} />
      : library === 'FontAwesome' ? <FontAwesome  name={name} size={size} color={color} />
      : library === 'FontAwesome5' ?  <FontAwesome5  name={name} size={size} color={color} />
      : library === 'Ionicons' ?  <Ionicons  name={name} size={size} color={color} />
      : library === 'Fontisto' ?  <Fontisto  name={name} size={size} color={color} />
      : library === 'AntDesign' ?  <AntDesign  name={name} size={size} color={color} />
      : library === 'Feather' ?  <Feather  name={name} size={size} color={color} />
      : library === 'EvilIcons' ?  <EvilIcons  name={name} size={size} color={color} />
      : library === 'Zocial' ?  <Zocial name={name} size={size} color={color} />
      : library === 'SimpleLineIcons' ?  <SimpleLineIcons name={name} size={size} color={color} />
      : library === 'Entypo' ?  <Entypo name={name} size={size} color={color} />
      : <MaterialCommunityIcons  name={name} size={size} color={color} />
    }
    </>
  )
}
