import actionTypes from "./actionTypes";
import * as apis from '../../apis'

export const getBrands = () => async (dispatch) => {
    try {
        const response = await apis.apiGetBrands()
        if (response.err === 0) {
            dispatch({
                type: actionTypes.GET_BRAND,
                data: response.brandDatas
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_BRAND,
            data: null
        })
    }
}