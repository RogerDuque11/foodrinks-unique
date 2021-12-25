

export default class Table{

    constructor(){
        this.code = ''
        this.enable = true
        this.number = 0
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['enable'] = to.enable
        from['number'] = to.number
        from['state'] = to.state
    }
    
}