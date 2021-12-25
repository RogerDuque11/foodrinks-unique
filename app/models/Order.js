

export default class Order{

    constructor(){
        this.code = ''
        this.cash = 0
        this.customer = ''
        this.customerAddress = ''
        this.customerPhone = ''
        this.date = ''
        this.deliveryPrice = 0
        this.details = ''
        this.enable = true
        this.hour = ''
        this.productsPrice = 0
        this.products = {}
        this.state = ''
        this.table = ''
        this.type = ''
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['cash'] = to.cash
        from['customer'] = to.customer
        from['customerAddress'] = to.customerAddress
        from['customerPhone'] = to.customerPhone
        from['date'] = to.date
        from['deliveryPrice'] = to.deliveryPrice
        from['details'] = to.details
        from['enable'] = to.enable
        from['hour'] = to.hour
        from['productsPrice'] = to.productsPrice
        from['products'] = to.products
        from['state'] = to.state
        from['table'] = to.table
        from['type'] = to.type
    }
    
}