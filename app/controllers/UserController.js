import Firebase from '../../services/Firebase'
import FirebaseController from './FirebaseController'

import References from '../navigation/Refs'
import Constants from '../constants/Constants'
const functions = Constants.FUNCTIONS

import User from '../models/User'


class UserController {

    createUser = async (user) => {
        //await FirebaseController.FS_Create('USERS', user.uid, user)
        Firebase.firestore.collection('USERS').doc(user.uid).set(JSON.parse(JSON.stringify(user)))
    }

    logInEmailAndPassword = async (user, LOG_IN) => {
        Firebase.auth.signInWithEmailAndPassword(user.email, user.password)
        .then(async function(credential){
            if(credential.user){
                var uid = credential.user.uid
                var profile = await getUserProfile(uid)
                Constants.NOTIFY('SUCCESS', 'LOGIN', '', user.email)    
                LOG_IN(profile)
            }
            return credential
        })
        .catch(async function(error) {
            if(error.code === 'auth/user-not-found') {
                return await registerUser(user, LOG_IN)
            } 
            /* else if(error.code === 'auth/too-many-requests'){ }  */
            else {
                Constants.NOTIFY('ERROR', error.code, 'UserController/logInEmailAndPassword', error.message)
                return null
            }
        })  
    }

    readUsers = async () => {
        let data = await FirebaseController.FS_ReadBy('USERS', 'enable', '==', true)
        return data
    }

    readUsersBy = async (parameter, value) => {
        let data = await FirebaseController.FS_ReadBy('USERS', parameter, '==', value)
        return data
    }

    updateUser = (user) => {
        return FirebaseController.FS_Update('USERS', user.code, user)
    }

    removeUser = (code) => {
        return FirebaseController.FS_Delete('USERS', 'enable', '==', true)
    }

    restorePassword = async (email) => {
        Firebase.auth.sendPasswordResetEmail(email).then(function() {
            Constants.NOTIFY('SUCCESS', 'messageSent', 'UserController/restorePassword', email)
        }).catch(function(error) {
            Constants.NOTIFY('ERROR', error.code, 'UserController/restorePassword', error.message)
        });
    }

    
    create = async (user, LOG_IN) => {
        Firebase.auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(async function(userRecord) {
            if(userRecord){
                const us = await Firebase.auth.currentUser
            }
        })
        .catch(function(error) {
            Constants.NOTIFY('WARNNING', error.code, 'UserController/registerUser', error.message)
            return null
        });
    }
    
}

const getUserProfile = async (uid) => {
    var userauth = await Firebase.firestore.doc('USERS/' + uid).get().then((snapshot)=>{ return snapshot.data() }) 
    var userRef = getUserRef(userauth)
    var profile = await userRef.get().then((snapshot)=>{ return snapshot.data() }) 
    try {
        return profile
    } catch (error) {
        Constants.NOTIFY('ERROR', error.code, 'UserController/getUserProfile', error.message)
    }
}

const getUserRef = (user) => {
    var usertype = user.usertype
    var ref = usertype === 'PARTNER' ? Firebase.firestore.doc('PARTNER/' + 'CURRENT')
    : usertype === 'EMPLOYEE' ? Firebase.firestore.doc('COMPANY/'+ user.companyCode+'/EMPLOYEES/' + user.uid)
    : usertype === 'ROOT' ? Firebase.firestore.doc('USERS/' + user.uid)
    : null
    return ref
} 

const getRef = (user) => {
    var usertype = user.usertype
    var ref = usertype === 'PARTNER' ? 'PARTNER/'
    : usertype === 'EMPLOYEE' ? 'EMPLOYEES/'
    : usertype === 'ROOT' ? 'USERS/'
    : null
    return ref
} 

const updateCurrentUser = async (user) => {
    if(user.uid){ await Firebase.auth.currentUser.updateProfile(user) }
}
    

const registerUser = async (user, LOG_IN) => {
    var usernew = await FirebaseController.FS_ReadUnique('USERS', 'email', '==', user.email.toLowerCase(), 'ORIGIN')
    if(usernew != null && usernew.uid){if(usernew.password != user.password){
        Constants.NOTIFY('WARNNING', 'auth/wrong-password', 'UserController/registerUser', '')
    }else{
        Firebase.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then(async function(userRecord) {
            if(userRecord.user.uid){

                var uidTemp = usernew.uid

                usernew.uid = userRecord.user.uid
                usernew.state = 'ACTIVE'
                await FirebaseController.FS_Create('USERS', usernew.uid, new User().userFromObject(usernew), 'ORIGIN' )
                await FirebaseController.FS_Delete('USERS', uidTemp, 'ORIGIN')

                var ref = getRef(usernew)
                var uid = usernew.usertype === 'PARTNER' ? 'CURRENT' : usernew.uid
                //var ref = refs(usernew.usertype)
                delete usernew['password']
                delete usernew['disabled']
                await FirebaseController.FS_Create(ref, uid, usernew, 'ORIGIN')

                //var profile = await getUserProfile(usernew.uid)
                Constants.NOTIFY('SUCCESS', 'auth/user-created', 'UserController/registerUser', usernew.email)
                LOG_IN(usernew)
            } return userRecord
        })
        .catch(function(error) {
            Constants.NOTIFY('WARNNING', error.code, 'UserController/registerUser', error.message)
            return null
        });
    }
    }else{
        Constants.NOTIFY('ERROR', 'auth/user-not-found', 'UserController/registerUser', '')
    }
}
    


var Controller = new UserController
export default Controller