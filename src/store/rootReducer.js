import layout from "./layout";
import auth from "./api/auth/authSlice";
import profile from "./api/auth/peofileSlice";
import states from "./api/auth/stateSlice";
import Auth from "@/redux/slices/Auth/Auth";
import roleSclice from "./slices/roles/roleSclice";
import capabilitySlice from "./slices/auth/capabilitySclice";
import purchaseOrderSlice  from "./slices/purchaseOrder/purchaseOrderSclice";

import SuperAdminNotification from "@/redux/slices/Notification/SuperAdminNotification";
import resetSlice from "@/redux/slices/Auth/Logout";
const rootReducer = {
  layout,
  auth,
  profile,
  states,
  Auth,
  SuperAdminNotification,
  Auth,
  resetSlice,

  //  role sclice
  roleSclice,

  capabilitySlice,
  purchaseOrderSlice

};
export default rootReducer;
