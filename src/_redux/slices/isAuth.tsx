import { createSlice } from "@reduxjs/toolkit"
import Storage from "../../services/localStorage";

const initialState = {
    value: Storage.getToken() ? true : false
}

const isAuth = createSlice({
    name: "isAuth",
    initialState: initialState,
    reducers: {
        onCallIsAuth: (state: { value: any },
            actoin: { payload: { value: any } }) => {
            state.value = actoin.payload.value
        }
    }
})

export const { onCallIsAuth } = isAuth.actions;
export default isAuth.reducer;