import Location from './Location'


export default class Local{

    constructor(){
        this.code = ''
        this.company = ''
        this.companyCode = ''
        this.details = ''
        this.email = ''
        this.enable = true
        this.imageCover = ''
        this.imageLogo = ''
        this.location = Location
        this.name = ''
        this.partner = ''
        this.partnerUid = ''
        this.phoneNumber = ''
        this.slogan = ''
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['company'] = to.company
        from['companyCode'] = to.companyCode
        from['details'] = to.details
        from['email'] = to.email
        from['enable'] = to.enable
        from['imageCover'] = to.imageCover
        from['imageLogo'] = to.imageLogo
        from['location'] = to.location
        from['name'] = to.name
        from['partner'] = to.partner
        from['partnerUid'] = to.partnerUid
        from['phoneNumber'] = to.phoneNumber
        from['slogan'] = to.slogan
        from['state'] = to.state
    }
    
}