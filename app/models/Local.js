import Location from './Location'


export default class Local{

    constructor(){
        this.code = ''
        this.email = ''
        this.enable = true
        this.imageCover = ''
        this.location = Location
        this.name = ''
        this.phoneNumber = ''
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['email'] = to.email
        from['enable'] = to.enable
        from['imageCover'] = to.imageCover
        from['location'] = to.location
        from['name'] = to.name
        from['phoneNumber'] = to.phoneNumber
        from['state'] = to.state
    }
    
}