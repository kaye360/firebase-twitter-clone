import { configureStore } from '@reduxjs/toolkit'
import userHandleReducer from "./slices/userSlice"

export const store = configureStore({
    reducer: {
        userHandle : userHandleReducer,
    }
})


export type RootState   = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch