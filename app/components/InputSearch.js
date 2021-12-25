import React, { useState } from 'react'
import { View, Text } from 'react-native' 
import { SearchBar } from 'react-native-elements'
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"


const InputSearch = ({ props, data, filterData, style}) => {
    const { styles, trans, isWeb } = CurrentScheme()
    const { label, columns } = props
    
    const [search, setSearch] = useState('')
    const [disabledSearch, setDisabledSearch] = useState(true)

    const searchColumn = (obj, search) => {
        var result = false
        columns.forEach(column => {
            var value = (obj[column]+'').toLowerCase()
            if(obj[column] && typeof obj[column] !== 'undefined' && (value).includes(search.toLowerCase())){
                result = true
            }
        })
        return result
    }

    const updateSearch = (search) => {
        setSearch(search)
        if(columns.length > 0){
            const filtered =  _.filter(data, (obj) => { return searchColumn(obj, search) })
            filterData(search === '' ? null : filtered)
        }
    }

    return (
        <View style={[ style ]}>
            <SearchBar
                placeholder={trans(label)}
                //disabled={disabledSearch}
                onChangeText={updateSearch} value={search}
                containerStyle={[ styles.bgTheme, {padding:0, borderTopWidth: 0, borderBottomWidth: 0}]}
                inputContainerStyle={[ styles.bgCard, styles.borderFine, styles.radiusTiny, styles.inputSmall]}
                inputStyle={[ styles.marginNone, styles.fontFamily, styles.textSmall, isWeb && {outline: "none"} ]} />
        </View>
    )
}

export default InputSearch