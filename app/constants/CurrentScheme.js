import React from "react";
import { StyleSheet, Platform } from 'react-native'
//import { useColorScheme } from 'react-native-appearance' //web
import { useColorScheme } from 'react-native'   // movil

import Themes from './Themes'
import Size from './Size'
import Consol from './Console'
import Window from './WindowSize'
import Translate from '../../services/Translate'
import OrderStates from '../../services/OrderStates'

const fontFamily = 'Roboto'

export default function CurrentScheme() {
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Themes.DARK : Themes.LIGHT
  const colors = theme.colors
  const size = (Size)
  const window = Window()
  const isWeb = Platform.OS === 'web' ? true : false
  const isWebDesk = isWeb && window.width > size.maxWidthPhone ? true : false
  const { trans } = Translate('ES')
  const { states, substates } = OrderStates(colors)
  
  let styles = StyleSheet.create({
        // INIT LAYOUTS
        flexRow: { flex: 1, flexDirection: 'row' },
        flexColumn: { flex: 1, flexDirection: 'column' },
        flex: { flex: 1 },
        wrap: { flexWrap: 'wrap' },
        grow: { flexGrow: 1 },
        basis: { flexBasis:  50},
        shrink: { flexShrink:  1},
        grid: { flex: 1, margin: size.marginMin },
        row: { flexDirection: 'row' },
        column: { flexDirection: 'column' },
        reverse: { flexDirection: 'row-reverse' },
        justifyBetween: { justifyContent: 'space-between' },
        justifyEvenly: { justifyContent: 'space-evenly' },
        justifyAround: { justifyContent: 'space-around' },
        justifyCenter: { justifyContent: 'center' },
        justifyEnd: { justifyContent: 'flex-end' },
        alignEnd: { alignItems: 'flex-end' },
        alignCenter: { alignItems: 'center' },
        alignStretch: { alignContent: 'stretch' },
        alignAround: { alignContent: 'space-around' },
        
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        card: {
            justifyContent: 'flex-end',
            backgroundColor: colors.card,
            borderWidth: size.borderDefault, borderColor: colors.border,
            borderRadius: size.radiousSmall
        },
        modal: {
            flex: 1,
            flexDirection: 'column',
            paddingVertical: size.paddingLarge,
            paddingHorizontal: size.paddingSmall,
        },
        modalWeb: {
            position: 'absolute', 
            left: 0, right: 0, top: 0, bottom: 0,
        },
        dialog: {
            padding: size.paddingSmall,
            marginTop: size.marginLarge,
            borderRadius: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 10
        },
        // END LAYOUTS

        // INIT BORDERS
        borderNone: {borderWidth: 0, borderColor: colors.transparent},

        borderPrimary: { borderColor: colors.primary},
        borderDefault: { borderColor: colors.border},

        borderBottom: { borderBottomWidth: size.borderFine, borderColor: colors.border },
        borderTop: { borderTopWidth: size.borderFine, borderColor: colors.border },
        borderLeft: { borderLeftWidth: size.borderFine, borderColor: colors.border },
        borderRight: { borderRightWidth: size.borderFine, borderColor: colors.border },
        borderVertical: { borderTopWidth: size.borderFine, borderBottomWidth: size.borderFine, borderColor: colors.border, },
        borderHorizontal: { borderLeftWidth: size.borderFine, borderRightWidth: size.borderFine, borderColor: colors.border, },
        
        borderDashed: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: colors.border,  },
        
        border: { borderWidth: size.borderDefault, borderColor: colors.border },
        border_B: { borderBottomWidth: size.borderDefault, borderColor: colors.border },
        border_T: { borderTopWidth: size.borderDefault, borderColor: colors.border },
        border_L: { borderLeftWidth: size.borderDefault, borderColor: colors.border },
        border_R: { borderRightWidth: size.borderDefault, borderColor: colors.border },
        border_Y: { borderTopWidth: size.borderDefault, borderBottomWidth: size.borderDefault, borderColor: colors.border, },
        border_X: { borderLeftWidth: size.borderDefault, borderRightWidth: size.borderDefault, borderColor: colors.border, },

        borderFine: { borderWidth: size.borderFine, borderColor: colors.border },
        borderFine_B: { borderBottomWidth: size.borderFine, borderColor: colors.border },
        borderFine_T: { borderTopWidth: size.borderFine, borderColor: colors.border },
        borderFine_L: { borderLeftWidth: size.borderFine, borderColor: colors.border },
        borderFine_R: { borderRightWidth: size.borderFine, borderColor: colors.border },
        borderFine_Y: { borderTopWidth: size.borderFine, borderBottomWidth: size.borderFine, borderColor: colors.border, },
        borderFine_X: { borderLeftWidth: size.borderFine, borderRightWidth: size.borderFine, borderColor: colors.border, },
        // INIT BORDERS

        // INIT COLOR
        colorBackground: { color: colors.background },
        colorPrimary: { color: colors.primary },
        colorDefault: { color: colors.default },
        colorAccent: { color: colors.accent },
        colorText: { color: colors.text },
        colorCard: { color: colors.card },
        colorError: { color: colors.error },
        colorSucces: { color: colors.success },
        colorWarnning: { color: colors.warning },

        colorPreparing: { color: colors.preparing },
        // END COLOR

        // INIT BACKGROUNDS
        bgNone: { backgroundColor: colors.transparent },
        bgPrimary: { backgroundColor: colors.primary, color: scheme === 'dark' ? colors.text : colors.background },
        bgAccent: { backgroundColor: colors.accent },
        bgCard: { backgroundColor: colors.card },
        bgText: { backgroundColor: colors.text },
        bgTheme: { backgroundColor: colors.background },
        bgDefault: { backgroundColor: colors.default },
        bgError: { backgroundColor: colors.error },
        bgInput: { backgroundColor: colors.input },
        bgTable: { backgroundColor: colors.table },
        bgTransparent: { backgroundColor: colors.transparent },
        bgOpacity: { backgroundColor: colors.opacity },
        bgOpacityDark: { backgroundColor: colors.opacityDark },
        bgOpacityLight: { backgroundColor: colors.opacityLight },
        bgOpacityPrimary: { backgroundColor: colors.primary, opacity: 0.85 },
        bgOpacityTheme: { backgroundColor: colors.background, opacity: 0.85 },
        // END BACKGROUNDS

        // INIT TABLES
        tableHeader: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: size.paddingTiny,
            justifyContent: "space-evenly",
        },
        tableRow: {
            flexDirection: "row",
            alignItems:"center",
            paddingVertical: size.paddingTiny,
            borderWidth: size.borderFine, 
            borderColor: colors.border,
            borderTopWidth: 0
        },
        flatList: {
            paddingHorizontal: isWebDesk ? size.spacingSmall : size.paddingSmall,
            maxHeight: isWebDesk ? '75vh' : '100%',
        },
        flatOptions: {
            paddingHorizontal: isWebDesk ? size.spacingSmall : size.paddingSmall,
            flexDirection: isWebDesk ? 'row' : 'column',
            marginTop: isWeb ? size.marginSmall : 0,
            marginBottom: isWeb ? size.marginSmall: size.marginTiny,
        },
        // INIT TABLES

        // INIT TEXT
        uppercase: { textTransform: 'uppercase' },
        lowercase: { textTransform: 'lowercase' },
        textLine: { textDecorationLine: 'line-through' },
        textBold: { fontWeight: '700' },
        textLighter: { fontWeight: '200' },
        textRight: { textAlign: 'right' },
        textLeft: { textAlign: 'left' },
        textJustify: { textAlign: 'justify' },
        textCenter: { textAlign: 'center' },
        textMin: { fontFamily: fontFamily, fontSize: size.textMin, color: colors.text, letterSpacing: 1 },
        textLabel: { fontFamily: fontFamily, fontSize: size.textLabel, color: colors.text, letterSpacing: 1 },
        textTiny: { fontFamily: fontFamily, fontSize: size.textTiny, color: colors.text, letterSpacing: 1 },
        textSmall: { fontFamily: fontFamily, fontSize: size.textSmall, color: colors.text, letterSpacing: 1 },
        textMedium: { fontFamily: fontFamily, fontSize: size.textMedium, color: colors.text, letterSpacing: 1 },
        textTitle: { fontFamily: fontFamily, fontSize: size.textTitle, color: colors.text, letterSpacing: 1 },
        textLarge: { fontFamily: fontFamily, fontSize: size.textLarge, color: colors.text, letterSpacing: 1 },
        textTableHeader: { 
            fontSize: size.textSmall, 
            color: colors.text, 
            textTransform: 'uppercase', 
            paddingHorizontal: size.paddingTiny,
            fontFamily: fontFamily,
            letterSpacing: 1
        },
        textTableRow: { 
            fontSize: size.textTiny, 
            color: colors.text, 
            paddingHorizontal: size.paddingTiny,
            fontFamily: fontFamily, 
            letterSpacing: 1
        },
        textHeader: {
            fontSize: size.textTitle,
            color: colors.text,
            fontWeight: "normal",
            textTransform: 'uppercase',
            fontFamily: fontFamily,
            letterSpacing: 1,
        },
        textInfo: {
            fontSize: size.textSmall,
            color: colors.default,
            fontWeight: "normal",
            textTransform: 'uppercase',
            fontFamily: fontFamily,
            letterSpacing: 1,
            paddingTop: size.paddingSmall,
            //paddingBottom: size.paddingTiny
        },
        fontFamily: { fontFamily: fontFamily },
        // END TEXT

        // INIT IMAGE , ICONS
        imageContain: { resizeMode: 'contain' },
        imageCover: { resizeMode: 'cover' },
        imageTiny: { height: size.imageTiny, resizeMode: 'contain' },
        imageSmall: { height: size.imageSmall, resizeMode: 'contain' },
        imageMedium: { height: size.imageMedium, resizeMode: 'contain' },
        imageLarge: { height: size.imageLarge, resizeMode: 'contain' },
        imageScreen: { height: size.imageScreen, resizeMode: 'contain' },
        iconHeader: {
            padding: size.paddingTiny,
            marginHorizontal: size.marginTiny,
            color: colors.text
        },
        // END IMAGE, ICONS


        // INIT PADDING
        paddingNone: { padding: 0 },
        paddingMin: { padding: size.paddingMin },
        paddingMain_X: { paddingHorizontal: isWebDesk ? size.spacingSmall : size.paddingTiny, },

        paddingTiny: { padding: size.paddingTiny },
        paddingTiny_Y: { paddingVertical: size.paddingTiny },
        paddingTiny_X: { paddingHorizontal: size.paddingTiny },
        paddingTiny_T: { paddingTop: size.paddingTiny },
        paddingTiny_B: { paddingBottom: size.paddingTiny },
        paddingTiny_L: { paddingLeft: size.paddingTiny },
        paddingTiny_R: { paddingRight: size.paddingTiny },

        paddingSmall: { padding: size.paddingSmall },
        paddingSmall_Y: { paddingVertical: size.paddingSmall },
        paddingSmall_X: { paddingHorizontal: size.paddingSmall },
        paddingSmall_T: { paddingTop: size.paddingSmall },
        paddingSmall_B: { paddingBottom: size.paddingSmall },
        paddingSmall_L: { paddingLeft: size.paddingSmall },
        paddingSmall_R: { paddingRight: size.paddingSmall },

        paddingMedium: { padding: size.paddingMedium },
        paddingMedium_Y: { paddingVertical: size.paddingMedium },
        paddingMedium_X: { paddingHorizontal: size.paddingMedium },
        paddingMedium_T: { paddingTop: size.paddingMedium },
        paddingMedium_B: { paddingBottom: size.paddingMedium },
        paddingMedium_L: { paddingLeft: size.paddingMedium },
        paddingMedium_R: { paddingRight: size.paddingMedium },

        paddingLarge: { padding: size.paddingLarge },
        paddingLarge_Y: { paddingVertical: size.paddingLarge },
        paddingLarge_X: { paddingHorizontal: size.paddingLarge },
        paddingLarge_T: { paddingTop: size.paddingLarge },
        paddingLarge_B: { paddingBottom: size.paddingLarge },
        paddingLarge_L: { paddingLeft: size.paddingLarge },
        paddingLarge_R: { paddingRight: size.paddingLarge },
        // END PADDING

        // INIT MARGIN
        marginNone: { margin: 0 },
        marginMin: { margin: size.marginMin },
        marginMain_X: { marginHorizontal: isWebDesk ? size.spacingSmall : size.marginTiny, },

        marginTiny: { margin: size.marginTiny },
        marginTiny_Y: { marginVertical: size.marginTiny },
        marginTiny_X: { marginHorizontal: size.marginTiny },
        marginTiny_T: { marginTop: size.marginTiny },
        marginTiny_B: { marginBottom: size.marginTiny },
        marginTiny_L: { marginLeft: size.marginTiny },
        marginTiny_R: { marginRight: size.marginTiny },

        marginSmall: { margin: size.marginSmall },
        marginSmall_Y: { marginVertical: size.marginSmall },
        marginSmall_X: { marginHorizontal: size.marginSmall },
        marginSmall_T: { marginTop: size.marginSmall },
        marginSmall_B: { marginBottom: size.marginSmall },
        marginSmall_L: { marginLeft: size.marginSmall },
        marginSmall_R: { marginRight: size.marginSmall },

        marginMedium: { margin: size.marginMedium },
        marginMedium_Y: { marginVertical: size.marginMedium },
        marginMedium_X: { marginHorizontal: size.marginMedium },
        marginMedium_T: { marginTop: size.marginMedium },
        marginMedium_B: { marginBottom: size.marginMedium },
        marginMedium_L: { marginLeft: size.marginMedium },
        marginMedium_R: { marginRight: size.marginMedium },

        marginLarge: { margin: size.marginLarge },
        marginLarge_Y: { marginVertical: size.marginLarge },
        marginLarge_X: { marginHorizontal: size.marginLarge },
        marginLarge_T: { marginTop: size.marginLarge },
        marginLarge_B: { marginBottom: size.marginLarge },
        marginLarge_L: { marginLeft: size.marginLarge },
        marginLarge_R: { marginRight: size.marginLarge },
        // END MARGIN

        //INIT RADIUS
        radiusNone: { borderRadius: 0 },
        radiusNone_T: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
        radiusNone_B: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        radiusNone_L: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
        radiusNone_R: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },

        radiusLarge: { borderRadius: size.radiousLarge },
        radiusLarge_T: { borderTopLeftRadius: size.radiousLarge, borderTopRightRadius: size.radiousLarge },
        radiusLarge_B: { borderBottomLeftRadius: size.radiousLarge, borderBottomRightRadius: size.radiousLarge },
        radiusLarge_L: { borderTopLeftRadius: size.radiousLarge, borderBottomLeftRadius: size.radiousLarge },
        radiusLarge_R: { borderBottomRightRadius: size.radiousLarge, borderTopRightRadius: size.radiousLarge },
        
        radiusMedium: { borderRadius: size.radiousMedium },
        radiusMedium_T: { borderTopLeftRadius: size.radiousMedium, borderTopRightRadius: size.radiousMedium },
        radiusMedium_B: { borderBottomLeftRadius: size.radiousMedium, borderBottomRightRadius: size.radiousMedium },
        radiusMedium_L: { borderTopLeftRadius: size.radiousMedium, borderBottomLeftRadius: size.radiousMedium },
        radiusMedium_R: { borderBottomRightRadius: size.radiousMedium, borderTopRightRadius: size.radiousMedium },
        
        radiusSmall: { borderRadius: size.radiousSmall },
        radiusSmall_T: { borderTopLeftRadius: size.radiousSmall, borderTopRightRadius: size.radiousSmall },
        radiusSmall_B: { borderBottomLeftRadius: size.radiousSmall, borderBottomRightRadius: size.radiousSmall },
        radiusSmall_L: { borderTopLeftRadius: size.radiousSmall, borderBottomLeftRadius: size.radiousSmall },
        radiusSmall_R: { borderBottomRightRadius: size.radiousSmall, borderTopRightRadius: size.radiousSmall },
        
        radiusTiny: { borderRadius: size.radiousTiny },
        radiusTiny_T: { borderTopLeftRadius: size.radiousTiny, borderTopRightRadius: size.radiousTiny },
        radiusTiny_B: { borderBottomLeftRadius: size.radiousTiny, borderBottomRightRadius: size.radiousTiny },
        radiusTiny_L: { borderTopLeftRadius: size.radiousTiny, borderBottomLeftRadius: size.radiousTiny },
        radiusTiny_R: { borderBottomRightRadius: size.radiousTiny, borderTopRightRadius: size.radiousTiny },
        
        radiusMin: { borderRadius: size.radiousMin },
        radiusMin_T: { borderTopLeftRadius: size.radiousMin, borderTopRightRadius: size.radiousMin },
        radiusMin_B: { borderBottomLeftRadius: size.radiousMin, borderBottomRightRadius: size.radiousMin },
        radiusMin_L: { borderTopLeftRadius: size.radiousMin, borderBottomLeftRadius: size.radiousMin },
        radiusMin_R: { borderBottomRightRadius: size.radiousMin, borderTopRightRadius: size.radiousMin },
        //END RADIUS

        // INIT INPUTS
        inputMin: { height: size.formMin, fontSize: size.textTiny },
        inputTiny: { height: size.formTiny, fontSize: size.textTiny },
        inputSmall: { height: size.formSmall, fontSize: size.textSmall },
        inputMedium: { height: size.formMedium, fontSize: size.textMedium },
        inputLarge: { height: size.formLarge, fontSize: size.textLarge },
        // END INPUTS


        // INIT BUTTONS
        buttonTiny: { fontFamily: fontFamily, height: size.formTiny, fontSize: size.textTiny },
        buttonSmall: { fontFamily: fontFamily, height: size.formSmall, fontSize: size.textSmall },
        buttonMedium: { fontFamily: fontFamily, height: size.formMedium, fontSize: size.textMedium },
        buttonLarge: { fontFamily: fontFamily, height: size.formLarge, fontSize: size.textLarge },
        button: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingVertical: size.paddingTiny,
            paddingHorizontal: size.paddingTiny,
            borderWidth: size.borderFine,
            borderColor: colors.border,
            borderRadius: 3,
            fontFamily: fontFamily,
        },
        buttonCircle: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: size.paddingMin,
            borderWidth: size.borderDefault,
            borderColor: colors.border,
            borderRadius: 100
        },
        buttonFloating: {
            backgroundColor: colors.accent,
            borderWidth: 0,
            margin: size.marginTiny,
            padding: size.paddingTiny,
        },
        // END BUTTONS


        // INIT COMPONENTS
        header: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            height: size.headerSize,
            backgroundColor: colors.background,
            marginTop: isWeb ? 0 : size.statusBarSize,
        },
        headerBottomImage: {
            position: 'absolute',
            top: 424,
            zIndex: 2,
            backgroundColor: colors.opacity
        },
        headerStyle: {
            backgroundColor: colors.lightbackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        },
        headerTitleStyle: {
            fontWeight: "normal",
            fontSize: 20,
            //color: Colors.text,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: fontFamily,
        },
    /* tabIconDefault: colors.lightText,
    tabIconSelected: colors.primary,
    headerTitleAlign: "center",
    headerTintColor: colors.lightText, */
        // END COMPONENTS


        // INIT POSITIONS
        absolute: { position: 'absolute' },  
        fixedBottom: {
            position: 'absolute', 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 1
        },
        fixedTop: {
            position: 'absolute', 
            left: 0, 
            right: 0, 
            top: size.statusBarSize,
            zIndex: 1
        },
        // END POSITIONS


        // INIT CUSTOM COMPONENTS
        counter: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: size.borderFine, 
            borderColor: colors.border,
        },

        viewSpecs: {
            paddingVertical: size.paddingTiny,
            textTransform: 'uppercase',
            /* backgroundColor: colors.translucent,
            marginRight: size.marginMin,
            marginBottom: size.marginMin,
            borderWidth: size.borderFine,
            borderColor: colors.border, */
        },
        // END CUSTOM COMPONENTS

        shadow: {
            shadowColor: 'black',
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 0,
        },
        shadowMin: { elevation: size.spacingMin },
        shadowTiny: { elevation: size.spacingTiny },
        shadowSmall: { elevation: size.spacingSmall },
        shadowMedium: { elevation: size.spacingMedium },
        shadowLarge: { elevation: size.spacingLarge },


        widthForm: {
            width: isWebDesk ? '40%' : '100%'
        },
        widthFull: {
            width: size.fullWidth
        },

    })

    return { 
        styles, colors, size, theme, scheme, trans, window, isWeb, isWebDesk, Consol, states, substates
    }
}