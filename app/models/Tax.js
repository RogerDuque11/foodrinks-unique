

export default class Tax{

    constructor(){
        this.author = ''
        this.code = ''
        this.detail = ''
        this.enable = true
        this.name = ''
        this.porcentage = 0
    }

    setValuesFromObject = (from, to) => {
        from['author'] = to.author
        from['code'] = to.code
        from['detail'] = to.detail
        from['enable'] = to.enable
        from['name'] = to.name
        from['porcentage'] = to.porcentage
    }
    
}