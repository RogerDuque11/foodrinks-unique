import Colors from "./Colors";

const LIGHT_THEME = { dark: false, colors: { ...Colors.LIGHT } };
const DARK_THEME = { dark: true, colors: { ...Colors.DARK } };
const DEFAULT_THEME = { dark: true, colors: { ...Colors.DEFAULT } };

const THEME = {
    DARK: DARK_THEME, LIGHT: LIGHT_THEME, DEFAULT: DEFAULT_THEME
}

export default THEME
