import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import CurrentScheme from '../../constants/CurrentScheme'
import Constants from "../../constants/Constants"
import Icon from '../../components/Icon'
import PickerType from '../../components/PickerOrderType'
import PickerState from '../../components/PickerOrderState'
import PickerBorder from '../../components/PickerBorder'


const OrderType = ({ props }) => {
    const { PROFILE, LOCAL } = Constants.SESION
    const { styles, colors, size, trans, isWeb, states, substates } = CurrentScheme()
    const { order, type, setType, state, setState, disabled, admin } = props

    const [ stateColor, setStateColor ] = useState(states(order.state).color)
    const [ stateValues, setStateValues ] = useState([order.state].concat(Object.values(substates(order.state))))

    return (
        <View style={[ styles.row, styles.justifyBetween ]}>
            <View style={[ styles.column, styles.card, styles.marginTiny_B, {width: '49%'} ]} >
                <View style={[ styles.row, styles.paddingTiny, styles.alignCenter ]}>
                    <Icon name={'clipboard-outline'} library={'Ionicons'} color={colors.default} size={size.iconSmall} />
                    <PickerType
                        currentValue={ order.type ? (order.type).toLowerCase() : null }
                        styles={[ styles.bgTransparent, styles.borderNone, styles.flex, {marginTop: 0}]}
                        disabled={ disabled }
                        pickerStyle={[ {height: size.formMin} ]}
                        callback={ (value) => {
                            order.type = (value ? value : '')
                            setType(value)
                        } } />
                </View>
            </View>
            <View style={[ styles.column, styles.card, styles.marginTiny_B, {width: '49%'} ]} >
                <View style={[ styles.row, styles.paddingTiny, styles.alignCenter ]}>
                    <Icon name={'alarm-light-outline'} library={''} color={stateColor} size={size.iconSmall} />
                        <PickerState
                            values={ admin ? null : stateValues }
                            currentValue={ order.state ? (order.state).toLowerCase() : null }
                            styles={[ styles.bgTransparent, styles.borderNone, styles.flex, {marginTop: 0}]}
                            disabled={ disabled }
                            color={stateColor}
                            pickerStyle={[ {height: size.formMin } ]}
                            callback={ (value) => {
                                order.state = (value ? value : '')
                                setStateColor(states(value).color)
                                setState(state)
                            } } />
                </View>
            </View>
        </View>
    )
}



export default OrderType

