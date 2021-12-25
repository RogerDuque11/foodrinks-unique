

export default class LetterMenu{

    constructor(){
        this.code = ''
        this.details = ''
        this.enable = true
        this.name = ''
        this.state = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['details'] = to.details
        from['enable'] = to.enable
        from['name'] = to.name
        from['state'] = to.state
    }
    
}