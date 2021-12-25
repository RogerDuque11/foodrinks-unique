import { Platform, ToastAndroid } from 'react-native'
import DateFormat from "./DateFormats"

class Functions  {
    constructor(){
        this.DateFormat = DateFormat
    }
    
    removeChart = (value, chart) => {
        const result = value.replace(chart, '')
        return result
    }

    removeSpaces = (value) => {
        return value.replace(/\ /g, '')
    }

    
    getUidFromEmail = (email) => {
        const uid = email.replace(/\./g, '_')
        return uid.toUpperCase()
    }

    numberFormatMoneyStandar = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g; //miRegEx
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp, rep);
        let result = arr[1] ? arr.join('.'): arr[0];
        return result
    }

    numberFormatMoney = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g; //miRegEx
        const rep = '$1.';
        let result = number.toString().replace(exp, rep)
        return result
    }
    
};

var functions = new Functions()
export default functions



