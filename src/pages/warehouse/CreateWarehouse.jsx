

// import React, { useState, useEffect } from "react";
// import { Country, State, City } from "country-state-city";
// import toast from "react-hot-toast";
// import useDarkMode from "@/hooks/useDarkMode";
// import { useLocation, useNavigate } from "react-router-dom";
// import "../../assets/scss/common.scss";
// import ProfileImage from "../../assets/images/users/user-4.jpg";
// import FormLoader from "@/Common/formLoader/FormLoader";
// import warehouseService from "@/services/warehouse/warehouse.service";
// import Button from "@/components/ui/Button";


// // map
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// const libraries = ["places"];

// const CreateWarehouse = () => {


//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_MAP_KEY}`,
//         libraries,
//     });

//     const [locationMap, setLocationMap] = useState({
//         lat: 28.613939,
//         lng: 77.209021,
//     });









//     const [isDark] = useDarkMode();
//     const location = useLocation();
//     const mode = location?.state?.name;
//     const id = location?.state?.id;
//     const [pageLoading, setPageLoading] = useState(true);

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
//         houseOrFlat,
//         streetOrLocality,
//         landmark,
//         country,
//         city,
//         state,
//         address,
//         ZipCode,
//     } = formData;

//     const [countryData, setCountryData] = useState({
//         countryList: [],
//         countryName: "",
//         countryISOCode: "",
//         stateList: [],
//         stateName: "",
//         stateISOCode: "",
//         cityList: [],
//         cityName: "",
//     });

//     const {
//         countryList,
//         countryName,
//         countryISOCode,
//         stateList,
//         stateName,
//         stateISOCode,
//         cityList,
//         cityName,
//     } = countryData;

//     const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
//     const [activeBranches, setActiveBranches] = useState([]);
//     const [isViewed, setIsViewed] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [imgPreview, setImgPreview] = useState(null);
//     const [imgErr, setImgErr] = useState("");
//     const [selectedFile, setSelectedFile] = useState(null);

//     const navigate = useNavigate();

//     const validateField = (fieldName, value) => {
//         const rules = {
//             businessUnit: [[!value, "Business Unit is Required"]],
//             branchId: [[!value, "Branch is Required"]],
//             name: [
//                 [!value, "Name is Required"],
//                 [value && value.length <= 3, "Minimum 3 characters required"],
//             ],
//             emailContact: [
//                 [!value, "Email is Required"],
//                 [value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter valid Email"],
//             ],
//             contactNumber: [
//                 [!value, "Phone Number is Required"],
//                 [value && !/^[0-9]{10}$/.test(value), "Enter a valid 10-digit phone number"],
//             ],
//             country: [[!value, "Country is Required"]],
//             state: [[!value, "State is Required"]],
//             city: [[!value, "City is Required"]],
//             ZipCode: [[!value, "Zip Code is Required"]],
//             address: [[!value, "Address is Required"]],
//         };
//         return (rules[fieldName] || []).find(([condition]) => condition)?.[1] || "";
//     };

//     const validationFunction = () => {
//         const errors = {
//             businessUnit: validateField("businessUnit", businessUnit),
//             branchId: validateField("branchId", branchId),
//             name: validateField("name", name),
//             emailContact: validateField("emailContact", emailContact),
//             contactNumber: validateField("contactNumber", contactNumber),
//             country: validateField("country", countryData.countryName),
//             state: validateField("state", countryData.stateName),
//             city: validateField("city", countryData.cityName),
//             ZipCode: validateField("ZipCode", ZipCode),
//             address: validateField("address", address),

//         };
//         setFormDataErr((prev) => ({ ...prev, ...errors }));
//         return Object.values(errors).some((error) => error);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setFormDataErr((prev) => ({ ...prev, [name]: validateField(name, value) }));
//     };

//     const handleCountry = (e) => {
//         const { value } = e.target;
//         const selectedCountry = countryList.find((country) => country?.name === value);
//         if (selectedCountry) {
//             setCountryData((prev) => ({
//                 ...prev,
//                 countryName: selectedCountry.name,
//                 countryISOCode: selectedCountry.isoCode,
//             }));
//             setFormDataErr((prev) => ({ ...prev, country: validateField("country", selectedCountry.name) }));
//         } else {
//             setCountryData((prev) => ({
//                 ...prev,
//                 countryName: "",
//                 countryISOCode: "",
//             }));
//             setFormDataErr((prev) => ({ ...prev, country: validateField("country", "") }));
//         }
//     };

//     const handleState = (e) => {
//         const { value } = e.target;
//         const selectedState = stateList.find((state) => state?.name === value);
//         if (selectedState) {
//             setCountryData((prev) => ({
//                 ...prev,
//                 stateName: selectedState.name,
//                 stateISOCode: selectedState.isoCode,
//             }));
//             setFormDataErr((prev) => ({ ...prev, state: validateField("state", selectedState.name) }));
//         } else {
//             setCountryData((prev) => ({
//                 ...prev,
//                 stateName: "",
//                 stateISOCode: "",
//             }));
//             setFormDataErr((prev) => ({ ...prev, state: validateField("state", "") }));
//         }
//     };

//     const handleCity = (e) => {
//         const { value } = e.target;
//         setCountryData((prev) => ({ ...prev, cityName: value }));
//         setFormDataErr((prev) => ({ ...prev, city: validateField("city", value) }));
//     };

//     useEffect(() => {
//         setCountryData((prev) => ({ ...prev, countryList: Country.getAllCountries() }));
//     }, []);

//     useEffect(() => {
//         setCountryData((prev) => ({
//             ...prev,
//             stateList: State.getStatesOfCountry(countryISOCode),
//         }));
//     }, [countryISOCode]);

//     useEffect(() => {
//         setCountryData((prev) => ({
//             ...prev,
//             cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
//         }));
//     }, [countryISOCode, stateISOCode]);

//     useEffect(() => {
//         async function fetchActiveBusinessUnits() {
//             try {
//                 const response = await warehouseService.getActiveBusinessUnit();
//                 setActiveBusinessUnits(response?.data?.businessUnits || []);
//             } catch (error) {
//                 console.log("Error fetching active business units", error);
//             }
//         }
//         fetchActiveBusinessUnits();
//     }, []);

//     useEffect(() => {
//         if (businessUnit) {
//             async function fetchBranchesByBusiness() {
//                 try {
//                     const response = await warehouseService.getBranchByBusiness(businessUnit);
//                     setActiveBranches(response.data || []);

//                     if (!id) {
//                         setFormData((prev) => {
//                             return {
//                                 ...prev, branchId: ""
//                             }
//                         })
//                     }

//                 } catch (error) {
//                     console.log("Error fetching branches by business unit", error);
//                 }
//             }
//             fetchBranchesByBusiness();
//         } else {
//             setActiveBranches([]);
//         }
//     }, [businessUnit]);

//     useEffect(() => {
//         if (id) {
//             if (mode === "view") setIsViewed(true);
//             async function fetchWarehouse() {
//                 try {
//                     setPageLoading(true);
//                     const response = await warehouseService.getOne(id);
//                     const fetchedData = response?.data;

//                     setFormData((prev) => ({
//                         ...prev,
//                         businessUnit: fetchedData.businessUnit || "",
//                         branchId: fetchedData.branchId || "",
//                         name: fetchedData.name || "",
//                         emailContact: fetchedData.emailContact || "",
//                         contactNumber: fetchedData.contactNumber || "",
//                         houseOrFlat: fetchedData.houseOrFlat || "",
//                         streetOrLocality: fetchedData.streetOrLocality || "",
//                         landmark: fetchedData.landmark || "",
//                         ZipCode: fetchedData.ZipCode || "",
//                         address: fetchedData.address || "",
//                     }));

//                     setImgPreview(fetchedData.icon || null);

//                     const selectedCountry = Country.getAllCountries().find((c) => c.name === fetchedData.country);
//                     const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
//                     const selectedState = states.find((s) => s.name === fetchedData.state);

//                     setCountryData((prev) => ({
//                         ...prev,
//                         countryName: fetchedData.country || "",
//                         countryISOCode: selectedCountry?.isoCode || "",
//                         stateName: fetchedData.state || "",
//                         stateISOCode: selectedState?.isoCode || "",
//                         cityName: fetchedData.city || "",
//                     }));

//                     setPageLoading(false);
//                 } catch (error) {
//                     setPageLoading(false);
//                     console.log("Error fetching warehouse", error);
//                 }
//             }
//             fetchWarehouse();
//         } else {
//             setPageLoading(false);
//         }
//     }, [id, mode]);

//     const handleFileChange = (e) => {
//         setImgErr("");
//         const file = e.target.files[0];
//         let errorCount = 0;

//         if (file) {
//             const fileSize = file.size / 1024;
//             if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
//                 setImgErr("Only images are allowed");
//                 errorCount++;
//             }
//             if (fileSize > 1024) {
//                 setImgErr("Image size should not exceed 1MB");
//                 errorCount++;
//             }
//             if (errorCount === 0) {
//                 const preview = URL.createObjectURL(file);
//                 setSelectedFile(file);
//                 setImgPreview(preview);
//                 setFormDataErr((prev) => ({ ...prev, icon: "" }));
//             }
//         } else if (!id) {
//             setFormDataErr((prev) => ({ ...prev, icon: "Logo is required" }));
//         }
//     };

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         const hasError = validationFunction();
//         setLoading(true);
//         if (hasError) {
//             setLoading(false);
//             return;
//         }

//         try {
//             const clientId = localStorage.getItem("saas_client_clientId");
//             const payload = new FormData();
//             payload.append("clientId", clientId);
//             payload.append("businessUnit", businessUnit);
//             payload.append("branchId", branchId);
//             payload.append("name", name);
//             payload.append("emailContact", emailContact);
//             payload.append("contactNumber", contactNumber);
//             payload.append("houseOrFlat", houseOrFlat);
//             payload.append("streetOrLocality", streetOrLocality);
//             payload.append("landmark", landmark);
//             payload.append("country", countryData.countryName);
//             payload.append("state", countryData.stateName);
//             payload.append("city", countryData.cityName);
//             payload.append("address", address);
//             payload.append("ZipCode", ZipCode);

//             if (selectedFile) payload.append("icon", selectedFile);

//             if (id) {
//                 payload.append("warehouseId", id);
//                 const response = await warehouseService.updatewarehouse(payload);
//                 toast.success(response?.data?.message || "Warehouse updated successfully");
//             } else {
//                 const response = await warehouseService.createWarehouse(payload);
//                 toast.success(response?.data?.message || "Warehouse created successfully");
//             }

//             navigate("/warehouse-list");
//         } catch (error) {
//             setLoading(false);
//             toast.error(error?.response?.data?.message || "Something went wrong");
//             console.log("Error submitting warehouse", error);
//         }
//     };

//     return (
//         <>
//             {pageLoading ? (
//                 <div className="flex justify-center items-center h-screen">
//                     <FormLoader />
//                 </div>
//             ) : (
//                 <div>


//                     {isLoaded ? (
//                         <GoogleMap
//                             zoom={18}
//                             center={locationMap}
//                             mapContainerStyle={{ height: "400px", width: "100%" }}
//                             onClick={(e) =>
//                                 setLocationMap({
//                                     lat: e.latLng.lat(),
//                                     lng: e.latLng.lng(),
//                                 })
//                             }
//                         >
//                             <Marker
//                                 position={locationMap}
//                                 draggable={true}
//                                 onDragEnd={(e) =>
//                                     setLocationMap({
//                                         lat: e.latLng.lat(),
//                                         lng: e.latLng.lng(),
//                                     })
//                                 }
//                             />
//                         </GoogleMap>
//                     ) : (
//                         <div>Loading Map...</div>
//                     )}

//                     <div style={{ marginTop: 10 }}>
//                         <strong>Latitude:</strong> {locationMap.lat}<br />
//                         <strong>Longitude:</strong> {locationMap.lng}
//                     </div>



//                     <div className={`p-6 ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
//                         <form onSubmit={onSubmit}>
//                             <div className="grid lg:grid-cols-3 gap-4 mb-6">
//                                 <div className={`space-y-1 ${formDataErr.businessUnit ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Business Unit <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         name="businessUnit"
//                                         value={businessUnit}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     >
//                                         <option value="">Select Business Unit</option>
//                                         {activeBusinessUnits.map((bu) => (
//                                             <option key={bu._id} value={bu._id}>
//                                                 {bu.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {formDataErr.businessUnit && <p className="text-sm">{formDataErr.businessUnit}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.branchId ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Branch <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         name="branchId"
//                                         value={branchId}
//                                         onChange={handleChange}
//                                         disabled={isViewed || !businessUnit}
//                                         className="form-control py-2"
//                                     >
//                                         <option value="">Select Branch</option>
//                                         {activeBranches.map((branch) => (
//                                             <option key={branch._id} value={branch._id}>
//                                                 {branch.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {formDataErr.branchId && <p className="text-sm">{formDataErr.branchId}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.name ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Warehouse Name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         name="name"
//                                         type="text"
//                                         placeholder="Enter warehouse name"
//                                         value={name}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                     {formDataErr.name && <p className="text-sm">{formDataErr.name}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.emailContact ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Contact Email <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         name="emailContact"
//                                         type="email"
//                                         placeholder="Enter email"
//                                         value={emailContact}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                     {formDataErr.emailContact && <p className="text-sm">{formDataErr.emailContact}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.contactNumber ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Contact Number <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         name="contactNumber"
//                                         type="text"
//                                         placeholder="Enter 10-digit number"
//                                         value={contactNumber}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                         maxLength="10"
//                                     />
//                                     {formDataErr.contactNumber && <p className="text-sm">{formDataErr.contactNumber}</p>}
//                                 </div>

//                                 {/* Optional Address Fields */}
//                                 <div className="space-y-1">
//                                     <label className="form-label">House/Flat (Optional)</label>
//                                     <input
//                                         name="houseOrFlat"
//                                         type="text"
//                                         placeholder="e.g., Flat 101, Tower A"
//                                         value={houseOrFlat}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                 </div>

//                                 <div className="space-y-1">
//                                     <label className="form-label">Street/Locality (Optional)</label>
//                                     <input
//                                         name="streetOrLocality"
//                                         type="text"
//                                         placeholder="e.g., MG Road"
//                                         value={streetOrLocality}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                 </div>

//                                 <div className="space-y-1">
//                                     <label className="form-label">Landmark (Optional)</label>
//                                     <input
//                                         name="landmark"
//                                         type="text"
//                                         placeholder="e.g., Near Metro Station"
//                                         value={landmark}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.country ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Country <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         value={countryName}
//                                         onChange={handleCountry}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     >
//                                         <option value="">Select Country</option>
//                                         {countryList.map((c) => (
//                                             <option key={c.isoCode}>{c.name}</option>
//                                         ))}
//                                     </select>
//                                     {formDataErr.country && <p className="text-sm">{formDataErr.country}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.state ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         State <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         value={stateName}
//                                         onChange={handleState}
//                                         disabled={isViewed || !countryISOCode}
//                                         className="form-control py-2"
//                                     >
//                                         <option value="">Select State</option>
//                                         {stateList.map((s) => (
//                                             <option key={s.isoCode}>{s.name}</option>
//                                         ))}
//                                     </select>
//                                     {formDataErr.state && <p className="text-sm">{formDataErr.state}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.city ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         City <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         value={cityName}
//                                         onChange={handleCity}
//                                         disabled={isViewed || !stateISOCode}
//                                         className="form-control py-2"
//                                     >
//                                         <option value="">Select City</option>
//                                         {cityList.map((c) => (
//                                             <option key={c.name}>{c.name}</option>
//                                         ))}
//                                     </select>
//                                     {formDataErr.city && <p className="text-sm">{formDataErr.city}</p>}
//                                 </div>

//                                 <div className={`space-y-1 ${formDataErr.ZipCode ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Pin Code <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         name="ZipCode"
//                                         type="text"
//                                         placeholder="Enter pin code"
//                                         value={ZipCode}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2"
//                                     />
//                                     {formDataErr.ZipCode && <p className="text-sm">{formDataErr.ZipCode}</p>}
//                                 </div>

//                                 <div className={`space-y-1 col-span-3 ${formDataErr.address ? "text-red-500" : ""}`}>
//                                     <label className="form-label">
//                                         Address <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea
//                                         name="address"
//                                         placeholder="Enter full address"
//                                         value={address}
//                                         onChange={handleChange}
//                                         disabled={isViewed}
//                                         className="form-control py-2 h-24"
//                                     />
//                                     {formDataErr.address && <p className="text-sm">{formDataErr.address}</p>}
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end gap-4 mt-8">
//                                 {isViewed && (
//                                     <Button
//                                         text="Edit"
//                                         onClick={() => setIsViewed(false)}
//                                         className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
//                                     />
//                                 )}
//                                 {!isViewed && (
//                                     <Button
//                                         type="submit"
//                                         text={id ? "Update" : "Save"}
//                                         isLoading={loading}
//                                         className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
//                                     />
//                                 )}
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
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

// map
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const CreateWarehouse = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_MAP_KEY}`,
        libraries,
    });

    const [locationMap, setLocationMap] = useState({
        lat: 28.613939,
        lng: 77.209021,
    });

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

                    setLocationMap({
                        lat: fetchedData.latitude || 28.613939,
                        lng: fetchedData.longitude || 77.209021,
                    });

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

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationMap({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error(error);
                    toast.error("Unable to retrieve your location");
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser");
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
            payload.append("latitude", locationMap.lat);
            payload.append("longitude", locationMap.lng);

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

                             {!isViewed && (
                        <Button
                            text="Capture Current Location"
                            onClick={handleGetCurrentLocation}
                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center mb-4`}
                        />
                    )}
                    {isLoaded ? (
                        <GoogleMap
                            zoom={18}
                            center={locationMap}
                            mapContainerStyle={{ height: "400px", width: "100%" }}
                            onClick={!isViewed ? (e) =>
                                setLocationMap({
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng(),
                                }) : null
                            }
                            options={{
                                gestureHandling: isViewed ? 'none' : 'greedy',
                            }}
                        >
                            <Marker
                                position={locationMap}
                                draggable={!isViewed}
                                onDragEnd={(e) =>
                                    setLocationMap({
                                        lat: e.latLng.lat(),
                                        lng: e.latLng.lng(),
                                    })
                                }
                            />
                        </GoogleMap>
                    ) : (
                        <div>Loading Map...</div>
                    )}

                    <div style={{ marginTop: 10 }}>
                        <strong>Latitude:</strong> {locationMap.lat}<br />
                        <strong>Longitude:</strong> {locationMap.lng}
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
