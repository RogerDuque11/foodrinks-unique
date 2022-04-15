import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

const config = {    
    /* apiKey: "AIzaSyDhLJP88zJHB-tcYBQKiObjVQnGUO7Xgfg",
    authDomain: "aquijue-orders.firebaseapp.com",
    databaseURL: "https://aquijue-orders-default-rtdb.firebaseio.com",
    projectId: "aquijue-orders",
    storageBucket: "aquijue-orders.appspot.com",
    messagingSenderId: "728282018449",
    appId: "1:728282018449:web:2f4c3521656dd8197dc530" */

    /* apiKey: "AIzaSyAf9qHjlCr-JWk65cfG79O9JK02TvCKiXE",
    authDomain: "foodrink-s.firebaseapp.com",
    databaseURL: "https://foodrink-s.firebaseio.com",
    projectId: "foodrink-s",
    storageBucket: "foodrink-s.appspot.com",
    messagingSenderId: "561450605869",
    appId: "1:561450605869:web:50f25aa9bb063efa5187a4" */

    apiKey: "AIzaSyAkgJCZQi80Sp_yp57-if5kEDeDA6CoBr4",
    authDomain: "aqui-jue.firebaseapp.com",
    databaseURL: "https://aqui-jue-default-rtdb.firebaseio.com/",
    projectId: "aqui-jue",
    storageBucket: "aqui-jue.appspot.com",
    messagingSenderId: "10901472531",
    appId: "1:10901472531:web:f47a36a0912990e30b06e6"
}

class Firebase {

    constructor(){
        firebase.initializeApp(config)
        this.auth = firebase.auth()
        this.database = firebase.database()
        this.firestore = firebase.firestore()
        this.functions = firebase.functions()
        this.storage = firebase.storage()
    }
}


export default firebase.apps.length ? Firebase.app : new Firebase()