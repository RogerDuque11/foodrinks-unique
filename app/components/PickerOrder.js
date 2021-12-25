import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native' 
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import Icon from './Icon'
import PickeBorder from './PickerBorder';


const PikerFilter = ({props, data, orderData, style}) => {
    const { styles, colors, size } = CurrentScheme()
    const { label, labelFirst, columns } = props

    const columns2  = labelFirst ? [labelFirst].concat(columns) : columns
    const [ direction, setDirection ] = useState("asc")
    const [ selectedColumn, setSelectedColumn ] = useState(null)
    
    const sortTable = (column) => {
        const def =  column === labelFirst ? true : false
        const dir = def ? dir : direction === "desc" ? "asc" : "desc" 
        const sorted = def ? null : _.orderBy(data, [column], [dir])
        setSelectedColumn(column)
        setDirection(def ? direction : dir)
        orderData(sorted)
    }

    return (
        <View style={[ style ]}>
            {
                !label ? null : 
                <Text style={[styles.textMedium, styles.colorDefault, styles.textCenter, styles.marginTiny_B ]}>{label}</Text>
            }
            
            <View style={[ styles.row, styles.bgCard, styles.radiusTiny, styles.borderFine ]}>
                <TouchableOpacity style={[ styles.paddingTiny ]} onPress={()=>sortTable(selectedColumn)} >
                    <Icon color={selectedColumn !== labelFirst ? colors.primary : colors.default} name={direction === "desc" ? "arrow-down" : "arrow-up"} size={size.iconMin}/>
                </TouchableOpacity>
                <PickeBorder 
                    values={columns2} 
                    labelFirst={labelFirst} 
                    onValueChange={sortTable} 
                    styles={[ styles.borderNone, styles.container, {marginTop: 0} ]} />
            </View>
        </View>
    )
}


export default PikerFilter