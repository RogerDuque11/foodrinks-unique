import Firebase from '../../services/Firebase';
import Constants from '../constants/Constants'

const verifyRef = (ORIGIN) => {
    const { PROFILE, COMPANY, LOCAL } = Constants.SESION
    var REF_ORIGIN = ORIGIN && ORIGIN !== 'ORIGIN' ? Firebase.firestore.collection(ORIGIN.REF) : null
    var REF_FS = REF_ORIGIN ? REF_ORIGIN : Firebase.firestore
    var CHILD = REF_ORIGIN && ORIGIN.CHILD ? ORIGIN.CHILD : ''
    /* var CHILD = PROFILE.usertype === 'PARTNER' ? PROFILE.uid 
                : PROFILE.usertype === 'EMPLOYEE' ? PROFILE.partnerUid 
                : '' */
    var REF = (ORIGIN && !REF_ORIGIN) || !CHILD  ? Firebase.firestore : REF_FS.doc(CHILD+'')
    return REF
}

class FirestoreController {

    createData = async ({ref, id, data, ORIGIN}) => {
        verifyRef(ORIGIN).collection(ref).doc(id)
        .set(JSON.parse(JSON.stringify(data)))
        .then(function(docRef) {
            Constants.NOTIFY('SUCCESS', 'elementCreated', ref, id)
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/createData', error.message)
        }); 
    }

    readDataUnique = async ({ref, parameter, condition, value, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .get()
        .then(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataUnique', error.message)
        });
        return data.length > 0 ? data[0] : null
    }

    readData = ({REFS, QUERIES, ORDER, LIMIT}) => {
        var data = []
        var db = Firebase.firestore
            !REFS || Object.keys(REFS).length <= 0 ? null
            : Object.entries(REFS).map(([key, child]) => {
                db = key ? db.collection(key) : db
                db = child ? db.doc(child) : db
            })
            !QUERIES || Object.keys(QUERIES).length <= 0 ? null
            : Object.entries(QUERIES).map(([key, query]) => {
                db = query ? db.where(query[0], query[1], query[2]) : db
            })
            !ORDER || Object.keys(ORDER).length <= 0 ? null
            : Object.entries(ORDER).map(([key, order]) => {
                db = key ? db.orderBy(key, order ? order : 'asc') : db
            })
            //LIMIT ? db.limit(LIMIT) : null
        /* return db.onSnapshot( snapshot => {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        }) */
        return db
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

    readDataOnBy = async ({ref, parameter, condition, value, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .onSnapshot(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        /* .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataBy', error.message)
        }); */
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

    readDataByThreeQueries = async ({ref, parameter, condition, value, parameter2, condition2, value2, parameter3, condition3, value3, ORIGIN}) => {
        var data = [] 
        await verifyRef(ORIGIN).collection(ref)
        .where(parameter, condition, value)
        .where(parameter2, condition2, value2)
        .where(parameter3, condition3, value3)
        .get()
        .then(function(snapshot) {
            snapshot.forEach(doc =>{ data.push(doc.data()) })
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/readDataByThreeQueries', error.message)
        });
        return data
    }

    updateData = /* async */ ({ref, id, data, ORIGIN}) => {
        return verifyRef(ORIGIN).collection(ref).doc(id)
        .update(JSON.parse(JSON.stringify(data)))
        .then(function(docRef) {
            Constants.NOTIFY('SUCCESS', 'elementEdited', ref, id)
        })
        .catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/updateData', error.message)
        }); 
    }

    deleteData = async ({ref, id, ORIGIN}) => {
        return verifyRef(ORIGIN).collection(ref).doc(id)
        .delete()
        .then(function() {
            Constants.NOTIFY('SUCCESS', 'elementDeleted', ref, id)
        }).catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'FirestoreController/deleteData', error.message)
        });
    }
}

var Controller = new FirestoreController
export default Controller
