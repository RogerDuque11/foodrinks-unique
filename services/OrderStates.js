

export default function OrderState(colors) {

    const getState = {
        'PENDING': { label: 'pending', color: colors.default }, 
        'CONFIRMED': { label: 'confirmed', color: colors.text }, 
        'PREPARING': { label: 'preparing', color: colors.preparing }, 
        'TERMINATED': { label: 'terminated', color: colors.terminated }, 
        'DISPATCHED': { label: 'dispatched', color: colors.finished }, 
        'DELIVERED': { label: 'delivered', color: colors.finished }, 
        'FINISHED': { label: 'finished', color: colors.finished },
        'CANCELED': { label: 'cancel', color: colors.deleted },
        'PAUSED': { label: 'pause', color: colors.warningText }, 
    }
    
    const getSubStates = {
        'PENDING' : { confirm: 'CONFIRMED', cancel: 'CANCELED' },
        'CONFIRMED' : { pending: 'PENDING', preparing: 'PREPARING', cancel: 'CANCELED' }, 
        'PREPARING' : { pause: 'PAUSED', terminated: 'TERMINATED' },
        'TERMINATED' : { dispatched: 'DISPATCHED', delivered: 'DELIVERED', finished: 'FINISHED' }, 
        'DISPATCHED' : { delivered: 'DELIVERED', finished: 'FINISHED' },
        'DELIVERED' : { finished: 'FINISHED' }, 
        'FINISHED' : {  }, 
        'CANCELED' : { pending: 'PENDING' }, 
        'PAUSED' : { pending: 'PENDING', preparing: 'PREPARING', cancel: 'CANCELED' }, 
    }

    const states = (state) => {
        return state && getState[state] ? getState[state] : {}
    }

    const substates = (state) => {
        return state && getSubStates[state] ? getSubStates[state] : []
    }

    return { states, substates }
}