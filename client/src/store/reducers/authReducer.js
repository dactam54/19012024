import actionTypes from "../actions/actionTypes";
const initState = {
    isLoggedIn: false,
    accessToken: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return ({
                ...state,
                isLoggedIn: action.isLoggedIn || false,
                accessToken: action.accessToken || null
            })
        case actionTypes.LOGOUT:
            return ({
                ...state,
                isLoggedIn: false,
                accessToken: null
            })

        default:
            return state;
    }
}

export default authReducer