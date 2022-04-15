import Constants from '../constants/Constants'

export default function References() {
    const { PROFILE, COMPANY } = Constants.SESION
    const usertype = PROFILE && PROFILE.usertype ? PROFILE.usertype : null
    const ROOT = usertype === 'ROOT' ? true : false
    const PARTNER = usertype === 'PARTNER' ? true : false
    const EMPLOYEE = usertype === 'EMPLOYEE' ? true : false
    const position = PROFILE && PROFILE.position ? PROFILE.position : null
    const ADMIN = usertype === 'ADMIN' ? true : false
    const COOK = usertype === 'COOK' ? true : false
    const WAITER = usertype === 'WAITER' ? true : false
    const DELIVERY = usertype === 'DELIVERY' ? true : false

    const REFS = {
        ROOT: 'USERS',
        PARTNER: 'PARTNERS',
        EMPLOYEE: 'COMPANY/'+COMPANY?COMPANY.code:''+'/EMPLOYEES',
        EMPLOYEES: 'COMPANY/'+COMPANY?COMPANY.code:''+'/EMPLOYEES',
        COMPANY: 'COMPANY',
        COMPANY: 'COMPANY',
        CUSTOMER: 'CUSTOMERS',
    }
    const ref = (REF, ORIGIN) => {
        var result = ORIGIN ? REF : (REF && REFS[REF]) ? REFS[REF] : null
        return result
    }

    return { ref }
}