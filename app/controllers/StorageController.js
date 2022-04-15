import Firebase from '../../services/Firebase';
import Constants from '../constants/Constants'

const verifyRef = (ORIGIN) => {
    const { PROFILE, COMPANY } = Constants.SESION
    var REF_ST = 'COMPANY/'
    var CHILD = COMPANY ? COMPANY.code: ''
    //var CHILD = PROFILE.usertype === 'PARTNER' ? PROFILE.uid : ''
    var REF = ORIGIN || !CHILD  ? Firebase.storage.ref() : Firebase.storage.ref(REF_ST+CHILD)
    return REF
}

class StorageController {

    
    uploadData = async ({ref, data, ORIGIN}) => {
        var response = await fetch(data);
        var blob = await response.blob();
        await verifyRef(ORIGIN).child(ref).put(blob)
        var url = await verifyRef(ORIGIN).child(ref).getDownloadURL()
        /* .then(function(docRef) {
            Constants.NOTIFY('SUCCESS', 'elementUpload', ref, '')
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'StorageController/uploadStorage', error.message)
        }) */
        return url
    }

    downloadStorageUrl = async ({ref, ORIGIN}) => {
        /* var url = await this.storage.ref().child(ref).getDownloadURL()
        console.log(consol.FgGreen, 'Success download Storage', consol.Reset)
        return url */
    }

    createData = async ({ref, data, ORIGIN}) => {
        verifyRef(ORIGIN).collection(ref).doc()
        .set(JSON.parse(JSON.stringify(data)))
        .then(function(docRef) {
            Constants.NOTIFY('SUCCESS', 'elementCreated', ref, id)
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/createData', error.message)
        }); 
    }

    readDataOn = async ({ref, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .get()
        .then(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataOn', error.message)
        });
        return data
    }

    readDataBy = async ({ref, parameter, condition, value, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .get()
        .then(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataBy', error.message)
        });
        return data
    }

    readDataByState = async ({ref, state, parameter, condition, value, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .get()
        .then(function(snapshot) {
            state == '' ?
            snapshot.forEach(doc =>{ data.push(doc.data()) }) :
            snapshot.forEach(doc =>{ if(doc.data().state == state){data.push(doc.data())} })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataByState', error.message)
        });
        return data
    }

    readDataByTwoQueries = async ({ref, parameter, condition, value, parameter2, condition2, value2, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .where(parameter2, condition2, value2)
        .get()
        .then(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataByTwoQueries', error.message)
        });
        return data
    }

    updateData = async ({ref, id, data, ORIGIN}) => {
        return verifyRef(ORIGIN).collection(ref).doc(id)
        .set(JSON.parse(JSON.stringify(data)))
        .then(function(docRef) {
            Constants.NOTIFY('SUCCESS', 'elementEdited', ref, id)
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/updateData', error.message)
        }); 
    }

    deleteData = async ({ref, id, ORIGIN}) => {
        
        var REF =  verifyRef(ORIGIN).child(id)
        deleteObject(REF)
        .then(function() {
            Constants.NOTIFY('SUCCESS', 'elementDeleted', ref, id)
        }).catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/deleteData', error.message)
        });
    }
}

var Controller = new StorageController
export default Controller
