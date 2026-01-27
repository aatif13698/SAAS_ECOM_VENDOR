import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const SatffLogin = lazy(() => import("./pages/auth/StaffLogin"));
const Profile = lazy(() => import("./pages/profile/profile"));
const ViewProfile = lazy(() => import("./pages/profile/viewProfile"));
const OtpVerify = lazy(() => import("./pages/auth/OtpVerify"));
const StaffOtpVerify = lazy(() => import("./pages/auth/StaffOtpVerify"));
const AttendanceCalendar = lazy(() => import("./pages/profile/AttendanceCalendar"));

// const Vendors = lazy(() => import("./pages/vendor/Vendor"))
const CreateVendor = lazy(() => import("./pages/vendor/CreateVendor"));
const Category = lazy(() => import("./pages/category/Category"));
const SubCategory = lazy(() => import("./pages/subcategory/SubCategory"));



const RoleList = lazy(() => import("./pages/rolesAndPermission/RolesList"));
const AssignPermission = lazy(() => import("./pages/rolesAndPermission/AssignPermission"));

const CreateEmployee = lazy(() => import("./pages/employee/CreateEmployee"));
const Employee = lazy(() => import("./pages/employee/Employee"));
const ViewEmployee = lazy(() => import("./pages/employee/ViewEmployee"));

const CreateCustomer = lazy(() => import("./pages/customer/CreateCustomer"));
const CreateCustomerAddress = lazy(() => import("./pages/customer/CreateCustomerAddress"));
const Customer = lazy(() => import("./pages/customer/Customer"));



const BusinessUnit = lazy(() => import("./pages/businessUnit/BusinessUnit"));
const CreateBusinessUnit = lazy(() => import("./pages/businessUnit/CreateBusinessUnit"));
const ViewBusinessUnit = lazy(() => import("./pages/businessUnit/ViewBusinessUnit"));
const Branch = lazy(() => import("./pages/branch/Branch"));
const CreateBranch = lazy(() => import("./pages/branch/CreateBranch"));
const ViewBranch = lazy(() => import("./pages/branch/ViewBranch"));
const Warehouse = lazy(() => import("./pages/warehouse/Warehouse"));
const CreateWarehouse = lazy(() => import("./pages/warehouse/CreateWarehouse"));
const ViewWarehouse = lazy(() => import("./pages/warehouse/ViewWarehouse"));



const Brand = lazy(() => import("./pages/brand/Brand"));
const Manufacturer = lazy(() => import("./pages/manufacturer/Manufacturer"));
const Attribute = lazy(() => import("./pages/attribute/Attributes"));
const ProductBluePrint = lazy(() => import("./pages/productBlueprint/ProductBluePrint"))
const CreateProductBluePrint = lazy(() => import("./pages/productBlueprint/createProductBluePrint"));
const Holiday = lazy(() => import("./pages/holiday/Holiday"));
const CreateHoliday = lazy(() => import("./pages/holiday/CreateHoliday"));

const Variant2 = lazy(() => import("./pages/variant/Variant2"))

const Pricing = lazy(() => import("./pages/pricing/pricing"));
const Pricing2 = lazy(() => import("./pages/pricing/Pricing2"))


const Supplier = lazy(() => import("./pages/supplier/Supplier"));
const CreateSupplier = lazy(() => import("./pages/supplier/CreateSupplier"));
const AddSupplierAddress = lazy(() => import("./pages/supplier/AddSupplierAddress"));
const LinkedItems = lazy(() => import("./pages/supplier/LinkedItems"));
const SupplierTransport = lazy(() => import("./pages/supplierTransport/SupplierTransport"));
const CreateSupplierTransport = lazy(() => import("./pages/supplierTransport/CreateSupplierTransport"));

const Stock = lazy(() => import("./pages/stock/Srock"));
const CreateStock = lazy(() => import("./pages/stock/CreateStock"));
const AddProductQA = lazy(() => import("./pages/productQA/AddProductQA"));
const query = lazy(() => import("./pages/query/Query"))

const Orders = lazy(() => import("./pages/orders/Orders"));
const ViewOrder = lazy(() => import("./pages/orders/ViewOrder"));
const CreateOrder = lazy(() => import("./pages/orders/CreateOrder"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const Department = lazy(() => import("./pages/department/Department"));
const CreateDepartment = lazy(() => import("./pages/department/CreateDepartment"));

const Asset = lazy(() => import("./pages/assets/Asset"));
const CreateAsset = lazy(() => import("./pages/assets/CreateAsset"));
const ViewAssetAndTool = lazy(() => import("./pages/assets/ViewAssetAndTool"));

const Shifts = lazy(() => import("./pages/shift/Shifts"));
const CreateShifts = lazy(() => import("./pages/shift/CreateShifts"));
const ChangeShifts = lazy(() => import("./pages/changeShift/ChangeShifts"));
const CreateChangeShift = lazy(() => import("./pages/changeShift/CreateChangeShift"));
const RequestShift = lazy(() => import("./pages/requestShift/RequestShift"));
const ActionRequestShift = lazy(() => import("./pages/requestShift/ActionRequestShift"));

const LeaveCategory = lazy(() => import("./pages/leaveCategory/LeaveCategory"));
const CreateLeaveCategory = lazy(() => import("./pages/leaveCategory/CreateLeaveCategory"));
const LeaveAllotment = lazy(() => import("./pages/leaveAllotment/LeaveAllotment"));
const LeaveRequest = lazy(() => import("./pages/leaveRequest/LeaveRequest"));


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

const ProductQaOut = lazy(() => import("./pages/ProudctQaOut/ProductQaOut"));



// sale

const SaleQuotation = lazy(() => import("./pages/saleQuotation/SaleQuotationList"));
const CreateQuotation = lazy(() => import("./pages/saleQuotation/SaleQuotation"));
const ViewSaleQuotation = lazy(() => import("./pages/saleQuotation/ViewSaleQuotation"))


// statement

const CreateStatement = lazy(() => import("./pages/statement/CreateStatement"));
const Statement = lazy(() => import("./pages/statement/Statement"));
const ListSection = lazy(() => import("./components/sections/ListSection"))


import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const PurchaseOrderPage = lazy(() => import("./pages/purchaseOrder/PurchaseOrder"));
const ListPurchaseOrder = lazy(() => import("./pages/purchaseOrder/ListPurchaseOrder"));
const ViewPurchaseOrder = lazy(() => import("./pages/purchaseOrder/ViewPurchaseOrder"));

const ListPurchaseInvoice = lazy(() => import("./pages/purchaseInvoice/ListPurchaseInvoice"));
const PurchaseInvoice = lazy(() => import("./pages/purchaseInvoice/PurchaseInvoice"));
const ViewPurchaseInvoice = lazy(() => import("./pages/purchaseInvoice/ViewPurchaseInvoice"));
const PaymentOut = lazy(() => import("./pages/paymentOut/PaymentOut"))
const CreatePaymentOut = lazy(() => import("./pages/paymentOut/CreatePaymentOut"));
const ViewPaymentOut = lazy(() => import("./pages/paymentOut/ViewPaymentOut"));

// system settings
const SystemSettings = lazy(() => import("./pages/systemSettings/SystemSettings"));





import ForgotPassword from "./Common/forgotPassword/ForgotPassword";
import ResetPassword from "./Common/resetPassword/ResetPassword";
import Error from "./pages/404";
import AuditStock from "./pages/auditStock/AuditStock";
import Example from "./components/Example";
import Query from "./pages/query/Query";
import SectionGrids from "./components/sections/SectionGrids";
import SectionCards from "./components/sections/SectionCards";
import CreateSection from "./components/sections/CreateSection";
import { EditSection, ViewSection } from "./components/sections/EditAndViewSection";
import CreateBanner from "./components/Banner/CreateBanner";
import ListBanner from "./components/Banner/ListBanner";
import { EditBanner, ViewBanner } from "./components/Banner/EditAndViewBanner";
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
                <Route path="example" element={<Example />} />








                {/* ---- Profile Routes ----- */}
                <Route path="profile" element={<Profile />} />
                <Route path="viewProfile" element={<ViewProfile />} />
                <Route path="attendance" element={<AttendanceCalendar />} />
                <Route path="businessunit-list" element={<BusinessUnit />} />
                {/* <Route path="vendors-list" element={<Vendors roleId={currentUser?.roleId} />} /> */}
                <Route path="create-vendor" element={<CreateVendor roleId={currentUser?.roleId} />} />
                <Route path="category" element={<Category />} />


                {/* vendor routes */}

                {/* Business unit */}
                <Route path="business-unit-list" element={<BusinessUnit />} />
                <Route path="create-businessunit" element={<CreateBusinessUnit roleId={currentUser?.roleId} />} />
                <Route path="edit-business-unit/:id" element={<CreateBusinessUnit roleId={currentUser?.roleId} />} />
                <Route path="view-businessunit/:id" element={<ViewBusinessUnit roleId={currentUser?.roleId} />} />


                {/* Branch */}
                <Route path="branch-list" element={<Branch />} />
                <Route path="create-branch" element={<CreateBranch roleId={currentUser?.roleId} />} />
                <Route path="view-branch/:id" element={<ViewBranch roleId={currentUser?.roleId} />} />
                <Route path="edit-branch/:id" element={<CreateBranch roleId={currentUser?.roleId} />} />


                {/* Warehouse */}
                <Route path="warehouse-list" element={<Warehouse />} />
                <Route path="create-warehouse" element={<CreateWarehouse roleId={currentUser?.roleId} />} />
                <Route path="view-warehouse/:id" element={<ViewWarehouse roleId={currentUser?.roleId} />} />
                <Route path="edit-warehouse/:id" element={<CreateWarehouse roleId={currentUser?.roleId} />} />



                <Route path="shift-list" element={<Shifts />} />
                <Route path="create-shift" element={<CreateShifts />} />

                <Route path="change-shift-list" element={<ChangeShifts />} />
                <Route path="create-change-shift" element={<CreateChangeShift />} />

                <Route path="shift-change-request-list" element={<RequestShift />} />
                <Route path="shift-change-request-action" element={<ActionRequestShift />} />





                <Route path="department-list" element={<Department />} />
                <Route path="create-department" element={<CreateDepartment />} />

                <Route path="roles-&-permissions-list" element={<RoleList />} />
                <Route path="assignPermission" element={<AssignPermission />} />

                <Route path="documents-list" element={<Documents />} />
                <Route path="create-documents" element={<CreateDocument />} />
                <Route path="documents/custom-field" element={<DocCustomField />} />
                <Route path="documents/adjust-order" element={<DocAdjustOrder />} />

                <Route path="/assets-&-tools-list" element={<Asset />} />
                <Route path="create-assets-&-tools" element={<CreateAsset />} />
                <Route path="view-assets-&-tool" element={<ViewAssetAndTool />} />
                <Route path="leave-category-list" element={<LeaveCategory />} />
                <Route path="create-leave-category" element={<CreateLeaveCategory />} />
                <Route path="leave-allotment-list" element={<LeaveAllotment />} />
                <Route path="leave-requests-list" element={<LeaveRequest />} />

                <Route path="holiday-list" element={<Holiday />} />
                <Route path="create-holiday" element={<CreateHoliday />} />



                <Route path="employee-list" element={<Employee />} />
                <Route path="create-employee" element={<CreateEmployee />} />
                <Route path="view-employee/:id" element={<ViewEmployee />} />

                <Route path="customer-list" element={<Customer />} />
                <Route path="create-customer" element={<CreateCustomer />} />
                <Route path="create-customer/add/address" element={<CreateCustomerAddress />} />







                <Route path="subcategory-list" element={<SubCategory />} />
                <Route path="brand-list" element={<Brand />} />
                <Route path="manufacturer-list" element={<Manufacturer />} />
                <Route path="attribute-list" element={<Attribute />} />
                <Route path="product-list" element={<ProductBluePrint />} />
                <Route path="create-product" element={<CreateProductBluePrint />} />
                <Route path="product-qa-out-list" element={<ProductQaOut />} />

                <Route path="variant-list" element={<Variant2 />} />


                <Route path="pricing-list" element={<Pricing2 />} />
                <Route path="supplier-list" element={<Supplier />} />
                <Route path="create-supplier" element={<CreateSupplier />} />
                <Route path="create-supplier/add/address" element={<AddSupplierAddress />} />
                <Route path="create-supplier/link/items" element={<LinkedItems />} />

                <Route path="create-transport" element={<CreateSupplierTransport />} />
                <Route path="transport-list" element={<SupplierTransport />} />


                <Route path="stock-list" element={<Stock />} />
                <Route path="create-stock" element={<CreateStock />} />
                <Route path="audit-stock-list" element={<AuditStock />} />
                <Route path="order-list" element={<Orders />} />
                <Route path="order-view" element={<ViewOrder />} />
                <Route path="create-order" element={<CreateOrder />} />
                <Route path="create-product-qa" element={<AddProductQA />} />
                <Route path="query-list" element={<Query />} />



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


                {/* purchase */}
                <Route path="create-purchase-order" element={<PurchaseOrderPage />} />
                <Route path="edit-purchase-order" element={<PurchaseOrderPage />} />
                <Route path="purchase-order-list" element={<ListPurchaseOrder />} />
                <Route path="view/purchase-order" element={<ViewPurchaseOrder />} />

                <Route path="purchase-invoices-list" element={<ListPurchaseInvoice />} />
                <Route path="create-purchase-invoice" element={<PurchaseInvoice />} />
                <Route path="view/purchase-invoice/:id" element={<ViewPurchaseInvoice />} />

                <Route path="payment-out-list" element={<PaymentOut />} />
                <Route path="pcreate-payment-out" element={<CreatePaymentOut />} />
                <Route path="view-payment-out/:id" element={<ViewPaymentOut />} />



                {/* sale */}

                <Route path="quotation-list" element={<SaleQuotation />} />
                <Route path="create-quotation" element={<CreateQuotation />} />
                <Route path="view/quotation/:id" element={<ViewSaleQuotation />} />




                {/* statement */}


                <Route path="create-statement" element={<CreateStatement />} />
                <Route path="statements-list" element={<Statement />} />

                <Route path="section-list" element={<ListSection />} />
                <Route path="sections/create" element={<CreateSection />} />
                <Route path="sections/edit/:id" element={<EditSection />} />
                <Route path="sections/view/:id" element={<ViewSection />} />
                <Route path="sections/grids" element={<SectionGrids />} />
                <Route path="sections/cards" element={<SectionCards />} />

                <Route path="banners/create" element={<CreateBanner />} />
                <Route path="banners/list" element={<ListBanner />} />
                <Route path="banners/edit/:id" element={<EditBanner />} />
                <Route path="banners/view/:id" element={<ViewBanner />} />






                {/* system settings */}

                <Route path="system/settings" element={<SystemSettings />} />








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


// test comment ttt