

export default class Tax{

    constructor(){
        this.code = ''
        this.detail = ''
        this.enable = true
        this.name = ''
        this.porcentage = 0
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['detail'] = to.detail
        from['enable'] = to.enable
        from['name'] = to.name
        from['porcentage'] = to.porcentage
        from['state'] = to.state
    }
    
}