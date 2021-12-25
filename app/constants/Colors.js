const colorPrimary = '#6b0000';
const colorAccent = '#e68c4c';
const colorDefault = '#b9bac8';
const opacityLight = 'rgba(255, 255, 255, .85)';
const opacityDark = 'rgba(0, 0, 0, .85)';

const PRIMARY_COLORS = {
    primary: colorPrimary,
    accent: colorAccent,
    opacityLight: opacityLight,
    opacityDark: opacityDark,
    surface: '#b30003',
    disabled: colorDefault,
    placeholder: colorDefault,
    backdrop: colorDefault,
    transparent: 'transparent',
    tintColor: colorDefault,
    //tabIconDefault: colorText,
    tabIconSelected: colorPrimary,
    tabBar: '#fff',
    success: '#01937C',
    error: '#943126',
    errorBackground: '#b30003',
    errorText: '#570003',
    warning: '#FDCA40',
    warningBackground: '#EAEB5E',
    warningText: '#666804',
    noticeBackground: colorPrimary,
    noticeText: '#fff',

    preparing: '#3C8DAD',
    terminated: '#01937C',
    deleted: '#943126',
    canceled: '#943126',
    finished: '#01937C',
};

const DARK_COLORS = {
    ...PRIMARY_COLORS,
    background: '#000000',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#181818',
    notification: '#1F1F1F',
    input: '#090909',
    table: '#111111',
    default: '#444444',
    opacity: opacityDark
}

const LIGHT_COLORS = {
    ...PRIMARY_COLORS,
    background: '#F2F2F2',
    card: '#FCFCFC',
    text: '#1E1E1E',
    border: '#DEDEDE',
    notification: '#FFFFFF',
    input: '#F8F8F8',
    table: '#EDEDED',
    default: '#999999',
    opacity: opacityLight
}

const DEFAULT_COLORS = {
    ...PRIMARY_COLORS,
    background: '#290606', //370000 //250303
    card: '#391e1e',
    text: '#E1E1E1',
    border: '#6f3e3e', //334759
    notification: '#17202A',
    input: '#E6B0AA',
    table: '#392626',
    default: '#5a4242',
    opacity: opacityDark
}

const COLORS = {
    DARK: DARK_COLORS, LIGHT: LIGHT_COLORS, DEFAULT: DEFAULT_COLORS
}

export default COLORS



