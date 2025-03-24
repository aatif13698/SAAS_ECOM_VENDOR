import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import Logout from "./Logout";


const BASEURL = import.meta.env.VITE_BASE_URL;

// ---------- Create & Update Auth --------
export const CreateAuth = createAsyncThunk("CreateAuth", async (payload) => {
  try {
    const data1 = JSON.parse(localStorage.getItem("adminInfo"));
    const authToken = localStorage.getItem("token_AS");
    const { data } = await axios.post(
      `${BASEURL}/api/admin/adminProfile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

// ----------- View Particular Auth --------
export const ViewParticularAuth = createAsyncThunk(
  "ViewParticularAuth",
  async () => {

    try {
      const data1 = JSON.parse(localStorage.getItem("adminInfo"));
      const id = data1?._id;
      const authToken = localStorage.getItem("token");

      const { data } = await axios.get(
        `${BASEURL}/api/superAdmin/getSuperAdminProfile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// For Organiser

// ----------- View Particular Organiser --------
export const ViewParticularOrganiser = createAsyncThunk(
  "ViewParticularOrganiser",
  async () => {
    try {
      const data1 = JSON.parse(localStorage.getItem("adminInfo"));
      const id = data1?._id;
      const authToken = localStorage.getItem("token_AS");
      const { data } = await axios.get(
        `${BASEURL}/api/organiser/getProfile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    loading: false,
    createdAuth: null,
    viewParticularAuth: null,
    viewParticularOrganiser: null,
    isError: false,
  },
  reducers: {
    removeAuth: (state) => {
      return {
        loading: false,
        createdAuth: null,
        viewParticularAuth: null,
        viewParticularOrganiser: null,
        isError: false,
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(CreateAuth.fulfilled, (state, action) => {
      state.createdAuth = action.payload;
    });
    builder.addCase(ViewParticularAuth.fulfilled, (state, action) => {
      state.viewParticularAuth = action.payload;
    });
    builder.addCase(ViewParticularOrganiser.fulfilled, (state, action) => {
      state.viewParticularOrganiser = action.payload;
    });
  },
});
export const { removeAuth } = authSlice.actions;
export default authSlice.reducer;

