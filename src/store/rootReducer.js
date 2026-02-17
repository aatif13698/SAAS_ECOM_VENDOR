import layout from "./layout";
import auth from "./api/auth/authSlice";
import profile from "./api/auth/peofileSlice";
import states from "./api/auth/stateSlice";
import Auth from "@/redux/slices/Auth/Auth";
import roleSclice from "./slices/roles/roleSclice";
import capabilitySlice from "./slices/auth/capabilitySclice";
import purchaseOrderSlice from "./slices/purchaseOrder/purchaseOrderSclice";
import purchaseInvoiceSlice from "./slices/purchaseInvoice/purhcaseInvoiceSclice";
import paymentOutSlice from "./slices/paymentOut/paymentOutSlice";
import quotationSlice from "./slices/quotation/quotationSlice";
import performaSlice from "./slices/performa/performaSlice";
import saleInvoiceSlice from "./slices/saleInvoice/saleInvoiceSlice";
import paymentInSlice from "./slices/paymentIn/paymentInSlice";


import toastReducer from "./slices/tostSlice"

import SuperAdminNotification from "@/redux/slices/Notification/SuperAdminNotification";
import resetSlice from "@/redux/slices/Auth/Logout";

import financialYearChangeSclice from "../store/slices/financialYearChange/financialYearChangeSlice"
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
  purchaseOrderSlice,
  purchaseInvoiceSlice,
  paymentOutSlice,
  quotationSlice,
  performaSlice,
  saleInvoiceSlice,
  paymentInSlice,
  financialYearChangeSclice,

  toast: toastReducer,

};
export default rootReducer;
