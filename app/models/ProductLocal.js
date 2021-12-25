

export default class ProductLocal{

    constructor(){
        this.code = ''
        this.details = ''
        this.enable = true
        this.images = {image1: ''}
        this.name = ''
        this.photoUrl = ''
        this.place = ''
        this.placeCode = ''
        this.price = 0
        this.sale = 0
        this.state = ''
        this.supplies = { } 
    }

    setValuesFromObject = (from, to) => {
        from['code'] = to.code
        from['details'] = to.details
        from['enable'] = to.enable
        from['images'] = to.images
        from['name'] = to.name
        from['photoUrl'] = to.photoUrl
        from['place'] = to.place
        from['placeCode'] = to.placeCode
        from['price'] = to.price
        from['sale'] = to.sale
        from['state'] = to.state
        from['supplies'] = to.supplies
    }
    
}