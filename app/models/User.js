export default class User{
    
    constructor(){
        this.uid = ''
        this.displayName = ''
        this.email = ''
        this.phoneNumber = ''
        this.password = ''
        this.photoUrl = ''
        this.disabled = false
        this.usertype = ''
        this.state = 'PENDING'
    }

    setValuesFromObject = (from, to) => {
        from['uid'] = to.uid
        from['displayName'] = to.displayName
        from['email'] = to.email
        from['phoneNumber'] = to.phoneNumber
        from['password'] = to.password
        from['photoUrl'] = to.photoUrl
        from['disabled'] = to.disabled
        from['usertype'] = to.usertype
        from['state'] = to.state
    }

    userFromObject(object){
        return {
            uid: object.uid,
            displayName: object.displayName,
            email: object.email,
            phoneNumber: object.phoneNumber,
            password: object.password,
            photoUrl: object.photoUrl,
            disabled: object.disabled,
            state: object.state,
            usertype: object.usertype,
            companyCode: object.companyCode
        }
    }

}