import React, {useState} from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import NavigationDrawer from '../navigation/NavigationDrawer'
import NavigationBottom from './NavigationBottomOld'
import Constants from '../constants/Constants'
import CurrentScheme from '../constants/CurrentScheme'


// SCREENS FOR ALL USERS
import More from '../screensOthers/MoreScreen'
import Empty from '../screensOthers/EmptyScreen'
import Help from '../screensOthers/HelpScreen'
import Login from '../screensUser/LoginScreen'
import Register from '../screensUser/RegisterScreen'
import RestorePass from '../screensUser/RestorePassword'

// SCREENS FOR ALL PARTNER
import CreatePartner from '../screensPartner/CreatePartner'
import ReadPartners from '../screensPartner/ReadPartners'
import UpdatePartner from '../screensPartner/UpdatePartner'

import CreateCompany from '../screensCompany/CreateCompany'
import ReadCompanies from '../screensCompany/ReadCompanies'
import UpdateCompany from '../screensCompany/UpdateCompany'

import CreateLocal from '../screensLocal/CreateLocal'
import ReadLocals from '../screensLocal/ReadLocals'
import UpdateLocal from '../screensLocal/UpdateLocal'

import CreateTax from '../screensTax/CreateTax'
import ReadTaxes from '../screensTax/ReadTaxes'
import UpdateTax from '../screensTax/UpdateTax'

import CreatePlace from '../screensPlace/CreatePlace'
import ReadPlaces from '../screensPlace/ReadPlaces'
import UpdatePlace from '../screensPlace/UpdatePlace'

import CreateTable from '../screensTable/CreateTable'
import ReadTables from '../screensTable/ReadTables'
import UpdateTable from '../screensTable/UpdateTable'

import CreateDepartment from '../screensDepartment/CreateDepartment'
import ReadDepartments from '../screensDepartment/ReadDepartments'
import UpdateDepartment from '../screensDepartment/UpdateDepartment'

import CreateUser from '../screensUser/CreateUser'
import ReadUsers from '../screensUser/ReadUsers'
import UpdateUser from '../screensUser/UpdateUser'

import CreateEmployee from '../screensEmployee/CreateEmployee'
import ReadEmployees from '../screensEmployee/ReadEmployees'
import UpdateEmployee from '../screensEmployee/UpdateEmployee'

import CreateProductLocal from '../screensProductLocal/CreateProductLocal'
import ReadProductsLocal from '../screensProductLocal/ReadProductsLocal'
import UpdateProductLocal from '../screensProductLocal/UpdateProductLocal'

import CreateProduct from '../screensProduct/CreateProduct'
import ReadProducts from '../screensProduct/ReadProducts'
import UpdateProduct from '../screensProduct/UpdateProduct'

import OrdersDate from '../screensOrder/OrdersDatePicker'
import CreateOrder from '../screensOrder/CreateOrder'
import ReadOrders from '../screensOrder/ReadOrdersOld'
import UpdateOrder from '../screensOrder/UpdateOrder'
import ReadOrdersTable from '../screensOrder/ReadOrdersTable'
import ReadOrdersPlace from '../screensOrder/ReadOrdersPlace'
import ReadOrdersDelivery from '../screensOrder/ReadOrdersDelivery'
import ReadOrdersPay from '../screensOrder/ReadOrdersPay'

import CreateMeasure from '../screensMeasure/CreateMeasure'
import ReadMeasures from '../screensMeasure/ReadMeasures'
import UpdateMeasure from '../screensMeasure/UpdateMeasure'

import CreateRecipe from '../screensRecipe/CreateRecipe'
import ReadRecipes from '../screensRecipe/ReadRecipes'
import UpdateRecipe from '../screensRecipe/UpdateRecipe'

import CreateLetterMenu from '../screensLetterMenu/CreateLetterMenu'
import ReadLettersMenu from '../screensLetterMenu/ReadLettersMenu'
import UpdateLetterMenu from '../screensLetterMenu/UpdateLetterMenu'

import CreateSupply from '../screensSupply/CreateSupply'
import ReadSupplies from '../screensSupply/ReadSupplies'
import UpdateSupply from '../screensSupply/UpdateSupply'

import CreateSupplyLocal from '../screensSupplyLocal/CreateSupplyLocal'
import ReadSuppliesLocal from '../screensSupplyLocal/ReadSuppliesLocal'
import UpdateSupplyLocal from '../screensSupplyLocal/UpdateSupplyLocal'



const Stack = createStackNavigator();

// INIT ARRAY SCREENS
const commonScreens = () => {
    return ( <>
        <Stack.Screen name="Ayuda" component={Help} options={{ headerShown: false }} />
    </> )
}


const noAuthScreens = (props) => {
    const {AuthContext} = props
    return ( <>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} initialParams={{AuthContext: AuthContext}}  />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} initialParams={{AuthContext: AuthContext}} />
        <Stack.Screen name="RestorePass" component={RestorePass} options={{ headerShown: false }} />
    </> )
}


const employeeScreens = (props) => {
    const {AuthContext} = props
    var screensStack = {
        UpdateCompany: { component: UpdateCompany, options:{ }, initialParams:{ } },
        UpdateLocal: { component: UpdateLocal, options:{ }, initialParams:{ } },

        OrdersDate: { component: OrdersDate, options:{ headerShown: false, presentation: 'modal' }, initialParams:{ } },
        CreateOrder: { component: CreateOrder, options:{ }, initialParams:{ } },
        UpdateOrder: { component: UpdateOrder, options:{ }, initialParams:{ } },
        CreateTable: { component: CreateTable, options:{ }, initialParams:{ } },
        UpdateTable: { component: UpdateTable, options:{ }, initialParams:{ } },
        UpdateProductLocal: { component: UpdateProductLocal, options:{ headerTransparent: true }, initialParams:{ } },
    }
    var screensChild2 = {
        //create: { component: CreateOrder, iconName: 'clipboard-outline', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        orders: { component: ReadOrders, iconName: 'clipboard-outline', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        //tables: { component: ReadOrdersTable, iconName: 'tablets', iconLibrary: 'Fontisto', params: {AuthContext: AuthContext}},
        places: { component: ReadOrdersPlace, iconName: 'fire', iconLibrary: 'SimpleLineIcons', params: {AuthContext: AuthContext}},
        deliveries: { component: ReadOrdersDelivery, iconName: 'bicycle', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        payments: { component: ReadOrdersPay, iconName: 'payment', iconLibrary: 'MaterialIcons', params: {AuthContext: AuthContext}},
    }
    var screensChild3 = {
        realtime: { component: NavigationBottom, iconName: 'grid-outline', iconLibrary: 'Ionicons',
            options:{ headerShown: true },
            params:{screens: screensChild2, AuthContext: AuthContext}
        }
    }
    var screensChild = !CurrentScheme().isWeb ? screensChild3 : screensChild2
    return { screensStack, screensChild }
}


const waiterScreens = (props) => {
    const {AuthContext} = props
    var screensStack = {
        UpdateCompany: { component: UpdateCompany, options:{ }, initialParams:{ } },
        UpdateLocal: { component: UpdateLocal, options:{ }, initialParams:{ } },

        OrdersDate: { component: OrdersDate, options:{ headerShown: false, presentation: 'modal' }, initialParams:{ } },
        CreateOrder: { component: CreateOrder, options:{ }, initialParams:{ } },
        UpdateOrder: { component: UpdateOrder, options:{ }, initialParams:{ } },
        CreateTable: { component: CreateTable, options:{ }, initialParams:{ } },
        UpdateTable: { component: UpdateTable, options:{ }, initialParams:{ } },
    }
    var screensChild2 = {
        orders: { component: ReadOrders, iconName: 'clipboard-outline', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        //tables: { component: ReadOrdersTable, iconName: 'tablets', iconLibrary: 'Fontisto', params: {AuthContext: AuthContext}},
        places: { component: ReadOrdersPlace, iconName: 'fire', iconLibrary: 'SimpleLineIcons', params: {AuthContext: AuthContext}},
        deliveries: { component: ReadOrdersDelivery, iconName: 'bicycle', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        payments: { component: ReadOrdersPay, iconName: 'payment', iconLibrary: 'MaterialIcons', params: {AuthContext: AuthContext}},
    }
    var screensChild3 = {
        realtime: { component: NavigationBottom, iconName: 'grid-outline', iconLibrary: 'Ionicons',
            options:{ headerShown: true },
            params:{screens: screensChild2, AuthContext: AuthContext}
        }
    }
    var screensChild = !CurrentScheme().isWeb ? screensChild3 : screensChild2
    return { screensStack, screensChild }
}

const cookScreens = (props) => {
    const {AuthContext} = props
    var screensStack = {
        UpdateCompany: { component: UpdateCompany, options:{ }, initialParams:{ } },
        UpdateLocal: { component: UpdateLocal, options:{ }, initialParams:{ } },
        
        OrdersDate: { component: OrdersDate, options:{ headerShown: false, presentation: 'modal' }, initialParams:{ } },
    }
    var screensChild2 = {
        places: { component: ReadOrdersPlace, iconName: 'fire', iconLibrary: 'SimpleLineIcons', params: {AuthContext: AuthContext}},
    }
    var screensChild3 = {
        realtime: { component: NavigationBottom, iconName: 'grid-outline', iconLibrary: 'Ionicons',
            options:{ headerShown: true },
            params:{screens: screensChild2, AuthContext: AuthContext}
        }
    }
    var screensChild = !CurrentScheme().isWeb ? screensChild3 : screensChild2
    return { screensStack, screensChild }
}

const deliveryScreens = (props) => {
    const {AuthContext} = props
    var screensStack = {
        UpdateCompany: { component: UpdateCompany, options:{ }, initialParams:{ } },
        UpdateLocal: { component: UpdateLocal, options:{ }, initialParams:{ } },
        
        OrdersDate: { component: OrdersDate, options:{ headerShown: false, presentation: 'modal' }, initialParams:{ } },
    }
    var screensChild2 = {
        deliveries: { component: ReadOrdersDelivery, iconName: 'bicycle', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
    }
    var screensChild3 = {
        realtime: { component: NavigationBottom, iconName: 'grid-outline', iconLibrary: 'Ionicons',
            options:{ headerShown: true },
            params:{screens: screensChild2, AuthContext: AuthContext}
        }
    }
    var screensChild = !CurrentScheme().isWeb ? screensChild3 : screensChild2
    return { screensStack, screensChild }
}


const adminScreens = (props) => {
    const {AuthContext} = props
    const screens = employeeScreens(props)
    var screensStack = {
        ...screens['screensStack'],
        
        CreateRecipe: { component: CreateRecipe, options:{ }, initialParams:{ } },
        UpdateRecipe: { component: UpdateRecipe, options:{ }, initialParams:{ } },
        CreateProductLocal: { component: CreateProductLocal, options:{ headerTransparent: true }, initialParams:{ } },
        CreateSupply: { component: CreateSupply, options:{ }, initialParams:{ } },
        UpdateSupply: { component: UpdateSupply, options:{ }, initialParams:{ } },
        CreateSupplyLocal: { component: CreateSupplyLocal, options:{ }, initialParams:{ } },
        UpdateSupplyLocal: { component: UpdateSupplyLocal, options:{ }, initialParams:{ } },
    }
    var screensChild = {
        ...screens['screensChild'],
        suppliesLocal: {component: ReadSuppliesLocal, iconName: 'flask-outline', iconLibrary: 'Ionicons' },
        productsLocal: { component: ReadProductsLocal, iconName: 'fast-food-outline', iconLibrary: 'Ionicons', params: {AuthContext: AuthContext}},
        tablesLocal: { component: ReadTables, iconName: 'tablets', iconLibrary: 'Fontisto', params: {AuthContext: AuthContext}},
        employees: {component: ReadEmployees, iconName: 'account-circle-outline', iconLibrary: '' },
    }
    return { screensStack, screensChild }
}

const adminLocalScreens = (props) => {
    const {AuthContext} = props
    const screens = adminScreens(props)
    var screensStack = {
        ...screens['screensStack'],
        CreateUser: { component: CreateUser, options:{ }, initialParams:{ } },
        UpdateUser: { component: UpdateUser, options:{ }, initialParams:{ } },
        CreateEmployee: { component: CreateEmployee, options:{ }, initialParams:{ } },
        UpdateEmployee: { component: UpdateEmployee, options:{ }, initialParams:{ } },
        CreatePlace: { component: CreatePlace, options:{ }, initialParams:{ } },
        UpdatePlace: { component: UpdatePlace, options:{ }, initialParams:{ } },
    }
    var screensChild = {
        ...screens['screensChild'],
        placesPreparation: { component: ReadPlaces, iconName: 'fire', iconLibrary: 'SimpleLineIcons', params: { }},
    }
    return { screensStack, screensChild }
}

const adminCompanyScreens = (props) => {
    const {AuthContext} = props
    const screens = adminLocalScreens(props)
    var screensStack = {
        ...screens['screensStack'],
    }
    var screensChild = {
        ...screens['screensChild'],
        recipes: { component: ReadRecipes, iconName: 'fast-food-outline', iconLibrary: 'Ionicons', params: { }},
        supplies: {component: ReadSupplies, iconName: 'flask-outline', iconLibrary: 'Ionicons' },
        lettersMenu: { component: ReadLettersMenu, iconName: 'workspaces-outline', iconLibrary: 'MaterialIcons', params: { }},
        departments: { component: ReadDepartments, iconName: 'file-tray-stacked-outline', iconLibrary: 'Ionicons', params: { }},
        users: {component: ReadUsers, iconName: 'account-outline', iconLibrary: '' },
    }
    return { screensStack, screensChild }
}


const partnerScreens = (props) => {
    const {AuthContext} = props
    const screens = adminCompanyScreens(props)
    var screensStack = {
        ...screens['screensStack'],
        CreateCompany: { component: CreateCompany, options:{ }, initialParams:{ } },
        CreateLocal: { component: CreateLocal, options:{ }, initialParams:{ } },
        CreateLetterMenu: { component: CreateLetterMenu, options:{ }, initialParams:{ } },
        UpdateLetterMenu: { component: UpdateLetterMenu, options:{ }, initialParams:{ } },
        CreateDepartment: { component: CreateDepartment, options:{ }, initialParams:{ } },
        UpdateDepartment: { component: UpdateDepartment, options:{ }, initialParams:{ } },
    }
    var screensChild = {
        ...screens['screensChild'],
        //companies: { component: ReadCompanies, iconName: 'grid-outline', iconLibrary: 'Ionicons', params: { }},
        //locals: { component: ReadLocals, iconName: 'storefront', iconLibrary: 'MaterialIcons', params: { }},
    }
    return { screensStack, screensChild }
}


const rootScreens = (props) => {
    const {AuthContext} = props
    //const screens = adminScreens(props)
    const screens = {}
    var screensStack = {
        ...screens['screensStack'],
        CreateUser: { component: CreateUser, options:{ }, initialParams:{ } },
        UpdateUser: { component: UpdateUser, options:{ }, initialParams:{ } },
        CreatePartner: { component: CreatePartner, options:{ }, initialParams:{ } },
        UpdatePartner: { component: UpdatePartner, options:{ }, initialParams:{ } },
        CreateEmployee: { component: CreateEmployee, options:{ }, initialParams:{ } },
        UpdateEmployee: { component: UpdateEmployee, options:{ }, initialParams:{ } },
        CreateTax: { component: CreateTax, options:{ }, initialParams:{ } },
        UpdateTax: { component: UpdateTax, options:{ }, initialParams:{ } },
        CreateMeasure: { component: CreateMeasure, options:{ }, initialParams:{ } },
        UpdateMeasure: { component: UpdateMeasure, options:{ }, initialParams:{ } },
    }
    var screensChild = {
        ...screens['screensChild'],
        partners: {component: ReadPartners, iconName: 'grid-outline', iconLibrary: 'Ionicons' },
        users: {component: ReadUsers, iconName: 'people-outline', iconLibrary: 'Ionicons' },
        taxes: {component: ReadTaxes, iconName: 'grid-outline', iconLibrary: 'Ionicons' },
        measures: { component: ReadMeasures, iconName: 'balance-scale', iconLibrary: 'FontAwesome' },
    }
    return { screensStack, screensChild }
}


const getScreens = (props) => {
    const {usertype, AuthContext} = props
    var screensStack = {}
    var screensChild = {}
    
    switch(usertype) {
        case 'DELIVERY': 
            screensStack = deliveryScreens(props).screensStack
            screensChild = deliveryScreens(props).screensChild
            break
        case 'COOK': 
            screensStack = cookScreens(props).screensStack
            screensChild = cookScreens(props).screensChild
            break
        case 'WAITER': 
            screensStack = waiterScreens(props).screensStack
            screensChild = waiterScreens(props).screensChild
            break
        case 'EMPLOYEE': 
            screensStack = employeeScreens(props).screensStack
            screensChild = employeeScreens(props).screensChild
            break
        case 'ADMIN': 
            screensStack = adminScreens(props).screensStack
            screensChild = adminScreens(props).screensChild
            break
        case 'ADMINLOCAL': 
            screensStack = adminLocalScreens(props).screensStack
            screensChild = adminLocalScreens(props).screensChild
            break
        case 'ADMINCOMPANY': 
            screensStack = adminCompanyScreens(props).screensStack
            screensChild = adminCompanyScreens(props).screensChild
            break
        case 'PARTNER': 
            screensStack = partnerScreens(props).screensStack
            screensChild = partnerScreens(props).screensChild
            break
        case 'ROOT': 
            screensStack = rootScreens(props).screensStack
            screensChild = rootScreens(props).screensChild
            break
        default: break
    }

    /* var screensChild2 = {
        drawer: {component: NavigationDrawer, iconName: 'grid-outline', iconLibrary: 'Ionicons',
            options:{ headerShown: false },
            params:{screens: screensChild, AuthContext: AuthContext}
        },
    } */
    
    return ( 
        <>{
            /* (usertype === 'EMPLOYEE') && !CurrentScheme().isWeb  ? 
            <Stack.Screen name="BottomTaps" component={NavigationBottom} options={{ headerShown: false }} initialParams={{screens: screensChild, AuthContext: AuthContext}} />
            : */
            <Stack.Screen name="Drawer" component={NavigationDrawer} options={{ headerShown: false }} initialParams={{screens: screensChild, AuthContext: AuthContext}} />
        }
            
        {   screensStack ?
            Object.entries(screensStack).map(([key, params]) => (
                <Stack.Screen key={key} name={key} component={params.component} options={{ ...params.options }} initialParams={{ ...params.initialParams }} />
            )) : <Stack.Screen name="Ayuda" component={Help} options={{ headerShown: false }} />
        }
        </>
    )
}
// END ARRAY SCREENS


 class Routes {
    
    constructor(AuthContext){
        const useWindow = Constants.WINDOW()
        this.NOAUTHSCREENS = noAuthScreens({AuthContext})
        this.DELIVERYSCREEN = getScreens({usertype: 'DELIVERY', AuthContext})
        this.COOKSCREEN = getScreens({usertype: 'COOK', AuthContext})
        this.WAITERSCREENS = getScreens({usertype: 'WAITER', AuthContext})
        this.EMPLOYEESCREEN = getScreens({usertype: 'EMPLOYEE', AuthContext})
        this.ADMINSCREENS = getScreens({usertype: 'ADMIN', AuthContext})
        this.ADMINLOCALSCREENS = getScreens({usertype: 'ADMINLOCAL', AuthContext})
        this.ADMINCOMPANYSCREENS = getScreens({usertype: 'ADMINCOMPANY', AuthContext})
        this.PARTNERSCREENS = getScreens({usertype: 'PARTNER', AuthContext})
        this.ROOTSCREENS = getScreens({usertype: 'ROOT', AuthContext})
    }

}

export default Routes