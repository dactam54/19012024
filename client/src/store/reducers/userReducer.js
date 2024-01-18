import actionTypes from "../actions/actionTypes";

const initState = {
    updateCurrent: false,
    cart: [],


}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_CURRENT:
            return ({
                ...state,
                updateCurrent: !state.updateCurrent
            })
        case actionTypes.CART:
            return ({
                ...state,
                cart: state.cart.some(el => el === action.cart) ? state.cart.filter(el => el === action.cart) : [...state.cart, action.cart]
            })
        case actionTypes.REMOVE_PRODUCT:
            return ({
                ...state,
                cart: state.cart.filter(el => el !== action.pid)
            })
        case actionTypes.SET_CART:
            return ({
                ...state,
                cart: action.cart
            })
        case actionTypes.LOGOUT:
            return ({
                ...state,
                cart: []
            })
        default:
            return state;
    }
}

export default userReducer