import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from './appReducer'
import authReducer from './authReducer'
import userReducer from './userReducer'
import productReducer from './productReducer'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'


const commonConfig = {
    storage,
    stateReconsiler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'shop',
    whitelist: ['accessToken', 'isLoggedIn']
}
const appConfig = {
    ...commonConfig,
    key: 'datn2023',
    whitelist: ['anonmyousCart']
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    app: persistReducer(appConfig, appReducer),
    user: userReducer,
    product: productReducer,
})

export default rootReducer