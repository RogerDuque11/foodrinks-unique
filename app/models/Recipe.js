

export default class Recipe{

    constructor(){
        this.code = ''
        this.details = ''
        this.enable = true
        this.local = ''
        this.localCode = ''
        this.letterMenu = ''
        this.letterMenuCode = ''
        this.name = ''
        this.photoUrl = ''
        this.price = 0
        this.state = ''
        this.supplies = { } 
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['details'] = to.details
        from['enable'] = to.enable
        from['local'] = to.local
        from['localCode'] = to.localCode
        from['letterMenu'] = to.letterMenu
        from['letterMenuCode'] = to.letterMenuCode
        from['name'] = to.name
        from['photoUrl'] = to.photoUrl
        from['price'] = to.price
        from['state'] = to.state
        from['supplies'] = to.supplies
    }
    
}