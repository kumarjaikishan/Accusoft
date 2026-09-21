import { configureStore } from "@reduxjs/toolkit";
import login from "./login";
import userexplist from './api'
import theme from './themeSlice'
import storageModule from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";

const storage = storageModule.default || storageModule;

const persistConfig={
    key:"Accosoft",
    version:1,
    storage:storage
}
const reducer = combineReducers({
    login: login,
    userexplist:userexplist,
    theme:theme
})

const persistedReducer= persistReducer(persistConfig,reducer)

const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store;
