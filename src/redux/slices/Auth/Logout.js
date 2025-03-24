import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import  { CreateAuth ,ViewParticularAuth,ViewParticularOrganiser} from "./Auth";



const resetSlice=createSlice({
    name:"reset",
    initialState:false,
    reducers:{
        resetStore:()=>true
    }
})

export const {resetStore}=resetSlice.actions;
export default resetSlice.reducer