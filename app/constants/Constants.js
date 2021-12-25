import Console from './Console'
import WindowSize from "./WindowSize";
import Functions from "./Functions";
import Validate from "./Validate";
import Translate from '../../services/Translate'
import { Platform, ToastAndroid } from 'react-native'
import Sesion from '../models/Sesion'
import CurrentData from '../models/CurrentData'

class Constants  {
    FUNCTIONS = Functions
    VALIDATE = Validate
    CONSOLE = Console
    TRANSLATE = Translate('ES').trans
    ISWEB = Platform.OS === 'web' ? true : false
    WINDOW = WindowSize
    USER = {}
    COMPANY = {}
    SESION = new Sesion()
    CURRENT = new CurrentData()

    NOTIFY = (type, code, route, message) =>{
        var color = this.CONSOLE.Reset
        var transCode = this.TRANSLATE(code) ? this.TRANSLATE(code) : code
        var routeFunc = route ? route+':' : ''
        switch (type) {
            case 'ERROR': { color = this.CONSOLE.FgRed; break }
            case 'SUCCESS': { color = this.CONSOLE.FgGreen; break }
            case 'WARNING': { color = this.CONSOLE.FgYellow; break }
            default: { color = this.CONSOLE.Reset; break }
        }
        console.log(color, type+' =>', code+'\n', routeFunc, message, this.CONSOLE.Reset)

        if(code && route.trim() !== ''){
            if (Platform.OS === 'web') {
                alert(transCode)
            } else if (Platform.OS === 'android'){
                ToastAndroid.showWithGravityAndOffset( transCode, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50 );
            }
        }
    }
    
};

var constants = new Constants
export default constants



