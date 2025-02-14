import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({

    name: 'parkingSession',

    initialState: {
        isSessionStarted: true,
    },

    reducers: {  
        setisSessionStarted: (state, action) => {
            state.isSessionStarted = action.payload;
        },
    },

})

export const { setisSessionStarted } = sessionSlice.actions;

export default sessionSlice.reducer;