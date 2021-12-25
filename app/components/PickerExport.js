import React, { useState } from 'react';
import { View, Text } from 'react-native' 
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import Icon from './Icon';
import PickeBorder from './PickerBorder';


const PikerExport = ({ props, data, style}) => {
    const { styles, colors, size } = CurrentScheme()
    const { label, labelFirst, formats } = props
    
    const values  = labelFirst ? [labelFirst].concat(formats) : formats

    const exportTo = (format) => {
        console.log(format)
    }

    return (
        <View style={[ style ]}>
            {
                !label ? null : 
                <Text style={[styles.textMedium, styles.colorDefault, styles.textCenter, styles.marginTiny_B ]}>{label}</Text>
            }
            
            <View style={[ styles.row, styles.bgCard, styles.radiusTiny, styles.borderFine ]}>
                <View style={[ styles.paddingTiny ]} >
                    <Icon color={colors.default} name={"export"} size={size.iconMin} library='AntDesign' />
                </View>
                <PickeBorder 
                    values={values} 
                    labelFirst={labelFirst} 
                    onValueChange={exportTo} 
                    styles={[styles.borderNone, styles.container, {marginTop: 0} ]} />
            </View>
        </View>
    )
}

export default PikerExport