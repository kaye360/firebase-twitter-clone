import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";


export interface UserSlice {
    id     : string,
    handle : string,
}

const initialState: UserSlice = {
    id     : '',
    handle : '',
}

export const userSlice = createSlice({
    name : 'userHandle',
    initialState,
    reducers : {
        setUser   : (state, action) => action.payload,
        clearUser : (state) => initialState,
    }

})


export const currentUserHandle = (state: RootState) => state.userHandle


export const { setUser, clearUser } = userSlice.actions


export default userSlice.reducer