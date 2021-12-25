


export default class Company{

    constructor(){
        this.author = ''
        this.code = ''
        this.email = ''
        this.enable = true
        this.logo = ''
        this.partner = ''
        this.partnerUid = ''
        this.phoneNumber = ''
        this.nit = ''
        this.regime = ''
        this.representative = {}
        this.resolution = {}
        this.slogan = ''
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['author'] = to.author
        from['code'] = to.code
        from['email'] = to.email
        from['enable'] = to.enable
        from['logo'] = to.logo
        from['partner'] = to.partner
        from['partnerUid'] = to.partnerUid
        from['phoneNumber'] = to.phoneNumber
        from['nit'] = to.nit
        from['regime'] = to.regime
        from['representative'] = to.representative
        from['resolution'] = to.resolution
        from['slogan'] = to.slogan
        from['state'] = to.state
    }
    
}