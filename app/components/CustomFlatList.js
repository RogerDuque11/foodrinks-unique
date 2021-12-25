import React, { useState, useEffect } from 'react'
import { View, FlatList, Dimensions } from 'react-native' 
import { FlatGrid } from 'react-native-super-grid'
import _ from "lodash"

import CurrentScheme from "../constants/CurrentScheme"
import PickerOrder from './PickerOrder' 
import PickerExport from './PickerExport' 
import InputSearch from './InputSearch'
import RenderItem from './CustomRenderItem'

const CustomFlatList = ({ props, data, refreshControl, style, callback }) => {
    const { styles, colors, size, isWebDesk } = CurrentScheme()
    const { 
        enableOrder, paramsOrderList, 
        enableFilter, paramsFilterList,
        enableExport, paramsExportList,
        paramsItem } = props

    const { columns } = paramsOrderList

    const [ dataSorted, setDataSorted ] = useState( null )
    const [ dataFiltered, setDataFiltered ] = useState( null )
    
    const orderData = (newData) => { setDataSorted(newData) }
    const filterData = (newData) => { setDataFiltered(newData) }

    const marginPikers = enableOrder && enableExport ? true : false
    const isGrid = paramsItem.type === 'GRID' || paramsItem.type === 'GRIDCOVER' ? true : false
    const [ itemWidth, setItemWidth ] = useState( isWebDesk ? 200 : 140 )
    const [ itemsRow, setItemsRow ] = useState( Math.round(size.fullWidth / itemWidth) )

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
            {   ! enableOrder ? null
                : <PickerOrder 
                    data={ data }
                    props={paramsOrderList}  
                    orderData={orderData}
                    style={[ styles.grow, marginPikers ? styles.marginTiny_R : null ]}/> 
            }
            {   ! enableExport ? null
                : <PickerExport 
                    data={data}
                    props={paramsExportList}  
                    //filterData={filterData}
                    style={[ styles.grow, marginPikers ? styles.marginTiny_L : null ]}/> 
            }
            </View>
        </View>
        {   data && isGrid ? 
            <FlatGrid 
                data={dataFiltered ? dataFiltered : dataSorted ? dataSorted : data}
                extraData={data}
                style={[ styles.marginSmall_X, style ]}
                refreshControl={ refreshControl }
                renderItem={({item, index})=> (
                    <RenderItem onPress={()=>callback(item, index)} props={{ item, index, columns, paramsItem }} />
                )} 
                horizontal={paramsItem.horizontal}
                //itemContainerStyle={[{height: 100, width: 100}]}
                itemDimension={itemWidth}  
                spacing={ paramsItem.margin } /> 
            : data ?
            <FlatList 
                data={dataFiltered ? dataFiltered : dataSorted ? dataSorted : data}
                extraData={data}
                style={[ styles.flatList, style ]}
                refreshControl={ refreshControl }
                keyExtractor={(item, index) => index+""}
                horizontal={paramsItem.horizontal}
                renderItem={({item, index})=> (
                    <RenderItem onPress={()=>callback(item, index)} props={{ item, index, columns, paramsItem }} />
                )}    /> 
            : null
        }
        </>
    )
}


export default CustomFlatList