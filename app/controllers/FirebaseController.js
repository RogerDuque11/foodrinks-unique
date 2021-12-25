import RealtimeController from './RealtimeController'
import FirestoreController from './FirestoreController'
import StorageController from './StorageController'


class FirebaseController {

    RT_Create = async (ref, id, data, ORIGIN) => {
        return (await RealtimeController.createData({ref, id, data, ORIGIN}))
    }

    RT_Read = async (ref, ORIGIN) => {
        return (await FirestoreController.readDataOn({ref, ORIGIN}))
    }

    RT_ReadUnique = async (ref, parameter, condition, value, ORIGIN) => {
        return (await RealtimeController.readDataUnique({ref, parameter, condition, value, ORIGIN}))
    }

    RT_ReadBy = async (ref, parameter, condition, value, ORIGIN) => {
        return (await RealtimeController.readDataBy({ref, parameter, condition, value, ORIGIN}))
    }

    RT_Update = (ref, id, data, ORIGIN) => {
        return RealtimeController.updateData({ref, id, data, ORIGIN})
    }

    RT_Delete = (ref, id, ORIGIN) => {
        return RealtimeController.deleteData({ref, id, ORIGIN})
    }



    // FIRESTORE FUNCTIONS
    FS_Create = async (ref, id, data, ORIGIN) => {
        return (await FirestoreController.createData({ref, id, data, ORIGIN}))
    }

    FS_Read = async (ref, ORIGIN) => {
        return (await FirestoreController.readDataOn({ref, ORIGIN}))
    }
    FS_Read2 = (props) => {
        return ( FirestoreController.readData(props) )
    }

    FS_ReadUnique = async (ref, parameter, condition, value, ORIGIN) => {
        return (await FirestoreController.readDataUnique({ref, parameter, condition, value, ORIGIN}))
    }

    FS_ReadBy = async (ref, parameter, condition, value, ORIGIN) => {
        return (await FirestoreController.readDataBy({ref, parameter, condition, value, ORIGIN}))
    }
    FS_ReadOnBy = async (ref, parameter, condition, value, ORIGIN) => {
        return (await FirestoreController.readDataOnBy({ref, parameter, condition, value, ORIGIN}))
    }

    FS_ReadByState = async (ref, state, parameter, condition, value, ORIGIN) => {
        return (await FirestoreController.readDataBy({ref, state, parameter, condition, value, ORIGIN}))
    }

    FS_ReadByTwo = async (ref, parameter, condition, value, parameter2, condition2, value2, ORIGIN) => {
        return (await FirestoreController.readDataByTwoQueries({ref, parameter, condition, value, parameter2, condition2, value2, ORIGIN}))
    }

    FS_ReadByThree = async (ref, parameter, condition, value, parameter2, condition2, value2, parameter3, condition3, value3, ORIGIN) => {
        return (await FirestoreController.readDataByTwoQueries({ref, parameter, condition, value, parameter2, condition2, value2, parameter3, condition3, value3, ORIGIN}))
    }

    FS_Update = (ref, id, data, ORIGIN) => {
        return FirestoreController.updateData({ref, id, data, ORIGIN})
    }

    FS_Delete = (ref, id, ORIGIN) => {
        return FirestoreController.deleteData({ref, id, ORIGIN})
    }



    // FIRESTORE FUNCTIONS
    ST_Upload = async (ref, data, ORIGIN) => {
        return (await StorageController.uploadData({ref, data, ORIGIN}))
    }

    ST_Download = async (ref, ORIGIN) => {
        //return (await FirestoreController.readDataOn({ref, ORIGIN}))
    }
    
    
    
}

var Controller = new FirebaseController
export default Controller
