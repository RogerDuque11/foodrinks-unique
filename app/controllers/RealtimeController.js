import Firebase from '../../services/Firebase';
import Constants from '../constants/Constants'

var consol = Constants.CONSOLE

const verifyRef = (ORIGIN) => {
    const { PROFILE, COMPANY } = Constants.SESION
    var REF_RT = Firebase.database.ref('COMPANY')
    var CHILD = COMPANY ? COMPANY.CODE : ''
    var REF = ORIGIN || !CHILD  ? '' : REF_RT.child(CHILD+'')
    return REF
}

class RealtimeController {

    createData = async ({ref, id, data, ORIGIN}) => {
        return verifyRef(ORIGIN).child(ref).child(id).set(data)
    }

    readDataUnique = async ({ref, parameter, condition, value, ORIGIN}) => {
        var data = []
        verifyRef(ORIGIN).child(ref)
        .orderByChild(parameter)
        .equalTo(value)
        .on("value", function(snapshot) {
            snapshot.forEach(child =>{ data.push(child.val()) })
        })
        return data.length > 0 ? data[0] : null
    }

    readDataOn = async ({ref, ORIGIN}) => {
        var data = [] 
        verifyRef(ORIGIN).child(ref)
        .on('value', function(snapshot) {
            snapshot.forEach(child =>{ data.push(child.val()) })
        })
        return data
    }

    readDataBy = async ({ref, parameter, condition, value, ORIGIN}) => {
        var data = []
        verifyRef(ORIGIN).child(ref)
        .orderByChild(parameter)
        .equalTo(value)
        .on("value", function(snapshot) {
            snapshot.forEach(child =>{ data.push(child.val()) })
        })
        return data
    }

    updateData = async ({ref, id, ORIGIN}) => {
        return verifyRef(ORIGIN).child(ref).child(id).update(data);
    }

    deleteData = async ({ref, id, ORIGIN}) => {
        return verifyRef(ORIGIN).child(ref).child(id).remove()
    }

}

var Controller = new RealtimeController
export default Controller
