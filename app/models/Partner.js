
import Location from './Location'

export default class Partner{

    constructor(){
        this.uid = ''
        this.author = ''
        this.dateCreate = ''
        this.identification = ''
        this.location = Location
        this.services = {} //POS, STORE, CONTABILITY, INVENTORY 
        this.state = ''
        this.typeID = ''
    }

    setValuesFromObject = (from, to) => {
        from['uid'] = to.uid
        from['author'] = to.author
        from['dateCreate'] = to.dateCreate
        from['identification'] = to.identification
        from['location'] = to.location
        from['services'] = to.services
        from['state'] = to.state
        from['typeID'] = to.typeID
    }
    
}