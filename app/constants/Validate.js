import React from 'react';
import { Platform, ToastAndroid } from 'react-native';

class Validate  {
    constructor(){ }



    isString = (value) => { return typeof value === 'string' ? true : false }
    isNumber = (value) => { return typeof parseInt(value) === 'number' ? true : false }
    isFunction= (value) => { return typeof value === 'function' ? true : false }
    isObject = (value) => { return typeof value === 'object' ? true : false }
    isBoolean = (value) => { return typeof value === 'boolean' ? true : false }
    isNull = (value) => { return value === null ? true : false }

    verifyString = (value) => {
        var result = value && value !== '' && value.trim() !== '' && this.isString(value) ? true : false
        return result
    }

    verifyHigherEqual = (value1, value2) => {
        var result = value1 !== '' && value2 !== '' && this.isNumber(value1) && this.isNumber(value2) && value1 >= value2 ? true : false
        return result
    }

    verifyEval = (fun) => {
        var result = eval(fun)
    }




    /* isLower = (value1, value2) => {
        if(value1 && value2){
            return this.isNumber(value1) && this.isNumber(value2) ? value1 < value2 ? true : false : false
        }
    }
    isHigher = (value1, value2) => {
        if(value1 && value2){
            return this.isNumber(value1) && this.isNumber(value2) ? value1 > value2 ? true : false : false
        }
    }
    isLowerEqual = (value1, value2) => {
        if(value1 && value2){
            return this.isNumber(value1) && this.isNumber(value2) ? value1 <= value2 ? true : false : false
        }
    }

    isEmptyString = (value) => {
        return value === '' ? true : false
    } */

    showMessage(){
        if (Platform.OS === 'web') {
            alert(messagge)
        } else if (Platform.OS === 'android'){
            ToastAndroid.showWithGravityAndOffset(
            messagge,
            ToastAndroid.LONG, //can be SHORT, LONG
            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
            25, //xOffset
            50 //yOffset
          );
        }
    }
    
};

export default new Validate()



