

export default class Measure{

    constructor(){
        this.code = ''
        this.key = ''
        this.name = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['key'] = to.key
        from['name'] = to.name
    }
    
}