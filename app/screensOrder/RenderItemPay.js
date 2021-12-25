import React, {  } from 'react';
import { View, Text } from 'react-native' 
import { ListItem } from 'react-native-elements'

import CurrentScheme from "../constants/CurrentScheme"
import Constants from "../constants/Constants"
import Icon from '../components/Icon'

var _F = Constants.FUNCTIONS

export default function CustomRenderItemOrder ({ props }) {
    return (
        <RenderItemPay props={{...props}} />
    )
}

const RenderItemPay = ({ props }) => {
    const { styles, colors, size, trans } = CurrentScheme()
    const { label, data, left } = props
    const [ expanded, setExpanded ] = React.useState(true) 
    const stylesExpanded = expanded ? [styles.radiusTiny_T] : [styles.radiusTiny, styles.marginSmall_B]

    return (
        <ListItem.Accordion  
            containerStyle={[ styles.bgCard, styles.border, styles.paddingTiny, stylesExpanded ]}
            underlayColor={colors.transparent}
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded) }
            content={
                <ListItem.Content style={[ styles.column, styles.flex ]}>
                    <View style={[ styles.row, styles.alignCenter ]}>
                        <Icon name={'cash'} library={''} color={colors.default} size={size.iconSmall} />
                        <Text style={[ styles.flex, styles.colorDefault, styles.uppercase, styles.textBold, styles.paddingTiny_L ]}>{label ? trans(label) : ''}</Text>
                    </View>
                </ListItem.Content> }>
                <ListItem 
                    containerStyle={[ styles.bgCard, styles.column, styles.paddingNone, styles.border, styles.radiusTiny_B, expanded ? styles.marginSmall_B: null, {borderTopWidth: 0, height: expanded ? 'auto': 0} ]}>
                    <ListItem.Content style={[ styles.row, styles.flex ]}>
                            <View style={[ styles.column, styles.flex ]}>
                            {  
                                Object.entries(data).map(([key, data])=>(
                                    <View key={key} style={[ styles.row, styles.paddingTiny_Y, styles.borderBottom, styles.marginSmall_X, styles.justifyBetween ]} >
                                        { left ? <Text style={[ styles.colorText, styles.marginSmall_R ]}>{trans(data.quantity)}</Text> : null }
                                        <Text style={[ styles.colorText, styles.flex ]}>{trans(key) + ': '}</Text>
                                        <Text style={[ styles.colorText ]}>$ {_F.numberFormatMoney(data.value)}</Text>
                                    </View>
                                )) 
                            }
                            </View>
                    </ListItem.Content>
                </ListItem>
        </ListItem.Accordion >
    )
}
