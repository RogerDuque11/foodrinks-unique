

export default class SupplyLocal{

    constructor(){
        this.code = ''
        this.details = ''
        this.enable = true
        this.measure = ''
        this.measureCode = ''
        this.name = ''
        this.place = ''
        this.placeCode = ''
        this.price = ''
        this.quantity = 0
        this.state = ''
        this.stock = 0
        this.supplyCode = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['details'] = to.details
        from['enable'] = to.enable
        from['measure'] = to.measure
        from['measureCode'] = to.measureCode
        from['name'] = to.name
        from['place'] = to.place
        from['placeCode'] = to.placeCode
        from['price'] = to.price
        from['quantity'] = to.quantity
        from['state'] = to.state
        from['stock'] = to.stock
        from['supplyCode'] = to.supplyCode
    }
    
}