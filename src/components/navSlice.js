import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    googleDirection: null,
    ticketsId: null,
}

export const navSlice = createSlice ({
    name: 'nav',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setGoogleDirection: (state, action) => {
            state.googleDirection = action.payload;
        },
        setTicketsId: (state, action) => {
            state.ticketsId = action.payload;
        },
    },
});

export const { setOrigin, setDestination, setGoogleDirection, setTicketsId} = navSlice.actions;

//Selectors

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectGoogleDirection = (state) => state.nav.googleDirection;
export const selectTicketsId = (state) => state.nav.ticketsId;


export default navSlice.reducer;
