import actionTypes from "../actions/actionTypes";
const initState = {
    boughtProducts: [],
    sku: []
}

const productReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.CAL_PRICE:
            return ({
                ...state,
                boughtProducts: [...state.boughtProducts.filter(el => el.pid !== action.product.pid), action.product]
            })
        case actionTypes.DEL_ORDER:
            return ({
                ...state,
                boughtProducts: state.boughtProducts.filter(el => el.pid !== action.pid)
            })
        case actionTypes.RESET_ORDER:
            return ({
                ...state,
                boughtProducts: [],
                sku: []
            })
        case actionTypes.SKU:
            let updatedSku = []
            if (state.sku.length > 0 && state.sku.some(el => el.pid === action.sku.pid)) {
                if (state.sku.some(el => el.value === action.sku.value)) {
                    updatedSku = state.sku.filter(el => el.pid === action.sku.pid)
                } else {
                    updatedSku = [...state.sku.filter(el => el.pid !== action.sku.pid), action.sku]
                }
            } else {
                updatedSku = [...state.sku, action.sku]
            }
            console.log(updatedSku);
            return ({
                ...state,
                sku: updatedSku
            })

        default:
            return state;
    }
}

export default productReducer