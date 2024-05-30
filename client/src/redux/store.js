import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist' //redux persist to store info in local storage so that signin info will be kept even after refreshing
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user: userReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig , rootReducer);  


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {serializableCheck: false}
    )
})

export const persistor = persistStore(store)