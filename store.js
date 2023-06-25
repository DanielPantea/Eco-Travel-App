import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./src/components/navSlice";


export const store = configureStore({
    reducer: {
        nav: navReducer,
    },
});