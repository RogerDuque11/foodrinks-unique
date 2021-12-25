import Firebase from '../../services/Firebase';
import Constants from '../constants/Constants'
//import AsyncStorage from '@react-native-async-storage/async-storage';

var consol = Constants.CONSOLE
var CHILD = Constants.SESION.PROFILE.company
var REF = ''


class MainController {

    constructor(){
        REF = CHILD ? 'COMPANIES/' + CHILD : ''
    }

    createData = async (ref, data) => {
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        return Firebase.database.ref(REF).set(data)
    }

    readDataOn = async (ref) => {
        var data = [] 
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        Firebase.database.ref(REF).on('value', function(snapshot) {
            snapshot.forEach(child =>{ data.push(child.val()) })
        })
        return data
    }

    readDataBy = async (ref, parameter, value) => {
        var data = []
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        Firebase.database.ref(REF).orderByChild(parameter).equalTo(value).on("value", function(snapshot) {
            snapshot.forEach(child =>{ data.push(child.val()) })
        })
        return data
    }

    readDataOnly = async (ref) => {
        //var REF = 'companys/18112020184432' + ref
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        return (await Firebase.database.ref(REF).once('value')).val()
    }

    updateData = async (ref, data) => {
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        return Firebase.database.ref(REF).update(data);
    }

    deleteData = async (ref) => {
        //var REF = 'companys/18112020184432' + ref
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        return Firebase.database.ref(REF).remove()
    }

    // INIT STORGAE METHODS
    uploadStorage = async (ref, data) => {
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        await Firebase.storage.ref(REF).put(data)
        var url = await Firebase.storage.ref().child(REF+ref).getDownloadURL()
        console.log(consol.FgGreen, 'Success upload Storage', consol.Reset)
        return url
    }

    downloadStorageUrl = async (ref) => {
        var REF = 'COMPANIES/' + Constants.SESION.PROFILE.company + ref
        var url = await Firebase.storage.ref().child(REF).getDownloadURL()
        console.log(consol.FgGreen, 'Success download Storage', consol.Reset)
        return url
    }

    readUserStorage = (user, ref) => {
        /* return this.storage.ref(ref). */
    }
    // END STORGAE METHODS
}

var Controller = new MainController()
export default Controller
