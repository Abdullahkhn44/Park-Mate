import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../carLocationSlice";
import sessionReducer from "../parkingSessionSlice";

const store = configureStore({
    reducer: {
        location: locationReducer,
        parkingSession: sessionReducer,
    },
});

export default store;