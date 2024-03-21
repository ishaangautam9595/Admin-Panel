import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    firstName: '',
    lastName: '',
}

const isAdminInfo = createSlice({
    name: "adminInfo",
    initialState: initialState,
    reducers: {
        onSetAdminInfo: (state: { firstName: string, lastName: string },
            action: { payload: { firstName: string, lastName: string } }) => {
                state.firstName = action.payload.firstName;
                state.lastName = action.payload.lastName;
        },
        onClearAdminInfo: (state: { firstName: string, lastName: string }) =>{
            state.firstName = '';
            state.lastName = '';
        }
    }
})

export const { onSetAdminInfo, onClearAdminInfo } = isAdminInfo.actions;
export default isAdminInfo.reducer;