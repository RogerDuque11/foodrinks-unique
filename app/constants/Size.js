import React from "react";
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const maxWidthPhone = 768
const minWidthWeb = 900
//const isWeb = Platform.OS === 'web' ? true : false
//const isWebDesk = isWeb && width > maxWidthPhone ? true : false

export default {

    fullHeight: height,
    fullWidth: width,
    maxWidthPhone: maxWidthPhone,
    minWidthWeb: minWidthWeb,

    quantityImagesShop: 4,
    quantityImagesServices: 4,

    statusBarSize: 32,
    headerSize: 56,
    statusHeaderSize: 80,

    textMin: 10,
    textTiny: 12,
    textLabel: 13,
    textSmall: 14,
    textMedium: 16,
    textLarge: 22,
    textTitle: 20,

    formMin: 24,
    formTiny: 32,
    formSmall: 36,
    formMedium: 44,
    formLarge: 56,

    marginMin: 2,
    marginTiny: 8,
    marginSmall: 16,
    marginMedium: 24,
    marginLarge: 48,

    paddingMin: 2,
    paddingTiny: 8,
    paddingSmall: 16,
    paddingMedium: 24,
    paddingLarge: 48,

    spacingMin: 2,
    spacingTiny: 8,
    spacingSmall: 16,
    spacingMedium: 24,
    spacingLarge: 48,

    borderFine: 0.5,
    borderDefault: 1,
    radiousMin: 2,
    radiousTiny: 3,
    radiousSmall: 6,
    radiousMedium: 12,
    radiousLarge: 24,

    iconText: 12,
    iconMin: 18,
    iconTiny: 22,
    iconSmall: 24,
    iconMedium: 32,
    iconLarge: 44,
    iconLargeX: 64,

    imageMin: 48,
    imageTiny: 64,
    imageSmall: 96,
    imageMedium: 150,
    imageLarge: 256,
    imageScreen: 400,

    aspectAvatar: [4, 4],
    aspectBanner: [6, 4],
    aspectPost: [5, 6],
    //imageScreen: 480,

};
