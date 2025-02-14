import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name: 'location',
    initialState: {
        latitude: null,
        longitude: null
    },

    reducers: {
        setLatitude: (state, action) => {
            state.latitude = action.payload;
        },

        setLongitude: (state, action) => {
            state.longitude = action.payload;
        }
    }
})

export const { setLatitude, setLongitude } = locationSlice.actions;

export default locationSlice.reducer;