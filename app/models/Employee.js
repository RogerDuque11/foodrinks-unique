import Location from './Location'


export default class Employee{

    constructor(){
        this.uid = ''
        this.company = ''
        this.companyCode = ''
        this.department = ''
        this.departmentCode = ''
        this.email = ''
        this.enable = true
        this.identification = ''
        this.local = ''
        this.localCode = ''
        this.location = Location
        this.partner = ''
        this.partnerUid = ''
        this.phoneNumber = ''
        this.photoUrl = ''
        this.place = ''
        this.placeCode = ''
        this.position = ''
        this.state = ''
        this.typeID = ''
    }

    setValuesFromObject = (from, to) => {
        from['uid'] = to.uid
        from['company'] = to.company
        from['companyCode'] = to.companyCode
        from['department'] = to.department
        from['departmentCode'] = to.departmentCode
        from['email'] = to.email
        from['enable'] = to.enable
        from['identification'] = to.identification
        from['local'] = to.local
        from['localCode'] = to.localCode
        from['location'] = to.location
        from['partner'] = to.partner
        from['partnerUid'] = to.partnerUid
        from['phoneNumber'] = to.phoneNumber
        from['photoUrl'] = to.photoUrl
        from['place'] = to.place
        from['placeCode'] = to.placeCode
        from['position'] = to.position
        from['state'] = to.state
        from['typeID'] = to.typeID
    }
    
}