import {combineReducers, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { apiSlice } from "./api/apiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";



const persistConfig = {
  key: "root",
  storage,
};



const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    ...rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  })
);


// const store = configureStore({
//   reducer: {
//     ...rootReducer,
//     [apiSlice.reducerPath]: apiSlice.reducer,
//   },
//   //devTools: false,
//   middleware: (getDefaultMiddleware) => {
//     const middleware = [...getDefaultMiddleware(), apiSlice.middleware];
//     return middleware;
//   },
// });


const store = configureStore({
  reducer: persistedReducer,
  //  {
  //    ,
  //   // ...rootReducer,
  //   // [apiSlice.reducerPath]: apiSlice.reducer,
  // },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  // devTools: false,
  // middleware: (getDefaultMiddleware) => {
  //   const middleware = [...getDefaultMiddleware(), apiSlice.middleware];
  //   return middleware;
  // },
});

export const persistor = persistStore(store);

export default store;
