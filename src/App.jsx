import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const SatffLogin = lazy(() => import("./pages/auth/StaffLogin"));
const Profile = lazy(() => import("./pages/profile/profile"));
const ViewProfile = lazy(() => import("./pages/profile/viewProfile"));
const OtpVerify = lazy(() => import("./pages/auth/OtpVerify"));
const StaffOtpVerify = lazy(() => import("./pages/auth/StaffOtpVerify"));

const Vendors = lazy(() => import("./pages/vendor/Vendor"))
const CreateVendor = lazy(() => import("./pages/vendor/CreateVendor"));
const Category = lazy(() => import("./pages/category/Category"));
const SubCategory = lazy(() => import("./pages/subcategory/SubCategory"));



const RoleList = lazy(() => import("./pages/rolesAndPermission/RolesList"));
const AssignPermission = lazy(() => import("./pages/rolesAndPermission/AssignPermission"));

const CreateEmployee = lazy(() => import("./pages/employee/CreateEmployee"));
const Employee = lazy(() => import("./pages/employee/Employee"))



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

const Pricing = lazy(() => import("./pages/pricing/pricing"));


const Supplier = lazy(() => import("./pages/supplier/Supplier"));
const CreateSupplier = lazy(() =>  import("./pages/supplier/CreateSupplier"));

const Stock = lazy(() => import("./pages/stock/Srock"));
const CreateStock = lazy(() => import("./pages/stock/CreateStock"))


import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";








import ForgotPassword from "./Common/forgotPassword/ForgotPassword";
import ResetPassword from "./Common/resetPassword/ResetPassword";
import Error from "./pages/404";
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


                {/* ---- Profile Routes ----- */}
                <Route path="profile" element={<Profile />} />
                <Route path="viewProfile" element={<ViewProfile />} />
                <Route path="business-unit" element={<BusinessUnit />} />
                <Route path="vendors-list" element={<Vendors roleId={currentUser?.roleId} />} />
                <Route path="create-vendor" element={<CreateVendor roleId={currentUser?.roleId} />} />
                <Route path="category" element={<Category />} />


                {/* vendor routes */}

                <Route path="roles-permissions-list" element={<RoleList />} />
                <Route path="assignPermission" element={<AssignPermission />} />

                <Route path="employee-list" element={<Employee />} />
                <Route path="create-employee" element={<CreateEmployee />} />


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
                <Route path="pricing-list" element={<Pricing />} />
                <Route path="supplier-list" element={<Supplier/>} />
                <Route path="create-supplier" element={<CreateSupplier/>} />
                <Route path="stock-list" element={<Stock/>} />
                <Route path="create-stock" element={<CreateStock/>} />






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
