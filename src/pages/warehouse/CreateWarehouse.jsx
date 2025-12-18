// import { Card } from "@mui/material";
// import React, { useState, Fragment, useEffect } from "react";
// import { Country, State, City } from "country-state-city";
// import toast from "react-hot-toast";
// import useDarkMode from "@/hooks/useDarkMode";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
// import { FaEyeSlash } from "react-icons/fa";
// import "../../assets/scss/common.scss"

// import { useSelector } from "react-redux";
// import ProfileImage from "../../assets/images/users/user-4.jpg"
// import TradingLicense from "../../assets/images/tradingLicense.png"
// import vendorService from "@/services/vendor/vendor.service";
// import Fileinput from "@/components/ui/Fileinput";
// import { Dialog, Transition } from "@headlessui/react";
// import FormLoader from "@/Common/formLoader/FormLoader";
// import warehouseService from "@/services/warehouse/warehouse.service";
// import Button from "@/components/ui/Button";




// const CreateWarehouse = ({ noFade, scrollContent }) => {

//     // useEffect(() => {
//     //     if (roleId !== 1) {
//     //         navigate("/dashboard");
//     //         return;
//     //     }
//     //     return;
//     // }, []);
//     const [isDark] = useDarkMode();
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const row = location?.state?.row;
//     const mode = location?.state?.name;
//     const id = location?.state?.id;

//     console.log("id", id);

//     const [pageLoading, setPageLoading] = useState(true);
//     const [showLoadingModal, setShowLoadingModal] = useState(false);

//     const [activeBusinessUnits, setActiveBusinessUnits] = useState([])
//     const [activeBranches, setActiveBranches] = useState([]);
//     console.log("activeBranches", activeBranches);

//     const [formData, setFormData] = useState({
//         businessUnit: "",
//         branchId: "",
//         name: "",
//         emailContact: "",
//         contactNumber: "",
//         houseOrFlat: "",
//         streetOrLocality: "",
//         landmark: "",
//         country: "",
//         city: "",
//         state: "",
//         address: "",
//         ZipCode: "",
//     });

//     console.log("formData warehouse", formData);


//     const [formDataErr, setFormDataErr] = useState({
//         businessUnit: "",
//         branchId: "",
//         name: "",
//         emailContact: "",
//         contactNumber: "",
//         houseOrFlat: "",
//         streetOrLocality: "",
//         landmark: "",
//         country: "",
//         city: "",
//         state: "",
//         address: "",
//         ZipCode: "",
//         icon: "",
//     });
//     const {
//         businessUnit,
//         branchId,
//         name,
//         emailContact,
//         contactNumber,
//         country,
//         city,
//         state,
//         address,
//         ZipCode,

//     } = formData;
//     const [countryData, setCountryData] = useState({
//         countryList: "",
//         countryName: "",
//         countryISOCode: "",
//         CountryISDCode: "",
//         stateList: "",
//         stateName: "",
//         stateISOCode: "",
//         cityList: "",
//         cityName: "",
//     });
//     const {
//         countryList,
//         countryName,
//         countryISOCode,
//         CountryISDCode,
//         stateList,
//         stateName,
//         stateISOCode,
//         cityList,
//         cityName,
//     } = countryData;

//     const [passwordErr, setPasswordErr] = useState("");
//     const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
//     const [isViewed, setIsViewed] = useState(false);
//     const [showAddButton, setShowAddButton] = useState(true);
//     const [isPasswordVissible, setIsPasswordVissile] = useState(false);
//     const [loading, setLoading] = useState(false)
//     const [isConfirmPasswordVissible, setConfirmIsPasswordVissile] = useState(false);
//     const [refresh, setRefresh] = useState(0);

//     const [imgPreview, setImgPreviwe] = useState(null);
//     const [ImgErr, setImgErr] = useState("");
//     const [selectedFile, setselectedFile] = useState(null);



//     const [imgPreview2, setImgPreviwe2] = useState(null);
//     const [ImgErr2, setImgErr2] = useState("");
//     const [selectedFile2, setSelectedFile2] = useState(null);











//     const navigate = useNavigate();
//     const [vehicleViewByNotification, setVehicleViewByNotification] = useState(false);






//     //------- Handling the VAlidation ------
//     function validationFunction() {
//         let errorCount = 0;

//         if (!businessUnit) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 businessUnit: "Business Unit Is Required.",
//             }));
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 businessUnit: "",
//             }));
//         }

//         if (!branchId) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 branchId: "Branch Is Required.",
//             }));
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 branchId: "",
//             }));
//         }

//         if (!name) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 name: "Name Is Required.",
//             }));
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 name: "",
//             }));
//         }
//         if (!emailContact) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 emailContact: "Email Is Required.",
//             }));
//             errorCount++

//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 emailContact: "",
//             }));
//             errorCount++

//         }

//         const phoneRegex = /^[0-9]{10}$/;
//         if (!contactNumber) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 contactNumber: "Phone Number Is Required.",
//             }));
//             errorCount++
//         } else {
//             if (!phoneRegex.test(contactNumber) || contactNumber.length === 0) {
//                 setFormDataErr((prev) => ({ ...prev, contactNumber: "Enter a valid phone number." }));
//             } else {
//                 setFormDataErr((prev) => ({ ...prev, contactNumber: "" }));
//             }
//         }


//         if (!countryData?.countryName) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 country: "Country is Required"
//             }))
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 country: ""
//             }))
//         }
//         if (!countryData?.stateName) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 state: "State is Required"
//             }))
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 state: ""
//             }))
//         }
//         if (!countryData?.cityName) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 city: "City is Required"
//             }))
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 city: ""
//             }))
//         }

//         if (!ZipCode) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 ZipCode: "ZipCode Code Is Required.",
//             }));
//             errorCount++

//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 ZipCode: "",
//             }));
//         }
//         if (!address) {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 address: "Address Is Required.",
//             }));
//             errorCount++
//         } else {
//             setFormDataErr((prev) => ({
//                 ...prev,
//                 address: "",
//             }));
//         }

//         if (id == null) {
//             if (!selectedFile) {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     icon: "Logo is required."
//                 }))
//                 errorCount++
//             }
//         }
//         if (errorCount > 0) {
//             return false
//         } else {
//             return true
//         }
//     }

//     const handleCountry = (e) => {
//         const { name, value } = e.target;
//         const selectedCountry = countryList.find(
//             (country) => country?.name === value
//         );
//         if (name == "country") {
//             if (value == "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     country: "Country is required",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     country: "",
//                 }));
//             }
//         }
//         if (selectedCountry) {
//             setCountryData((prev) => ({
//                 ...prev,
//                 countryName: selectedCountry?.name,
//                 countryISOCode: selectedCountry?.isoCode,
//                 CountryISDCode: selectedCountry?.contactNumbercode,
//             }));
//             setFormData((prev) => ({
//                 ...prev,
//                 country: selectedCountry?.name
//             }))
//         }
//     };

//     // ----- Handling the state name as per the country name
//     const handleState = (e) => {
//         const { name, value } = e.target;
//         const selectedState = stateList.find((state) => state?.name === value);
//         if (name === "state") {
//             if (value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     state: "State is required",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     state: "",
//                 }));
//             }
//         }
//         if (selectedState) {
//             setCountryData((prev) => ({
//                 ...prev,
//                 stateName: selectedState?.name,
//                 stateISOCode: selectedState?.isoCode,
//             }));
//             setFormData((prev) => ({
//                 ...prev,
//                 state: selectedState?.name
//             }))
//         }
//     };

//     // ----- Handling the city name as per the state name
//     const handleCity = (e) => {
//         const { name, value } = e.target;
//         if (name === "city") {
//             if (value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     city: "City is required",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     city: "",
//                 }));
//             }
//         }
//         setCountryData((prev) => ({
//             ...prev,
//             cityName: value,
//         }));
//         setFormData((prev) => ({
//             ...prev,
//             city: value
//         }))
//     };

//     //------ mounting the all country data -------
//     useEffect(() => {
//         setCountryData((prev) => ({
//             ...prev,
//             countryList: Country.getAllCountries(),
//         }));
//     }, []);

//     //------ mounting the all state data as per the country name -------
//     useEffect(() => {
//         setCountryData((prev) => ({
//             ...prev,
//             stateList: State.getStatesOfCountry(countryISOCode),
//         }));
//     }, [isViewed, countryISOCode, id]);
//     //------ mounting the all city data as per the state name -------
//     useEffect(() => {
//         setCountryData((prev) => ({
//             ...prev,
//             cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
//         }));
//     }, [isViewed, countryISOCode, stateISOCode]);
//     // ------ HAndling the change in the form ---

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name == "businessUnit") {
//             if (value == "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     businessUnit: "Business Unit is Required"
//                 }))
//             } else {
//                 setActiveBranches([])
//                 setFormData((prev) => ({
//                     ...prev,
//                     branchId: ""
//                 }))
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     businessUnit: ""
//                 }))
//             }
//         }

//         if (name == "branchId") {
//             if (value == "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     branchId: "Branch is Required"
//                 }))
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     branchId: ""
//                 }))
//             }
//         }



//         if (name === "name") {
//             if (value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     name: "Name Is Required.",
//                 }));
//             } else if (value?.length <= 3) {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     name: "Minimum 3 characters required.",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     name: "",
//                 }));
//             }
//         }
//         if (name == "emailContact") {
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (value == "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     emailContact: "Email is Required"
//                 }))
//             } else if (!emailRegex.test(value)) {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     emailContact: "Enter valid Email "
//                 }))
//             }
//             else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     emailContact: ""
//                 }))
//             }
//         }
//         if (name === "contactNumber") {
//             const phoneRegex = /^[0-9]{10}$/;
//             if (!phoneRegex.test(value) || value.length === 0) {
//                 setFormDataErr((prev) => ({ ...prev, contactNumber: "Enter a valid phone number." }));
//             } else {
//                 setFormDataErr((prev) => ({ ...prev, contactNumber: "" }));
//             }
//         }

//         if (name == "ZipCode") {
//             if (value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     ZipCode: "Zip Code Is Required.",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     ZipCode: "",
//                 }));
//             }
//         }

//         if (name == "address") {
//             if (value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     address: "Address Is Required.",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     address: "",
//                 }));
//             }
//         }

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };


//     useEffect(() => {
//         if (businessUnit) {
//             getBranchByBusiness(businessUnit)
//         }
//     }, [businessUnit]);


//     async function getBranchByBusiness(id) {

//         try {
//             const response = await warehouseService.getBranchByBusiness(id);

//             setActiveBranches(response.data)


//         } catch (error) {
//             console.log("error while getting branch by business unit");
//         }
//     }


//     const onSubmit = async (e) => {
//         e.preventDefault();
//         setIsViewed(false);
//         const error = validationFunction();
//         setLoading(true);
//         if (error) {
//             return
//         } else {
//             try {
//                 const clientId = localStorage.getItem("saas_client_clientId");
//                 const payload = new FormData();
//                 payload.append("clientId", clientId);
//                 payload.append("businessUnit", businessUnit);
//                 payload.append("branchId", branchId);
//                 payload.append("icon", selectedFile);
//                 payload.append("name", name);
//                 payload.append("emailContact", emailContact);
//                 payload.append("contactNumber", contactNumber);
//                 payload.append("country", countryData?.countryName);
//                 payload.append("state", countryData?.stateName);
//                 payload.append("city", countryData?.cityName);
//                 payload.append("address", address);
//                 payload.append("ZipCode", ZipCode);

//                 if (id) {
//                     payload.append("warehouseId", id);
//                     const response = await warehouseService.updatewarehouse(payload)
//                     toast.success(response?.data?.message);
//                 } else {
//                     const response = await warehouseService.createWarehouse(payload);
//                     toast.success(response?.data?.message);
//                 }
//                 setCountryData((prev) => ({
//                     ...prev,
//                     countryISOCode: "",
//                     countryName: "",
//                     stateISOCode: "",
//                     stateName: "",
//                     cityName: "",
//                 }));
//                 setFormData({
//                     businessUnit: "",
//                     branchId: "",
//                     name: "",
//                     emailContact: "",
//                     contactNumber: "",
//                     country: "",
//                     city: "",
//                     state: "",
//                     address: "",
//                     ZipCode: "",
//                 });
//                 setFormDataErr({
//                     businessUnit: "",
//                     branchId: "",
//                     name: "",
//                     emailContact: "",
//                     contactNumber: "",
//                     country: "",
//                     city: "",
//                     state: "",
//                     address: "",
//                     ZipCode: "",
//                     icon: "",
//                 })
//                 setImgPreviwe(null);
//                 setselectedFile(null);
//                 setLoading(false);
//                 navigate("/warehouse-list");

//             } catch (error) {
//                 setLoading(false);
//                 toast.error(error?.response?.data?.message)
//                 console.log("error while creating / updating warehouse", error);
//             }
//         }
//     };
//     // -----setting the data if contain id ----------
//     useEffect(() => {
//         if (id) {
//             if (mode == "view") {
//                 setIsViewed(true)
//             } else {
//                 setIsViewed(false)
//             }
//             async function getBranch() {
//                 try {
//                     setPageLoading(true)
//                     const response = await warehouseService.getOne(id);
//                     console.log('Response get business unit', response?.data);
//                     const baseAddress = response?.data;
//                     setFormData((prev) => ({
//                         ...prev,
//                         businessUnit: baseAddress.businessUnit,
//                         branchId: baseAddress.branchId,
//                         name: baseAddress?.name,
//                         emailContact: baseAddress?.emailContact,
//                         contactNumber: baseAddress?.contactNumber,
//                         ZipCode: baseAddress?.ZipCode,
//                         address: baseAddress?.address,
//                     }));

//                     setImgPreviwe(`${baseAddress?.icon}`)

//                     const selectedCountry = Country?.getAllCountries()?.find((item) => item?.name == baseAddress?.country);
//                     const state = State.getStatesOfCountry(selectedCountry?.isoCode);

//                     const stateName = state?.find(
//                         (item) => item?.name === baseAddress?.state
//                     );

//                     setCountryData((prev) => ({
//                         ...prev,
//                         stateList: state,
//                         countryName: selectedCountry?.name,
//                         countryISOCode: selectedCountry?.isoCode,
//                         stateName: stateName?.name,
//                         stateISOCode: stateName?.isoCode,
//                         cityName: baseAddress?.city,
//                     }));

//                     setPageLoading(false)

//                 } catch (error) {
//                     setPageLoading(false)
//                     console.log("error in fetching vendor data");
//                 }
//             }
//             getBranch()
//         } else {
//             setPageLoading(false)
//         }
//     }, [id, countryList]);





//     useEffect(() => {
//         async function getActiveBusinessUnit() {
//             console.log("yess");

//             try {
//                 const response = await warehouseService.getActiveBusinessUnit();
//                 console.log("respone active", response);
//                 setActiveBusinessUnits(response?.data?.businessUnits)
//             } catch (error) {
//                 console.log("error while getting the active business unit", error);
//             }
//         }
//         getActiveBusinessUnit()
//     }, [])


//     const [isUserClicked, setIsUserClicked] = useState(true);





//     //------------- Allow only Numbers in contact number -------------
//     const handleKeyPress = (e) => {
//         const value = e.target.value;
//         const cleanedValue = value.replace(/[^0-9]/g, '');
//         if (cleanedValue.trim() !== "") {
//             if ((cleanedValue.match(/\./g) || []).length <= 1) {
//                 const formattedValue = cleanedValue.toLocaleString('en-US');
//                 e.target.value = formattedValue;
//             } else {
//                 e.target.value = cleanedValue.replace(/\.(?=.*\.)/g, '');
//             }
//         } else {
//             e.target.value = '';
//         }
//     }




//     const handleFileChange2 = (e) => {
//         const { name, value } = e.target;
//         setImgErr2("");
//         if (name === "tradeLicense") {
//             if (!selectedFile2 && value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     trandeLicense: "Trade License is required.",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     trandeLicense: "",
//                 }));
//             }
//         }
//         let fileSize = 0;

//         let errorCount = 0;

//         const file = e.target.files[0];

//         if (file) {
//             fileSize = file.size / 1024;

//             if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
//                 setImgErr2("Only images are allowed");

//                 errorCount++;
//             }

//             //check if filesize is not more than 1MB
//             if (fileSize > 1024) {
//                 setImgErr2("Image size should not be more than 1MB.");

//                 errorCount++;
//             }

//             if (errorCount === 0) {
//                 const imageAsBase64 = URL.createObjectURL(file);

//                 setSelectedFile2(file);

//                 setImgPreviwe2(imageAsBase64);
//             }
//         }

//     };



//     // handle file change
//     const handleFileChange = (e) => {
//         const { name, value } = e.target;
//         setImgErr("");
//         if (name === "profileImage") {
//             if (!selectedFile && value === "") {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     icon: "Logo is required.",
//                 }));
//             } else {
//                 setFormDataErr((prev) => ({
//                     ...prev,
//                     icon: "",
//                 }));
//             }
//         }
//         let fileSize = 0;

//         let errorCount = 0;

//         const file = e.target.files[0];

//         if (file) {
//             fileSize = file.size / 1024;

//             if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
//                 setImgErr("Only images are allowed");
//                 errorCount++;
//             }

//             //check if filesize is not more than 1MB
//             if (fileSize > 1024) {
//                 setImgErr("Image size should not be more than 1MB.");
//                 errorCount++;
//             }
//             if (errorCount === 0) {
//                 const imageAsBase64 = URL.createObjectURL(file);
//                 setselectedFile(file);
//                 setImgPreviwe(imageAsBase64);
//             }
//         }
//     };



//     const handleCloseLoadingModal = () => {
//         setShowLoadingModal(false);
//     };





//     return (

//         <>
//             {
//                 pageLoading ?
//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             height: "100vh",
//                             alignItems: "center",
//                             flexDirection: "column",
//                         }}
//                     >

//                         <div className="flex flex-col justify-center mt-5 items-center gap-2">
//                             <FormLoader />

//                         </div>

//                     </div>

//                     :
//                     <div>
//                         <Card>
//                             <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
//                                 {isUserClicked && (
//                                     <form onSubmit={onSubmit}>
//                                         <div className="grid lg:grid-cols-3 flex-col gap-3">
//                                             <div
//                                                 className={`fromGroup   ${formDataErr?.businessUnit !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <label htmlFor=" hh" className="form-label ">
//                                                     <p className="form-label">
//                                                         Business Unit <span className="text-red-500">*</span>
//                                                     </p>
//                                                 </label>
//                                                 <select
//                                                     name="businessUnit"
//                                                     value={businessUnit}
//                                                     onChange={handleChange}
//                                                     disabled={isViewed}
//                                                     className="form-control py-2  appearance-none relative flex-1"
//                                                 >
//                                                     <option value="">None</option>

//                                                     {activeBusinessUnits &&
//                                                         activeBusinessUnits?.map((item) => (
//                                                             <option value={item?._id} key={item?._id}>{item?.name}</option>
//                                                         ))}
//                                                 </select>
//                                                 {<p className="text-sm text-red-500">{formDataErr.businessUnit}</p>}
//                                             </div>

//                                             <div
//                                                 className={`fromGroup   ${formDataErr?.businessUnit !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <label htmlFor=" hh" className="form-label ">
//                                                     <p className="form-label">
//                                                         Branch <span className="text-red-500">*</span>
//                                                     </p>
//                                                 </label>
//                                                 <select
//                                                     name="branchId"
//                                                     value={branchId}
//                                                     onChange={handleChange}
//                                                     disabled={isViewed}
//                                                     className="form-control py-2  appearance-none relative flex-1"
//                                                 >
//                                                     <option value="">None</option>

//                                                     {activeBranches &&
//                                                         activeBranches?.map((item) => (
//                                                             <option value={item?._id} key={item?._id}>{item?.name}</option>
//                                                         ))}
//                                                 </select>
//                                                 {<p className="text-sm text-red-500">{formDataErr.branchId}</p>}
//                                             </div>

//                                             <label
//                                                 className={`fromGroup   ${formDataErr?.name !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <p className="form-label">
//                                                     Name <span className="text-red-500">*</span>
//                                                 </p>
//                                                 <input
//                                                     name="name"
//                                                     type="text"
//                                                     placeholder="Enter Name"
//                                                     value={name}
//                                                     onChange={handleChange}
//                                                     className="form-control py-2"
//                                                     disabled={isViewed}
//                                                 />
//                                                 {
//                                                     <p className="text-sm text-red-500">
//                                                         {formDataErr.name}
//                                                     </p>
//                                                 }
//                                             </label>
//                                             <label
//                                                 className={`fromGroup   ${formDataErr?.emailContact !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <p className="form-label">
//                                                     Contact Email <span className="text-red-500">*</span>
//                                                 </p>
//                                                 <input
//                                                     name="emailContact"
//                                                     type="email"
//                                                     placeholder="Enter Email"
//                                                     value={emailContact}
//                                                     onChange={handleChange}
//                                                     disabled={isViewed}

//                                                     className="form-control py-2"
//                                                 />
//                                                 {<p className="text-sm text-red-500">{formDataErr.emailContact}</p>}
//                                             </label>

//                                             <label
//                                                 className={`fromGroup   ${formDataErr?.contactNumber !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <p className=" form-label">
//                                                     Contact Number <span className="text-red-500">*</span>
//                                                 </p>
//                                                 <input
//                                                     name="contactNumber"
//                                                     type="text"
//                                                     placeholder="Enter contact number"
//                                                     value={contactNumber}
//                                                     onChange={handleChange}
//                                                     className="form-control py-2"
//                                                     disabled={isViewed}
//                                                     onInput={handleKeyPress}

//                                                 />
//                                                 {<p className="text-sm text-red-500">{formDataErr.contactNumber}</p>}
//                                             </label>

//                                             <div
//                                                 className={`fromGroup   ${formDataErr?.country !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <label htmlFor=" hh" className="form-label ">
//                                                     <p className="form-label">
//                                                         {" "}
//                                                         Country <span className="text-red-500">*</span>
//                                                     </p>
//                                                 </label>
//                                                 <select
//                                                     name="country"
//                                                     value={countryName}
//                                                     onChange={(e) => handleCountry(e)}
//                                                     disabled={isViewed}
//                                                     className="form-control py-2  appearance-none relative flex-1"
//                                                 >
//                                                     <option value="">None</option>
//                                                     {countryList &&
//                                                         countryList?.map((country) => (
//                                                             <option key={country?.isoCode}>
//                                                                 {country && country?.name}
//                                                             </option>
//                                                         ))}
//                                                 </select>
//                                                 {
//                                                     <p className="text-sm text-red-500">
//                                                         {formDataErr.country}
//                                                     </p>
//                                                 }
//                                             </div>

//                                             <div
//                                                 className={`fromGroup   ${formDataErr?.state !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <label htmlFor=" hh" className="form-label ">
//                                                     <p className="form-label">
//                                                         State <span className="text-red-500">*</span>
//                                                     </p>
//                                                 </label>
//                                                 <select
//                                                     name="state"
//                                                     value={stateName}
//                                                     onChange={(e) => handleState(e)}
//                                                     disabled={isViewed}
//                                                     className="form-control py-2  appearance-none relative flex-1"
//                                                 >
//                                                     <option value="">None</option>

//                                                     {stateList &&
//                                                         stateList?.map((state) => (
//                                                             <option key={state?.isoCode}>
//                                                                 {state && state?.name}
//                                                             </option>
//                                                         ))}
//                                                 </select>
//                                                 {<p className="text-sm text-red-500">{formDataErr.state}</p>}
//                                             </div>
//                                             <div
//                                                 className={`fromGroup   ${formDataErr?.city !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <label htmlFor=" hh" className="form-label ">
//                                                     <p className="form-label">
//                                                         City <span className="text-red-500">*</span>
//                                                     </p>
//                                                 </label>
//                                                 <select
//                                                     name="city"
//                                                     value={cityName}
//                                                     onChange={(e) => handleCity(e)}
//                                                     disabled={isViewed}
//                                                     className="form-control py-2  appearance-none relative flex-1"
//                                                 >
//                                                     <option value="">None</option>

//                                                     {cityList &&
//                                                         cityList?.map((city) => (
//                                                             <option key={city?.name}>{city && city?.name}</option>
//                                                         ))}
//                                                 </select>
//                                                 {<p className="text-sm text-red-500">{formDataErr.city}</p>}
//                                             </div>

//                                             {/* pin code */}

//                                             <label
//                                                 className={`fromGroup    ${formDataErr?.ZipCode !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <p className="form-label">
//                                                     Pin Code<span className="text-red-500">*</span>
//                                                 </p>
//                                                 <input
//                                                     name="ZipCode"
//                                                     type="text"
//                                                     placeholder="Enter ZipCode"
//                                                     value={ZipCode}
//                                                     onChange={handleChange}
//                                                     className="form-control py-2"
//                                                     disabled={isViewed}
//                                                 />
//                                                 {
//                                                     <p className="text-sm text-red-500">
//                                                         {formDataErr.ZipCode}
//                                                     </p>
//                                                 }
//                                             </label>

//                                             {/* address one */}
//                                             <label
//                                                 className={`fromGroup col-span-3   ${formDataErr?.address !== "" ? "has-error" : ""
//                                                     } `}
//                                             >
//                                                 <p className="form-label">
//                                                     Address<span className="text-red-500">*</span>
//                                                 </p>
//                                                 <textarea
//                                                     name="address"
//                                                     type="text"
//                                                     placeholder="Enter address"
//                                                     value={address}
//                                                     onChange={handleChange}
//                                                     className="form-control py-2"
//                                                     disabled={isViewed}
//                                                 />
//                                                 {
//                                                     <p className="text-sm text-red-500">
//                                                         {formDataErr.address}
//                                                     </p>
//                                                 }
//                                             </label>
//                                         </div>

//                                         <div
//                                             className={`fromGroup  mt-2  ${formDataErr?.icon !== "" ? "has-error" : ""
//                                                 } `}
//                                         >
//                                             <p className="form-label">
//                                                 Warehouse Logo
//                                                 <span className="text-red-500">*</span>
//                                             </p>

//                                             <label
//                                                 htmlFor={isViewed ? "" : "imageInput"}
//                                                 className="cursor-pointer"
//                                             >
//                                                 <div
//                                                     htmlFor="imageInput"
//                                                     className="flex flex-col items-center justify-between pl-3 form-control py-5"
//                                                 >
//                                                     <label
//                                                         htmlFor={isViewed ? "" : "imageInput"}
//                                                         className="cursor-pointer"
//                                                     >
//                                                         <img
//                                                             src={
//                                                                 imgPreview ? imgPreview : ProfileImage
//                                                             }
//                                                             alt="Default"
//                                                             className="w-20 h-20 object-cover rounded-md"
//                                                         />
//                                                     </label>
//                                                     <input
//                                                         name="profileImage"
//                                                         id="imageInput"
//                                                         type="file"
//                                                         className="hidden"
//                                                         accept="image/*"
//                                                         onChange={handleFileChange}
//                                                     />
//                                                     <span style={{ color: "red", fontSize: "0.7em" }}>
//                                                         {ImgErr}
//                                                     </span>
//                                                     <label
//                                                         htmlFor="imageInput"
//                                                         className="text-sm mt-2 text-gray-500 cursor-pointer"
//                                                     >
//                                                         <p
//                                                             className={`${isDark ? "text-secondary-300" : ""
//                                                                 }`}
//                                                         >
//                                                             click to upload logo
//                                                         </p>
//                                                     </label>{" "}
//                                                     {
//                                                         <p className="text-sm text-red-500">
//                                                             {formDataErr.icon}
//                                                         </p>
//                                                     }
//                                                 </div>
//                                             </label>
//                                         </div>

//                                         {
//                                             isViewed && (
//                                                 <div className="lg:col-span-2 col-span-1">
//                                                     <div className="flex justify-end py-5 ">
//                                                         <Button
//                                                             text="Edit"
//                                                             // className="border bg-blue-gray-300 rounded px-5 py-2"
//                                                             className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
//                                                             onClick={() => setIsViewed(false)}
//                                                             isLoading={loading}
//                                                         />
//                                                     </div>
//                                                 </div>


//                                             )
//                                         }

//                                         {
//                                             !isViewed && (
//                                                 <div className="lg:col-span-2 col-span-1">
//                                                     <div className="ltr:text-right rtl:text-left p-5">
//                                                         {showAddButton ? (
//                                                             <button
//                                                                 disabled={loading}
//                                                                 style={
//                                                                     loading
//                                                                         ? { opacity: "0.5", cursor: "not-allowed" }
//                                                                         : { opacity: "1" }
//                                                                 }
//                                                                 className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
//                                                             >
//                                                                 {loading
//                                                                     ? ""
//                                                                     : showAddButton && id
//                                                                         ? "Update"
//                                                                         : "Save"}
//                                                                 {loading && (
//                                                                     <>
//                                                                         <svg
//                                                                             className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 unset-classname`}
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             fill="none"
//                                                                             viewBox="0 0 24 24"
//                                                                         >
//                                                                             <circle
//                                                                                 className="opacity-25"
//                                                                                 cx="12"
//                                                                                 cy="12"
//                                                                                 r="10"
//                                                                                 stroke="currentColor"
//                                                                                 strokeWidth="4"
//                                                                             ></circle>
//                                                                             <path
//                                                                                 className="opacity-75"
//                                                                                 fill="currentColor"
//                                                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                                             ></path>
//                                                                         </svg>
//                                                                         Loading..
//                                                                     </>
//                                                                 )}
//                                                             </button>
//                                                         ) : (
//                                                             ""
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                             )
//                                         }


//                                     </form>
//                                 )}

//                             </div>
//                         </Card>
//                     </div>
//             }
//         </>

//     );
// };

// export default CreateWarehouse;



import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss";
import ProfileImage from "../../assets/images/users/user-4.jpg";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import Button from "@/components/ui/Button";

const CreateWarehouse = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const mode = location?.state?.name;
    const id = location?.state?.id;
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        businessUnit: "",
        branchId: "",
        name: "",
        emailContact: "",
        contactNumber: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",
    });

    const [formDataErr, setFormDataErr] = useState({
        businessUnit: "",
        branchId: "",
        name: "",
        emailContact: "",
        contactNumber: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",
        icon: "",
    });

    const {
        businessUnit,
        branchId,
        name,
        emailContact,
        contactNumber,
        houseOrFlat,
        streetOrLocality,
        landmark,
        country,
        city,
        state,
        address,
        ZipCode,
    } = formData;

    const [countryData, setCountryData] = useState({
        countryList: [],
        countryName: "",
        countryISOCode: "",
        stateList: [],
        stateName: "",
        stateISOCode: "",
        cityList: [],
        cityName: "",
    });

    const {
        countryList,
        countryName,
        countryISOCode,
        stateList,
        stateName,
        stateISOCode,
        cityList,
        cityName,
    } = countryData;

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [activeBranches, setActiveBranches] = useState([]);
    const [isViewed, setIsViewed] = useState(false);
    const [loading, setLoading] = useState(false);

    const [imgPreview, setImgPreview] = useState(null);
    const [imgErr, setImgErr] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();

    const validateField = (fieldName, value) => {
        const rules = {
            businessUnit: [[!value, "Business Unit is Required"]],
            branchId: [[!value, "Branch is Required"]],
            name: [
                [!value, "Name is Required"],
                [value && value.length <= 3, "Minimum 3 characters required"],
            ],
            emailContact: [
                [!value, "Email is Required"],
                [value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter valid Email"],
            ],
            contactNumber: [
                [!value, "Phone Number is Required"],
                [value && !/^[0-9]{10}$/.test(value), "Enter a valid 10-digit phone number"],
            ],
            country: [[!value, "Country is Required"]],
            state: [[!value, "State is Required"]],
            city: [[!value, "City is Required"]],
            ZipCode: [[!value, "Zip Code is Required"]],
            address: [[!value, "Address is Required"]],
        };
        return (rules[fieldName] || []).find(([condition]) => condition)?.[1] || "";
    };

    const validationFunction = () => {
        const errors = {
            businessUnit: validateField("businessUnit", businessUnit),
            branchId: validateField("branchId", branchId),
            name: validateField("name", name),
            emailContact: validateField("emailContact", emailContact),
            contactNumber: validateField("contactNumber", contactNumber),
            country: validateField("country", countryData.countryName),
            state: validateField("state", countryData.stateName),
            city: validateField("city", countryData.cityName),
            ZipCode: validateField("ZipCode", ZipCode),
            address: validateField("address", address),

        };
        setFormDataErr((prev) => ({ ...prev, ...errors }));
        return Object.values(errors).some((error) => error);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormDataErr((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleCountry = (e) => {
        const { value } = e.target;
        const selectedCountry = countryList.find((country) => country?.name === value);
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry.name,
                countryISOCode: selectedCountry.isoCode,
            }));
            setFormDataErr((prev) => ({ ...prev, country: validateField("country", selectedCountry.name) }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
            }));
            setFormDataErr((prev) => ({ ...prev, country: validateField("country", "") }));
        }
    };

    const handleState = (e) => {
        const { value } = e.target;
        const selectedState = stateList.find((state) => state?.name === value);
        if (selectedState) {
            setCountryData((prev) => ({
                ...prev,
                stateName: selectedState.name,
                stateISOCode: selectedState.isoCode,
            }));
            setFormDataErr((prev) => ({ ...prev, state: validateField("state", selectedState.name) }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                stateName: "",
                stateISOCode: "",
            }));
            setFormDataErr((prev) => ({ ...prev, state: validateField("state", "") }));
        }
    };

    const handleCity = (e) => {
        const { value } = e.target;
        setCountryData((prev) => ({ ...prev, cityName: value }));
        setFormDataErr((prev) => ({ ...prev, city: validateField("city", value) }));
    };

    useEffect(() => {
        setCountryData((prev) => ({ ...prev, countryList: Country.getAllCountries() }));
    }, []);

    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            stateList: State.getStatesOfCountry(countryISOCode),
        }));
    }, [countryISOCode]);

    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [countryISOCode, stateISOCode]);

    useEffect(() => {
        async function fetchActiveBusinessUnits() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                setActiveBusinessUnits(response?.data?.businessUnits || []);
            } catch (error) {
                console.log("Error fetching active business units", error);
            }
        }
        fetchActiveBusinessUnits();
    }, []);

    useEffect(() => {
        if (businessUnit) {
            async function fetchBranchesByBusiness() {
                try {
                    const response = await warehouseService.getBranchByBusiness(businessUnit);
                    setActiveBranches(response.data || []); 

                    if (!id) {
                        setFormData((prev) => {
                            return {
                                ...prev, branchId: ""
                            }
                        })
                    }

                } catch (error) {
                    console.log("Error fetching branches by business unit", error);
                }
            }
            fetchBranchesByBusiness();
        } else {
            setActiveBranches([]);
        }
    }, [businessUnit]);

    useEffect(() => {
        if (id) {
            if (mode === "view") setIsViewed(true);
            async function fetchWarehouse() {
                try {
                    setPageLoading(true);
                    const response = await warehouseService.getOne(id);
                    const fetchedData = response?.data;

                    setFormData((prev) => ({
                        ...prev,
                        businessUnit: fetchedData.businessUnit || "",
                        branchId: fetchedData.branchId || "",
                        name: fetchedData.name || "",
                        emailContact: fetchedData.emailContact || "",
                        contactNumber: fetchedData.contactNumber || "",
                        houseOrFlat: fetchedData.houseOrFlat || "",
                        streetOrLocality: fetchedData.streetOrLocality || "",
                        landmark: fetchedData.landmark || "",
                        ZipCode: fetchedData.ZipCode || "",
                        address: fetchedData.address || "",
                    }));

                    setImgPreview(fetchedData.icon || null);

                    const selectedCountry = Country.getAllCountries().find((c) => c.name === fetchedData.country);
                    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
                    const selectedState = states.find((s) => s.name === fetchedData.state);

                    setCountryData((prev) => ({
                        ...prev,
                        countryName: fetchedData.country || "",
                        countryISOCode: selectedCountry?.isoCode || "",
                        stateName: fetchedData.state || "",
                        stateISOCode: selectedState?.isoCode || "",
                        cityName: fetchedData.city || "",
                    }));

                    setPageLoading(false);
                } catch (error) {
                    setPageLoading(false);
                    console.log("Error fetching warehouse", error);
                }
            }
            fetchWarehouse();
        } else {
            setPageLoading(false);
        }
    }, [id, mode]);

    const handleFileChange = (e) => {
        setImgErr("");
        const file = e.target.files[0];
        let errorCount = 0;

        if (file) {
            const fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setImgErr("Image size should not exceed 1MB");
                errorCount++;
            }
            if (errorCount === 0) {
                const preview = URL.createObjectURL(file);
                setSelectedFile(file);
                setImgPreview(preview);
                setFormDataErr((prev) => ({ ...prev, icon: "" }));
            }
        } else if (!id) {
            setFormDataErr((prev) => ({ ...prev, icon: "Logo is required" }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const hasError = validationFunction();
        setLoading(true);
        if (hasError) {
            setLoading(false);
            return;
        }

        try {
            const clientId = localStorage.getItem("saas_client_clientId");
            const payload = new FormData();
            payload.append("clientId", clientId);
            payload.append("businessUnit", businessUnit);
            payload.append("branchId", branchId);
            payload.append("name", name);
            payload.append("emailContact", emailContact);
            payload.append("contactNumber", contactNumber);
            payload.append("houseOrFlat", houseOrFlat);
            payload.append("streetOrLocality", streetOrLocality);
            payload.append("landmark", landmark);
            payload.append("country", countryData.countryName);
            payload.append("state", countryData.stateName);
            payload.append("city", countryData.cityName);
            payload.append("address", address);
            payload.append("ZipCode", ZipCode);

            if (selectedFile) payload.append("icon", selectedFile);

            if (id) {
                payload.append("warehouseId", id);
                const response = await warehouseService.updatewarehouse(payload);
                toast.success(response?.data?.message || "Warehouse updated successfully");
            } else {
                const response = await warehouseService.createWarehouse(payload);
                toast.success(response?.data?.message || "Warehouse created successfully");
            }

            navigate("/warehouse-list");
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.log("Error submitting warehouse", error);
        }
    };

    return (
        <>
            {pageLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <FormLoader />
                </div>
            ) : (
                <div>
                    <div className={`p-6 ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
                        <form onSubmit={onSubmit}>
                            <div className="grid lg:grid-cols-3 gap-4 mb-6">
                                <div className={`space-y-1 ${formDataErr.businessUnit ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Business Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="businessUnit"
                                        value={businessUnit}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select Business Unit</option>
                                        {activeBusinessUnits.map((bu) => (
                                            <option key={bu._id} value={bu._id}>
                                                {bu.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formDataErr.businessUnit && <p className="text-sm">{formDataErr.businessUnit}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.branchId ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Branch <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="branchId"
                                        value={branchId}
                                        onChange={handleChange}
                                        disabled={isViewed || !businessUnit}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select Branch</option>
                                        {activeBranches.map((branch) => (
                                            <option key={branch._id} value={branch._id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formDataErr.branchId && <p className="text-sm">{formDataErr.branchId}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.name ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Warehouse Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter warehouse name"
                                        value={name}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.name && <p className="text-sm">{formDataErr.name}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.emailContact ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="emailContact"
                                        type="email"
                                        placeholder="Enter email"
                                        value={emailContact}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.emailContact && <p className="text-sm">{formDataErr.emailContact}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.contactNumber ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="contactNumber"
                                        type="text"
                                        placeholder="Enter 10-digit number"
                                        value={contactNumber}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                        maxLength="10"
                                    />
                                    {formDataErr.contactNumber && <p className="text-sm">{formDataErr.contactNumber}</p>}
                                </div>

                                {/* Optional Address Fields */}
                                <div className="space-y-1">
                                    <label className="form-label">House/Flat (Optional)</label>
                                    <input
                                        name="houseOrFlat"
                                        type="text"
                                        placeholder="e.g., Flat 101, Tower A"
                                        value={houseOrFlat}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="form-label">Street/Locality (Optional)</label>
                                    <input
                                        name="streetOrLocality"
                                        type="text"
                                        placeholder="e.g., MG Road"
                                        value={streetOrLocality}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="form-label">Landmark (Optional)</label>
                                    <input
                                        name="landmark"
                                        type="text"
                                        placeholder="e.g., Near Metro Station"
                                        value={landmark}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className={`space-y-1 ${formDataErr.country ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={countryName}
                                        onChange={handleCountry}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((c) => (
                                            <option key={c.isoCode}>{c.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.country && <p className="text-sm">{formDataErr.country}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.state ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={stateName}
                                        onChange={handleState}
                                        disabled={isViewed || !countryISOCode}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select State</option>
                                        {stateList.map((s) => (
                                            <option key={s.isoCode}>{s.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.state && <p className="text-sm">{formDataErr.state}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.city ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={cityName}
                                        onChange={handleCity}
                                        disabled={isViewed || !stateISOCode}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((c) => (
                                            <option key={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.city && <p className="text-sm">{formDataErr.city}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.ZipCode ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Pin Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="ZipCode"
                                        type="text"
                                        placeholder="Enter pin code"
                                        value={ZipCode}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.ZipCode && <p className="text-sm">{formDataErr.ZipCode}</p>}
                                </div>

                                <div className={`space-y-1 col-span-3 ${formDataErr.address ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        placeholder="Enter full address"
                                        value={address}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2 h-24"
                                    />
                                    {formDataErr.address && <p className="text-sm">{formDataErr.address}</p>}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-8">
                                {isViewed && (
                                    <Button
                                        text="Edit"
                                        onClick={() => setIsViewed(false)}
                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
                                    />
                                )}
                                {!isViewed && (
                                    <Button
                                        type="submit"
                                        text={id ? "Update" : "Save"}
                                        isLoading={loading}
                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateWarehouse;
