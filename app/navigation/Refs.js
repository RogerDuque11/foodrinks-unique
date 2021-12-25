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
        EMPLOYEE: 'COMPANIES/'+COMPANY?COMPANY.code:''+'/EMPLOYEES',
        EMPLOYEES: 'COMPANIES/'+COMPANY?COMPANY.code:''+'/EMPLOYEES',
        COMPANY: 'COMPANIES',
        COMPANIES: 'COMPANIES',
        CUSTOMER: 'CUSTOMERS',
    }
    const ref = (REF, ORIGIN) => {
        console.log(REF)
        var result = ORIGIN ? REF : (REF && REFS[REF]) ? REFS[REF] : null
        return result
    }

    return { ref }
}