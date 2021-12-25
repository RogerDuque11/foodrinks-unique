import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native' 
import { ListItem } from 'react-native-elements'
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import Avatar from './Avatar'
import Icon from './Icon'

export default function CustomRenderItem ({ props, onPress }) {
    const { styles, colors, size, isWebDesk, trans } = CurrentScheme()
    const { item, index, columns, paramsItem } = props
    const validate = (pos) =>{ return typeof columns[pos] === "undefined" ? '' : trans(item[columns[pos]])  }
    const newProps = { item, paramsItem, onPress, validate, styles, colors, size, isWebDesk }

    return (
        paramsItem.type === 'GRID' ? <ItemCustomGrid props={newProps} />
        : paramsItem.type === 'CARD' ? <ItemCustomCard props={newProps} />
        : paramsItem.type === 'GRIDCOVER' ? <ItemCustomGridCover props={newProps} />
        : paramsItem.type === 'SELECTHORIZONTAL' ? <ItemSelectHorizontal props={newProps} />
        : <ItemDefault props={newProps} />
    )
}


const LeftComponent = (paramsItem, item, validate) => { 
    const { image, icon, margin } = paramsItem
    return (
        image ? <Avatar 
                    rounded={image.rounded} 
                    size={image.size}  
                    title={validate(0)[0]}
                    source={ item[image.label] ? {uri: item[image.label]} : null} />
        : icon ? <Icon 
                    name={icon.name} 
                    size={icon.size} 
                    color={icon.color} 
                    library={icon.library} />
        : <></>
    )
}


const ItemDefault = ({ props }) => {
    const { item, paramsItem, onPress, validate, styles, colors } = props
    return (
        <ListItem onPress={()=>onPress()}  containerStyle={[ styles.bgCard, styles.paddingTiny_Y, styles.radiusTiny, {marginBottom: paramsItem.margin} ]} underlayColor={colors.transparent} >
            { LeftComponent(paramsItem, item, validate) }
            <ListItem.Content style={[  ]}>
                <ListItem.Title style={[ styles.colorText, paramsItem.styleText1 ]}>{validate(0)}</ListItem.Title>
                { ! validate(2) ? null : <ListItem.Subtitle style={[ styles.colorDefault, paramsItem.styleText2 ]}>{validate(2)}</ListItem.Subtitle> }
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    )
}

const ItemCustomCard = ({ props }) => {
    const { item, paramsItem, onPress, validate, styles, colors } = props
    return (
        <ListItem onPress={()=>onPress()}  containerStyle={[ styles.flex, styles.bgCard, styles.paddingTiny, styles.radiusTiny, styles.borderFine, {marginBottom: paramsItem.margin} ]} underlayColor={colors.transparent} >
            {
                paramsItem.right ? null :
                <View style={[ styles.row, styles.paddingTiny_L, paramsItem.styleComponent ]}> 
                    { LeftComponent(paramsItem, item, validate) }
                </View>
            }
            <View style={[styles.flex,  paramsItem.right ? styles.marginTiny_L : styles.marginTiny_R ]}>
                <View style={[styles.row, styles.justifyBetween]}>
                    <Text style={[styles.textSmall, styles.textBold, paramsItem.styleText1 ]}>{validate(0)}</Text>
                    { ! validate(3) ? null : <Text style={[styles.textSmall, styles.textBold, paramsItem.styleText4 ]}>{validate(3)}</Text> }
                </View>
                {
                    !(validate(1) || validate(4)) ? null
                    : <View style={[styles.row, styles.justifyBetween, paramsItem.styleText2 ]}>
                        <Text style={[styles.textSmall ]}>{validate(1)}</Text>
                        <Text style={[styles.textSmall, paramsItem.styleText5 ]}>{validate(4)}</Text> 
                    </View>
                }
                {
                    !(validate(2) || validate(5)) ? null
                    : <View style={[styles.row, styles.justifyBetween]}>
                        <Text style={[styles.textTiny, styles.colorDefault, paramsItem.styleText3 ]}>{validate(2)}</Text>
                        <Text style={[styles.textTiny, styles.colorDefault, paramsItem.styleText6 ]}>{validate(5)}</Text> 
                    </View>
                }
            </View>
            {
                !paramsItem.right ? null :
                <View style={[ styles.row, styles.paddingTiny_R, paramsItem.styleComponent ]}>
                    { LeftComponent(paramsItem, item, validate) }
                </View>
            }
        </ListItem>
    )
}

const ItemCustomGrid = ({ props }) => {
    const { item, paramsItem, onPress, validate, styles, colors } = props
    return (
        <TouchableOpacity onPress={()=>onPress()} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, styles.borderFine  ]} underlayColor={colors.transparent} >
            <View style={[ styles.alignCenter, styles.paddingTiny, paramsItem.styleComponent ]}>
                { LeftComponent(paramsItem, item, validate) }
            </View>
            <View style={[ styles.paddingTiny, styles.radiusTiny_B ]}>
                <Text numberOfLines={1} style={[styles.textSmall, styles.textBold, styles.textCenter, paramsItem.styleText1]}>{validate(0)}</Text>
                <Text numberOfLines={1} style={[styles.textSmall, styles.textCenter, paramsItem.styleText2]}>{validate(1)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const ItemCustomGridCover = ({ props }) => {
    const { item, paramsItem, onPress, validate, styles, colors } = props
    const { image } = paramsItem
    return (
        <TouchableOpacity onPress={()=>onPress()} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, styles.borderFine  ]} underlayColor={colors.transparent} >
            <View style={[ styles.alignCenter ]}>
                <Avatar 
                    rounded={image.rounded} 
                    size={image.size}  
                    title={validate(0)[0]}
                    source={ item[image.label] ? {uri: item[image.label]} : null}
                    avatarStyle={[ ]}
                    containerStyle={[styles.imageCover, {width: '100%', height: image.size}, paramsItem.styleComponet]} />
            </View>
            <View style={[styles.bgTable, styles.paddingTiny, styles.radiusTiny_B]}>
                <Text numberOfLines={1} style={[styles.textSmall, styles.textBold, styles.textCenter, paramsItem.styleText1]}>{validate(0)}</Text>
                <Text numberOfLines={1} style={[styles.textSmall, styles.textCenter, paramsItem.styleText2]}>{validate(1)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const ItemSelectHorizontal = ({ props }) => {
    const { item, paramsItem, onPress, validate, styles, colors } = props
    const { image } = paramsItem
    return (
        <TouchableOpacity onPress={()=>onPress()} style={[styles.grid, styles.bgCard, styles.column, styles.radiusTiny, styles.borderFine  ]} underlayColor={colors.transparent} >
            <View style={[ styles.alignCenter ]}>
                <Avatar 
                    rounded={image.rounded} 
                    size={image.size}  
                    title={validate(0)[0]}
                    source={ item[image.label] ? {uri: item[image.label]} : null}
                    avatarStyle={[ ]}
                    containerStyle={[styles.imageCover, {width: '100%', height: image.size}, paramsItem.styleComponet]} />
            </View>
            <View style={[styles.bgTable, styles.paddingTiny, styles.radiusTiny_B]}>
                <Text numberOfLines={2} style={[styles.textSmall, styles.textBold, styles.textCenter, paramsItem.styleText1]}>{validate(0)}</Text>
                <Text numberOfLines={1} style={[styles.textSmall, styles.textCenter, paramsItem.styleText2]}>{validate(1)}</Text>
            </View>
        </TouchableOpacity>
    )
}
