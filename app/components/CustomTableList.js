import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, } from 'react-native' 
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import Icon from './Icon'
import DataOptions from '../constants/DataOptions';
import PickerExport from './PickerExport' 
import InputSearch from './InputSearch' 

const CustomTableList = ({ props, data, refreshControl, style, callback }) => {
    const { styles, size, isWebDesk } = CurrentScheme()
    const { 
        enableOrder, paramsOrderList, 
        enableFilter, paramsFilterList, 
        enableExport, paramsExportList,
        columnsWidth } = props

    const { columns } = paramsOrderList
    const columns2 = isWebDesk ? columns : columns.slice(0, columnsWidth.length)

    const [ direction, setDirection ] = useState(null)
    const [ selectedColumn, setSelectedColumn ] = useState(null)
    const [ dataSorted, setDataSorted ] = useState( null )
    const [ dataFiltered, setDataFiltered ] = useState( null )

    const orderData = (column) => {
        if(enableOrder){
            const result = DataOptions.sort(data, column, direction)
            setSelectedColumn(column)
            setDirection(result.direction)
            setDataSorted(result.data)
        }
    }
    const filterData = (newData) => { setDataFiltered(newData) }

    return (
        <>
        <View style={[ styles.flatOptions ]} >
        {   ! enableFilter ? null
            : <InputSearch 
                data={data}
                props={paramsFilterList}  
                filterData={filterData}
                style={[ styles.marginTiny_B, styles.grow, {marginRight: isWebDesk ? size.marginTiny: 0} ]}/> 
        }
            <View style={[ styles.row, styles.grow ]}>
            {   ! enableExport ? null
                : <PickerExport 
                    data={data}
                    props={paramsExportList}  
                    //filterData={filterData}
                    style={[ styles.grow, styles.marginTiny_L ]}/>  
            }
            </View>
        </View>
        {   !data ? null :
            <FlatList 
                data={dataFiltered ? dataFiltered : dataSorted ? dataSorted : data}
                extraData={data}
                style={[styles.flatList, style]}
                refreshControl={ refreshControl }
                keyExtractor={(item, index) => index+""}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={()=> (
                    <RenderHeaderTable 
                    props={{columns2, direction, selectedColumn, columnsWidth }} 
                    orderData={(column)=>orderData(column)} />
                )}
                renderItem={({item, index})=> (
                    <RenderItemTable onPress={()=>callback(item, index)} props={{item, index, columns2, columnsWidth }} />
                )}   /> }
        </>
    )
}

const RenderHeaderTable = ({ props, orderData }) => {
    const { styles, size, trans } = CurrentScheme()
    const {columns2, selectedColumn, direction, columnsWidth  } = props
    return (
        <View style={[styles.tableHeader, styles.bgPrimary, styles.radiusTiny_T]}>
        {
             Object.entries(columns2).map((column, index) => {
                return (
                    ! column[1] ? null :
                    <TouchableOpacity key={index} style={[ {width: columnsWidth[index]}]} onPress={()=> orderData(column[1])} >
                        <Text style={[styles.textTableHeader, styles.bgPrimary]}>
                            { trans(column[1]) + " " } 
                            { selectedColumn === column[1] && <Icon name={direction === "desc" ? "arrow-down" : "arrow-up"} size={size.iconMin}/> }
                        </Text>
                    </TouchableOpacity>
                )
            })
        }
        </View>
    )
}

const RenderItemTable = ({ props, onPress }) => {
    const { styles, colors, trans } = CurrentScheme()
    const {item, index, columns2, columnsWidth } = props
    const validate = (column) =>{
        return typeof item[column] === "undefined" ? '' : item[column]
    }
    return (
        <View style={[styles.tableRow, {backgroundColor: index % 2 == 1 ? colors.table : colors.input}]}>
        {
            Object.entries(columns2).map((column, index) => {
                return (
                    ! column[1] ? null :
                    <Text key={index} style={[styles.textTableRow, {width: columnsWidth[index] }]} onPress={onPress} >{trans(validate(column[1]))}</Text>
                )
            })
        }
        </View>
    )
}


export default CustomTableList