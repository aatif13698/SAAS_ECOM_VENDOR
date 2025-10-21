import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const SatffLogin = lazy(() => import("./pages/auth/StaffLogin"));
const Profile = lazy(() => import("./pages/profile/profile"));
const ViewProfile = lazy(() => import("./pages/profile/viewProfile"));
const OtpVerify = lazy(() => import("./pages/auth/OtpVerify"));
const StaffOtpVerify = lazy(() => import("./pages/auth/StaffOtpVerify"));

// const Vendors = lazy(() => import("./pages/vendor/Vendor"))
const CreateVendor = lazy(() => import("./pages/vendor/CreateVendor"));
const Category = lazy(() => import("./pages/category/Category"));
const SubCategory = lazy(() => import("./pages/subcategory/SubCategory"));



const RoleList = lazy(() => import("./pages/rolesAndPermission/RolesList"));
const AssignPermission = lazy(() => import("./pages/rolesAndPermission/AssignPermission"));

const CreateEmployee = lazy(() => import("./pages/employee/CreateEmployee"));
const Employee = lazy(() => import("./pages/employee/Employee"));

const CreateCustomer = lazy(() => import("./pages/customer/CreateCustomer"));
const CreateCustomerAddress = lazy(() => import("./pages/customer/CreateCustomerAddress"));
const Customer = lazy(() => import("./pages/customer/Customer"));



const BusinessUnit = lazy(() => import("./pages/businessUnit/BusinessUnit"));
const CreateBusinessUnit = lazy(() => import("./pages/businessUnit/CreateBusinessUnit"));
const Branch = lazy(() => import("./pages/branch/Branch"));
const CreateBranch = lazy(() => import("./pages/branch/CreateBranch"));
const Warehouse = lazy(() => import("./pages/warehouse/Warehouse"));
const CreateWarehouse = lazy(() => import("./pages/warehouse/CreateWarehouse"));
const Brand = lazy(() => import("./pages/brand/Brand"));
const Manufacturer = lazy(() => import("./pages/manufacturer/Manufacturer"));
const Attribute = lazy(() => import("./pages/attribute/Attributes"));
const ProductBluePrint = lazy(() => import("./pages/productBlueprint/ProductBluePrint"))
const CreateProductBluePrint = lazy(() => import("./pages/productBlueprint/createProductBluePrint"));

const Variant2 = lazy(() => import("./pages/variant/Variant2"))

const Pricing = lazy(() => import("./pages/pricing/pricing"));
const Pricing2 = lazy(() => import("./pages/pricing/Pricing2"))


const Supplier = lazy(() => import("./pages/supplier/Supplier"));
const CreateSupplier = lazy(() => import("./pages/supplier/CreateSupplier"));

const Stock = lazy(() => import("./pages/stock/Srock"));
const CreateStock = lazy(() => import("./pages/stock/CreateStock"));

const Orders = lazy(() => import("./pages/orders/Orders"));
const ViewOrder = lazy(() => import("./pages/orders/ViewOrder"));
const CreateOrder = lazy(() => import("./pages/orders/CreateOrder"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const Department = lazy(() => import("./pages/department/Department"));
const CreateDepartment = lazy(() => import("./pages/department/CreateDepartment"));

const Asset = lazy(() => import("./pages/assets/Asset"));
const CreateAsset = lazy(() => import("./pages/assets/CreateAsset"));
const Shifts = lazy(() => import("./pages/shift/Shifts"));
const CreateShifts = lazy(() => import("./pages/shift/CreateShifts"));

const LeaveCategory = lazy(() => import("./pages/leaveCategory/LeaveCategory"));
const CreateLeaveCategory = lazy(() => import("./pages/leaveCategory/CreateLeaveCategory"));


const CreateLedgerGrop = lazy(() => import("./pages/ledgerGroup/CreateLedgerGroup"));
const LedgerGroup = lazy(() => import("./pages/ledgerGroup/LedgerGroup"));
const CustomField = lazy(() => import("./pages/ledgerGroup/CustomField"));
const AdjustOrder = lazy(() => import("./pages/ledgerGroup/AdjustOrder"));
const FinancialYear = lazy(() => import("./pages/financialYear/FinancialYear"));
const Currency = lazy(() => import("./pages/currency/Currency"));
const CreateVoucherGroup = lazy(() => import("./pages/voucherGroup/CreateVoucherGroup"));
const VoucherGroup = lazy(() => import("./pages/voucherGroup/VoucherGroup"));
const Voucher = lazy(() => import("./pages/voucher/Voucher"));
const CreateVoucher = lazy(() => import("./pages/voucher/CreateVoucher"));

const Documents = lazy(() => import("./pages/documents/Documents"));
const CreateDocument = lazy(() => import("./pages/documents/CreateDocuments"));
const DocCustomField = lazy(() => import("./pages/documents/DocCustomField"));
const DocAdjustOrder = lazy(() => import("./pages/documents/DocAdjustOrder"));
const Ledger = lazy(() => import("./pages/ledger/Ledger"));
const CreateLedger = lazy(() => import("./pages/ledger/CreateLedger"));


import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const PurchaseOrderPage = lazy(() => import("./pages/purchaseOrder/PurchaseOrder"))






import ForgotPassword from "./Common/forgotPassword/ForgotPassword";
import ResetPassword from "./Common/resetPassword/ResetPassword";
import Error from "./pages/404";
// import PurchaseOrderPage from "./pages/purchaseOrder/PurchaseOrder";
// import BusinessUnit from "./components/BusinessUnit/BusinessUnit";



function App() {
  let isLoggedIn = false;
  const [refresh, setRefresh] = useState(0);
  const { user: currentUser, isAuth: auth } = useSelector(
    (state) => state.auth
  );

  if (
    currentUser &&
    auth
    // &&(currentUser.roleId === 1 || currentUser.roleId === 2)
  ) {
    isLoggedIn = true;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // hadling token expiry
  const tokenExpiryTime = 3600000; // 1 hour in milliseconds

  // Function to check if token has expired
  const isTokenExpired = () => {
    const tokenExpiryTimestamp = localStorage.getItem("saas_client_expiryTime");

    const currentTime = new Date().getTime();
    return currentTime > parseInt(tokenExpiryTimestamp, 10);
  };

  // Function to clear local storage when token expires
  const clearLocalStorageIfTokenExpired = () => {
    if (isTokenExpired()) {
      alert("Your session has been Expired Please Login Again");
      localStorage.clear(); // Clear all local storage
      window.location.reload();
      navigate("/");
    }
  };

  // Effect to run the expiry check periodically
  useEffect(() => {
    const intervalId = setInterval(clearLocalStorageIfTokenExpired, 60000); // Check every minute (adjust as needed)
    return () => clearInterval(intervalId); // Clean up the interval when component unmounts
  }, []); // Run only once on component mount

  return (
    <>



      <main className="App  relative">

        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/" element={<Layout />}>
                <Route
                  path="*"
                  element={<Error roleId={currentUser?.roleId} />}
                />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="purchase/order" element={<PurchaseOrderPage />} />





                {/* ---- Profile Routes ----- */}
                <Route path="profile" element={<Profile />} />
                <Route path="viewProfile" element={<ViewProfile />} />
                <Route path="business-unit" element={<BusinessUnit />} />
                {/* <Route path="vendors-list" element={<Vendors roleId={currentUser?.roleId} />} /> */}
                <Route path="create-vendor" element={<CreateVendor roleId={currentUser?.roleId} />} />
                <Route path="category" element={<Category />} />


                {/* vendor routes */}

                <Route path="shift-list" element={<Shifts />} />
                <Route path="create-shift" element={<CreateShifts />} />

                <Route path="department-list" element={<Department />} />
                <Route path="create-department" element={<CreateDepartment />} />

                <Route path="roles-permissions-list" element={<RoleList />} />
                <Route path="assignPermission" element={<AssignPermission />} />

                <Route path="documents-list" element={<Documents />} />
                <Route path="create-documents" element={<CreateDocument />} />
                <Route path="documents/custom-field" element={<DocCustomField />} />
                <Route path="documents/adjust-order" element={<DocAdjustOrder />} />

                <Route path="/assets-tools-list" element={<Asset />} />
                <Route path="create-assets-tools" element={<CreateAsset />} />
                <Route path="leave-category-list" element={<LeaveCategory />} />
                <Route path="create-leave-category" element={<CreateLeaveCategory />} />



                <Route path="employee-list" element={<Employee />} />
                <Route path="create-employee" element={<CreateEmployee />} />

                <Route path="customer-list" element={<Customer />} />
                <Route path="create-customer" element={<CreateCustomer />} />
                <Route path="create-customer/add/address" element={<CreateCustomerAddress />} />




                <Route path="business-unit-list" element={<BusinessUnit />} />
                <Route path="create-business-unit" element={<CreateBusinessUnit roleId={currentUser?.roleId} />} />
                <Route path="branch-list" element={<Branch />} />
                <Route path="create-branch" element={<CreateBranch roleId={currentUser?.roleId} />} />
                <Route path="warehouse-list" element={<Warehouse />} />
                <Route path="create-warehouse" element={<CreateWarehouse roleId={currentUser?.roleId} />} />
                <Route path="sub-category-list" element={<SubCategory />} />
                <Route path="brand-list" element={<Brand />} />
                <Route path="manufacturer-list" element={<Manufacturer />} />
                <Route path="attribute-list" element={<Attribute />} />
                <Route path="product-list" element={<ProductBluePrint />} />
                <Route path="create-product" element={<CreateProductBluePrint />} />

                <Route path="variant-list" element={<Variant2 />} />


                <Route path="pricing-list" element={<Pricing2 />} />
                <Route path="supplier-list" element={<Supplier />} />
                <Route path="create-supplier" element={<CreateSupplier />} />
                <Route path="stock-list" element={<Stock />} />
                <Route path="create-stock" element={<CreateStock />} />
                <Route path="order-list" element={<Orders />} />
                <Route path="order-view" element={<ViewOrder />} />
                <Route path="create-order" element={<CreateOrder />} />


                <Route path="financial-year-list" element={<FinancialYear />} />
                <Route path="currency-list" element={<Currency />} />
                <Route path="create-group" element={<CreateLedgerGrop />} />
                <Route path="group-list" element={<LedgerGroup />} />
                <Route path="voucher-group-list" element={<VoucherGroup />} />
                <Route path="create-voucher-group" element={<CreateVoucherGroup />} />
                <Route path="voucher-list" element={<Voucher />} />
                <Route path="create-voucher" element={<CreateVoucher />} />


                <Route path="group/custom-field" element={<CustomField />} />
                <Route path="group/adjust-order" element={<AdjustOrder />} />

                <Route path="ledger-list" element={<Ledger />} />
                <Route path="create-ledger" element={<CreateLedger />} />








              </Route>
            </Route>

            <Route element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/signIn" element={<Login />} />
              <Route path="/staff/signIn" element={<SatffLogin />} />
              <Route path="/otp" element={<OtpVerify />} />
              <Route path="/staffOtp" element={<StaffOtpVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* forgot-password */}
            </Route>
          </Route>
        </Routes>
      </main></>
  );
}

export default App;
