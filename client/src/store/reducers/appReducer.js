import actionTypes from "../actions/actionTypes";


const initState = {
    alert: '',
    callback: null,
    wishlist: [],
    isShowCart: false,
    isLoading: false,
    isAdmin: false,
    brands: null,
    anonmyousCart: []
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ALERT:
            return {
                ...state,
                alert: action.alert,
                callback: action.callback || null
            }
       
        case actionTypes.SHOW_CART:
            return {
                ...state,
                isShowCart: action.flag
            }
        case actionTypes.LOADING:
            return {
                ...state,
                isLoading: action.flag
            }
        case actionTypes.ADMIN:
            return {
                ...state,
                isAdmin: action.flag
            }
        case actionTypes.GET_BRAND:
            return {
                ...state,
                brands: action.data
            }   
        case actionTypes.CART_ANON:
            return {
                ...state,
                anonmyousCart: state.anonmyousCart?.some(el => el === action.pid) ? state.anonmyousCart?.filter(el => el !== action.pid) : [...state.anonmyousCart, action.pid]
            }
        default:
            return state;
    }
}

export default appReducer