import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;

// ------------- Unread Notification ----------
export const UnreadNotification = createAsyncThunk(
  "unreadNotification",
  async () => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const id = data2?._id;
      const roleId = data2?.roleId
      let path = ""
      if (roleId == 1) {
        path = "superAdmin/notification/list/unread"
      } else {
        path = "organiser/notification/list/unread"

      }
      const { data } = await axios.get(
        `${BASEURL}/${path}/${id}`,
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
// ------------- View All Notification ----------
export const ViewAllNotification = createAsyncThunk(
  "ViewAllNotification",
  async ({ page, keyWord, perPage }) => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const id = data2?._id;
      const roleId = data2?.roleId
      let path = ""
      if (roleId === 1) {
        path = "superAdmin/notification/list/all"
      } else {
        path = "organiser/notification/list/all"

      }
      const { data } = await axios.get(
        `${BASEURL}/${path}/${id}?keyword=${keyWord}&perPage=${perPage}&page=${page}`,
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
// ---------- Read Notification --------
export const ReadNotification = createAsyncThunk(
  "ReadNotification",
  async () => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const id = data2?._id;
      const roleId = data2?.roleId
      let path = ""
      if (roleId === 1) {
        path = "superAdmin/notification/list/read"
      } else {
        path = "organiser/notification/list/read"

      }
      const { data } = await axios.post(
        `${BASEURL}/${path}/${id}`,

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
// ----------- Delete Notification --------
export const DeleteNotification = createAsyncThunk(
  "DeleteNotification",
  async (id) => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const roleId = data2?.roleId
      let path = ""
      if (roleId === 1) {
        path = "superAdmin/notification/delete"
      } else {
        path = "organiser/notification/delete"

      }
      const { data } = await axios.delete(
        `${BASEURL}/${path}/${id}`,
        {},
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
// ----------- View Particular Notification --------
export const ViewParticularNotification = createAsyncThunk(
  "ViewParticularNotification",
  async (id) => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const roleId = data2?.roleId
      let path = ""
      if (roleId === 1) {
        path = "superAdmin/notification/view"
      } else {
        path = "organiser/notification/view"

      }
      const { data } = await axios.get(
        `${BASEURL}/${path}/${id}`,
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
// ----------- Count of Unread Notification --------
export const UnreadNotificationCount = createAsyncThunk(
  "UnreadNotificationCount",
  async () => {
    try {
      const authToken = localStorage.getItem("token");
      const data2 = JSON.parse(localStorage.getItem("adminInfo"));
      const roleId = data2?.roleId
      let path = ""
      if (roleId === 1) {
        path = "superAdmin/notification/count/unread"
      } else {
        path = "organiser/notification/count/unread"

      }
      const id = data2?._id;
      const { data } = await axios.get(
        `${BASEURL}/${path}/${id}`,
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


const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState: {
    loading: false,
    unreadNotificationList: null,
    allNotificationList: null,
    unreadNotificationCount: null,
    readNotificationList: null,
    viewParticularNotification: null,
    deletedNotification: null,
    isError: false,
  },
  reducers: {
    removeNotification: (state) => {
      return {
        loading: false,
        unreadNotificationList: null,
        allNotificationList: null,
        unreadNotificationCount: null,
        readNotificationList: null,
        viewParticularNotification: null,
        deletedNotification: null,
        isError: false,
      };
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(ViewAllNotification.pending, (state, action) => {
    //   state.loading = true;
    // });
    builder.addCase(UnreadNotification.fulfilled, (state, action) => {
      state.unreadNotificationList = action.payload;
    });
    builder.addCase(ViewAllNotification.fulfilled, (state, action) => {
      state.allNotificationList = action.payload;
    });
    builder.addCase(ReadNotification.fulfilled, (state, action) => {
      state.readNotificationList = action.payload;
    });
    builder.addCase(DeleteNotification.fulfilled, (state, action) => {
      state.deletedNotification = action.payload;
    });
    builder.addCase(ViewParticularNotification.fulfilled, (state, action) => {
      state.viewParticularNotification = action.payload;
    });
    builder.addCase(UnreadNotificationCount.fulfilled, (state, action) => {
      state.unreadNotificationCount = action.payload;
    });
    // builder.addCase(ViewAllNotification.rejected, (state, action) => {
    //   state.isError = true;
    // });
  },
});
export const { removeNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;
