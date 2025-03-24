import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import UserAvatar from "@/assets/images/all-img/user.png";
import ProfileImage from "@/assets/images/users/user-1.jpg";

import Flatpickr from "react-flatpickr";
import Select from "react-select";
import Radio from "@/components/ui/Radio";
import ViewProfile from "./viewProfile";
import axios from "axios";

import stateService from "@/services/state-service";
import cityService from "@/services/city-service";
import { setState } from "@/store/api/auth/stateSlice";
import { useDispatch } from "react-redux";
import Icon from "@/components/ui/Icon";
import service from "../../services/authService";

import "../../assets/scss/components/custome.css";

import { setProfile } from "@/store/api/auth/peofileSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";






const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const FormValidationSchema = yup
  .object({

  })
  .required();

const profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImgErr, setProfileImgErr] = useState("");
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState("");
  const [removeProfileImg, setRemoveProfileImg] = useState(false);
  // const [refresh, setRefresh] = useState(0);

  const [stateArray, setStateArray] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  // const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [dob, setDob] = useState(null);

  const [selectgender, setSelectGender] = useState("");
  const [selectMaritalStatus, setSelectMaritalStatus] = useState("");

  const [currentUser, setCurrentUser] = useState({});


  // const { stateList } = useSelector((state) => state.states);
  const store = useSelector((state) => state);
  console.log("store",store);
  

  const { profileData: profile, profileExists } = useSelector(
    (state) => state.profile
  );
 console.log("profile",profile);
 console.log("profileImgPreview",profileImgPreview);
 
  


  // console.log("profile",profile);
  // console.log("profileExists",profileExists);





  const gender = [
    {
      value: "Male",
      label: "Male",
      activeClass: "ring-primary-500 border-primary-500",
    },
    {
      value: "Female",
      label: "Female",
      activeClass: "ring-danger-500 border-danger-500",
    },
    {
      value: "Other",
      label: "Other",
      activeClass: "ring-info-500 border-info-500",
    },
  ];

  const [inputError, setInputError] = useState(
    {
      firstNameErr: "",
      lastNameErr: "",
      emailErr: "",
      phoneErr: "",
      dobErr: "",
      genderErr: "",
      cityErr: "",
      stateErr: "",
      countryErr: ""

    }
  );


  const { firstNameErr, lastNameErr, phoneErr, dobErr, genderErr, cityErr, stateErr, countryErr } = inputError

  // const [firstNameErr, setFirstNameErr] = useState("");
  // const [lastNameErr, setLastNameErr] = useState("");
  // const [emailErr, setemailErr] = useState("");
  // const [phoneErr, setphoneErr] = useState("");
  // const [dobErr, setDobErr] = useState("");
  // const [genderErr, setGenderErr] = useState("");
  // const [cityErr, setCityErr] = useState("");
  // const [stateErr, setStateErr] = useState("");
  // const [countryErr, setCountryErr] = useState("");
  const [loading, setLoading] = useState(false);


  console.log("cityErr", cityErr);




  const [countryData, setCountryData] = useState({
    countryList: "",
    countryName: "",
    countryISOCode: "",
    CountryISDCode: "",
    stateList: "",
    stateName: "",
    stateISOCode: "",
    cityList: "",
    cityName: "",
  });
  const {
    countryList,
    countryName,
    countryISOCode,
    CountryISDCode,
    stateList,
    stateName,
    stateISOCode,
    cityList,
    cityName,
  } = countryData;

  console.log("countryData123", countryData);


  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    clearErrors,
  } = useForm({
    mode: "all",
    resolver: yupResolver(FormValidationSchema),
  });

  const handleImageChange = (event) => {
    setProfileImgErr("");

    let fileSize = 0;

    let errorCount = 0;

    const file = event.target.files[0];

    if (file) {
      fileSize = file.size / 1024;

      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setProfileImgErr("only img is allowed");

        errorCount++;
      }

      //check if filesize is not more than 1MB
      if (fileSize > 1024) {
        setProfileImgErr("img size should be less than 1 MB.");

        errorCount++;
      }

      if (errorCount === 0) {
        const imageAsBase64 = URL.createObjectURL(file);
        

        setSelectedProfileImg(file);

        setProfileImgPreview(imageAsBase64);

        setRemoveProfileImg(false);
      }
    }
  };


  const handleGender = (e) => {
    setSelectGender(e.target.value);
  };

  // ------ Handling the Country Name & ISOCode & ISDCode
  const handleCountry = (e) => {
    const { name, value } = e.target;
    const selectedCountry = countryList.find(
      (country) => country?.name === value
    );
    if (name == "country") {
      if (value == "") {
        // setCountryErr("Country Is Required.")
        setInputError((prev) => ({ ...prev, countryErr: 'Country Is Required.' }))
      } else {
        setInputError((prev) => ({ ...prev, countryErr: '' }))

      }
    }
    if (selectedCountry) {
      setCountryData((prev) => ({
        ...prev,
        countryName: selectedCountry?.name,
        countryISOCode: selectedCountry?.isoCode,
        CountryISDCode: selectedCountry?.phonecode,
        // stateList: "",
        // stateName: "",
        // stateISOCode: "",
        // cityList: "",
        // cityName: "",
      }));


    }
    // setCountryData((prev) => ({
    //   ...prev,
    //   countryName: value,
    // }));
  };
  // ----- Handling the state name as per the country name
  const handleState = (e) => {
    const { name, value } = e.target;
    const selectedState = stateList.find((state) => state?.name === value);
    if (name == "state") {
      if (value == "") {
        setInputError((prev) => ({ ...prev, stateErr: "State Is Required." }))
      } else {
        // setStateErr("")
        setInputError((prev) => ({ ...prev, stateErr: "" }))

      }
    }
    if (selectedState) {
      setCountryData((prev) => ({
        ...prev,
        stateName: selectedState?.name,
        stateISOCode: selectedState?.isoCode,
      }));
    }
  };
  // ----- Handling the city name as per the state name
  const handleCity = (e) => {
    const { name, value } = e.target;
    if (name == "city") {
      if (value == "") {
        setInputError((prev) => ({ ...prev, cityErr: "City Is Required." }))
      } else {
        setInputError((prev) => ({ ...prev, cityErr: "" }))

      }
    }
    setCountryData((prev) => ({
      ...prev,
      cityName: value,
    }));
  };
  useEffect(() => {
    setCountryData((prev) => ({
      ...prev,
      countryList: Country.getAllCountries(),
      stateList: State.getStatesOfCountry(countryISOCode),
      cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
    }));
  }, [countryISOCode, stateISOCode, profile]);

  useEffect(() => {
    if (profile) {
      setCurrentUser(profile);
      setSelectMaritalStatus(profile?.maritalStatus);
      setSelectGender(profile?.gender);
      setProfileImgPreview(`${profile.profileImage}`);
      if (profile?.dateOfBirth) {
        setDob(profile?.dateOfBirth);
      }
      const data = JSON.parse(localStorage.getItem("adminInfo"));
      
      const selectedCountry = Country?.getAllCountries()?.find((item) => item?.isoCode == profile?.country)
      const state = State.getStatesOfCountry(profile?.country);
      const stateName = state?.find(
        (item) => item?.isoCode === profile?.state
      );
      setCountryData((prev) => ({
        ...prev,
        countryName: selectedCountry?.name,
        countryISOCode: profile?.country,
        stateName: stateName?.name,
        stateISOCode: profile?.state,
        cityName: profile?.city,
      }));
    }
  }, []);









  // const selectedCountry = Country?.find(
  //   (country) => country.name == data?.country
  // );


  function handleInputChange(event) {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
  }
  console.log("currentUser",currentUser);


  //validation handler
  const handleValidation = (event) => {
    const inputValue = event.target.value.trim();
    const { name, value } = event.target
    const inputFieldName = event.target.name;

    //set error message for firstName
    if (inputFieldName === "firstName") {
      if (value == "") {
        setInputError((prev) => ({ ...prev, firstNameErr: "First Name Is Required." }))
      } else {
        setInputError((prev) => ({ ...prev, firstNameErr: "" }))
      }
    }


    if (inputFieldName === "lastName") {
      if (value == "") {
        setInputError((prev) => ({ ...prev, lastNameErr: "Last Name Is Required." }))
      } else {
        setInputError((prev) => ({ ...prev, lastNameErr: "" }))
      }
    }


    //set error message for  email
    if (inputFieldName === "email") {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!emailRegex.test(inputValue) || inputValue.length === 0) {
        setInputError((prev) => ({ ...prev, emailErr: "Enter A Valid Email." }))

      } else {
        setInputError((prev) => ({ ...prev, emailErr: "" }))

      }
    }

    //set error message for  phone
    if (inputFieldName === "phone") {
      const phoneRegex = /^[0-9]{10}$/; // Adjust pattern based on your phone number format needs

      if (!phoneRegex.test(inputValue) || inputValue.length === 0) {
        setInputError((prev) => ({ ...prev, phoneErr: "Enter a valid phone number." }));
      } else {
        setInputError((prev) => ({ ...prev, phoneErr: "" }));
      }
    }





  };

  function formatDateToISO(date) {
    // Extract year, month, and day components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    // Format components into the desired string format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  // submit all data
  async function handleSubmitData(e) {
    e.preventDefault();
    let errorCount = 0;
    setLoading(true);
    const formData = new FormData();

    const errorObject = {
      firstNameErr: "",
      lastNameErr: "",
      emailErr: "",
      phoneErr: "",
      dobErr: "",
      genderErr: "",
      cityErr: "",
      stateErr: "",
      countryErr: ""

    };

    
    



    // firstName error
    if (
      currentUser.firstName === "" ||
      currentUser.firstName === null
    ) {
      // setFirstNameErr("First Name IS Required.");

      errorObject.firstNameErr = "First Name IS Required."

      errorCount++;
    } else {

      formData.append("firstName", currentUser.firstName);

      errorObject.firstNameErr = ""


    }

    // lastName error
    if (
      currentUser.lastName === "" ||
      currentUser.lastName === null ||
      currentUser.lastName === undefined
    ) {

      errorObject.lastNameErr = "Last Name Is Required."
      errorCount++;
    } else {
      formData.append("lastName", currentUser.lastName);
      errorObject.lastNameErr = ""

    }

    // gender error
    if (
      currentUser.gender === "" ||
      currentUser.gender === null ||
      currentUser.gender === undefined
    ) {
      errorCount++;
      errorObject.genderErr = "Gender Is Required."
    } else {

      formData.append("gender", currentUser.gender);

      errorObject.genderErr = ""

    }

    // DOB error
    if (
      currentUser.dateOfBirth === "" ||
      currentUser.dateOfBirth === null ||
      currentUser.dateOfBirth === undefined
    ) {
      errorCount++;

      errorObject.dobErr = "Dob Is Required."


    } else {
      formData.append("dateOfBirth", currentUser.dateOfBirth);
      // setDobErr("");
      errorObject.dobErr = ""

    }

    // city error
    console.log("aatif", cityName);

    if (cityName === "" || cityName === null || cityName === undefined) {
      console.log("aaaaaaaaaa");

      errorCount++;
      // setCityErr("City Is Required.");

      errorObject.cityErr = "City Is Required."


    } else {
      formData.append("city", cityName);
      errorObject.cityErr = ""

    }

    // Country error
    if (
      countryName === "" ||
      countryName === null ||
      countryName === undefined
    ) {
      errorCount++;
      errorObject.countryErr = "County Is Required."
    } else {
      formData.append("country", countryISOCode);
      errorObject.countryErr = ""

    }

    // state error
    if (stateName === "" || stateName === null || stateName === undefined) {
      errorCount++;
      // setStateErr("State Is Required.");
      errorObject.stateErr = "State Is Required."
    } else {
      formData.append("state", stateISOCode);
      // setStateErr("");
      errorObject.stateErr = ""

    }

    //  Phone error

    if (
      currentUser.phone === "" ||
      currentUser.phone === null ||
      currentUser.phone === undefined
    ) {
      errorCount++;
      errorObject.phoneErr = "Phone Number Is Required."
    } else {
      formData.append("phone", currentUser.phone);
      // setphoneErr("");
      errorObject.phoneErr = ""

    }


    if (profileImgErr !== "") {
      errorCount++;
    } else {
      if (selectedProfileImg) {
        formData.append("profileImage", selectedProfileImg);
      }
    }


    setInputError(errorObject)


    if (errorCount > 0) {
      setLoading(false);
      return;
    } else {
      await service.updateProfile(formData)
        .then((res) => {
          console.log("res123",res);
          
          dispatch(setProfile(res.data));
          navigate("/viewProfile");
          toast.success("Profile Updated Successfully..");
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error while creating profile",error);
          
        });
    }
  }
  
  


  const handleKeyPress = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, '');
    if (cleanedValue.trim() !== "") {
      if ((cleanedValue.match(/\./g) || []).length <= 1) {
        const formattedValue = cleanedValue.toLocaleString('en-US');
        e.target.value = formattedValue;
      } else {
        e.target.value = cleanedValue.replace(/\.(?=.*\.)/g, '');
      }
    } else {
      e.target.value = '';
    }
  }

  console.log("profileImgPreview",profileImgPreview);
  


  return (
    <>
      <Card>
        <form
          // onSubmit={handleSubmitData}
          className="grid gap-5 grid-cols-1 md:grid-cols-2"
        >
          <div className="flex flex-col items-center justify-center">
            {/* <img src={ProfileImage} alt="" /> */}
            {" "}
            {/* Updated line */}
            <label htmlFor="imageInput" className="cursor-pointer">
              <img
                src={profileImgPreview !== "null" ? profileImgPreview : ProfileImage}
                alt="Default"
                className="w-16 h-16 object-cover rounded-full"
              />
            </label>
            <input
              id="imageInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
            <span style={{ color: "red", fontSize: "0.7em" }}>
              {profileImgErr}
            </span>
            <label
              htmlFor="imageInput"
              className="text-sm mt-2 text-gray-500 cursor-pointer"
            >
              Select
            </label>{" "}
            {/* New line */}
          </div>

          <div
            className={`fromGroup  ${firstNameErr !== "" ? "has-error" : ""} `}
          >
            <label htmlFor="firstName" className="mb-1">
              First Name
            </label>
            <div className=" flex-1">
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                className={`form-control py-2`}
                value={currentUser.firstName ? currentUser.firstName : ""}
                //  className="form-control py-2"
                onChange={handleInputChange}
                onKeyUp={handleValidation}
              />
              <div
                style={{ top: "47%" }}
                className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse"
              >
                {firstNameErr !== "" && (
                  <span className="text-danger-500">
                    <Icon icon="heroicons-outline:information-circle" />
                  </span>
                )}
              </div>
            </div>
            {firstNameErr !== "" && (
              <div className={` mt-2 text-danger-500 block text-sm `}>
                {firstNameErr}
              </div>
            )}
          </div>

          <div
            className={`fromGroup   ${lastNameErr !== "" ? "has-error" : ""} `}
          >
            <label htmlFor="lastName" className="">
             Last Name
            </label>
            <div className=" flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Enter Last Name Here.."
                className="form-control py-2"
                onChange={handleInputChange}
                onKeyUp={handleValidation}
                value={currentUser.lastName ? currentUser.lastName : ""}
              />
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2  -translate-y-1/2   space-x-1 rtl:space-x-reverse">
                {lastNameErr !== "" && (
                  <span className="text-danger-500">
                    <Icon icon="heroicons-outline:information-circle" />
                  </span>
                )}
              </div>
            </div>
            {lastNameErr !== "" && (
              <div className={` mt-2 text-danger-500 block text-sm `}>
                {lastNameErr}
              </div>
            )}

          </div>

          <div
            className="flex flex-wrap space-xy-5"
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "1.4em",
            }}
          >
            <label
              htmlFor="maritalStatus"
              className={`${genderErr !== "" ? "radioErrStyle" : ""}`}
              style={{ marginTop: "-10px" }}
            >
             Gender :
            </label>
            {/* {genderErr !== "" && (
              <div
                className={` mt-2 text-danger-500 block text-sm `}
              >
                {genderErr}
              </div>
            )} */}
            {gender.map((gender, index) => (
              <Radio
                key={index}
                label={gender.label}
                name="gender"
                value={gender.value}
                checked={selectgender === gender.value}
                onChange={(e) => {
                  handleGender(e);
                  handleInputChange(e);
                }}
                activeClass={gender.activeClass}
              />
            ))}
          </div>

          <div className={`fromGroup   ${dobErr !== "" ? "has-error" : ""} `}>
            <label className="" htmlFor="hf-picker">
             Date Of Birth
            </label>
            <Flatpickr
              // value="1998-01-12"
              value={dob ? dob : ""}
              id="hf-picker"
              className="form-control py-2 "
              onChange={(date) => {
                setCurrentUser({
                  ...currentUser,
                  ["dateOfBirth"]: formatDateToISO(date[0]),
                });
                // setDobErr("");
                setInputError((prev) => ({ ...prev, dobErr: "" }))
              }}
              onOpen={() => {
                if (!currentUser.dateOfBirth) {
                  // setDobErr("This Field Is Required.");
                  setInputError((prev) => ({ ...prev, dobErr: "Dob Is Required." }))

                }
              }}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
              }}
            />
            <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2   -translate-y-1/2   space-x-1 rtl:space-x-reverse">
              {dobErr !== "" && (
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              )}
            </div>
            {dobErr !== "" && (
              <div className={` mt-2 text-danger-500 block text-sm `}>
                {dobErr}
              </div>
            )}
          </div>

          <div className={`fromGroup   ${phoneErr !== "" ? "has-error" : ""} `}>
            <label htmlFor="phone" className="mb-1">
              Contact Number
            </label>
            <div className=" flex-1">
              <input
                type="text"
                name="phone"
                placeholder="Enter Contact Phone Number Here.."
                className="form-control py-2"
                onChange={handleInputChange}
                onKeyUp={handleValidation}
                onInput={handleKeyPress}
                value={currentUser.phone ? currentUser.phone : ""}
              />
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2   -translate-y-1/2   space-x-1 rtl:space-x-reverse">
                {phoneErr !== "" && (
                  <span className="text-danger-500">
                    <Icon icon="heroicons-outline:information-circle" />
                  </span>
                )}
              </div>
            </div>
            {phoneErr !== "" && (
              <div className={` mt-2 text-danger-500 block text-sm `}>
                {phoneErr}
              </div>
            )}
          </div>


          {/* country */}
          <div
            className={`fromGroup   ${countryErr !== "" ? "has-error" : ""
              } `}
          >
            <label htmlFor=" hh" className="form-label ">
              <p className="form-label">
                Country <span className="text-red-500">*</span>
              </p>
            </label>
            <select
              name="country"
              value={countryName}
              onChange={(e) => handleCountry(e)}
              className="form-control py-2  appearance-none relative flex-1"
            >
              <option value="">None</option>

              {countryList &&
                countryList?.map((country) => (
                  <option key={country?.isoCode}>
                    {country && country?.name}
                  </option>
                ))}
            </select>
            {<p className="text-sm text-red-500">{countryErr}</p>}

          </div>

          {/* state */}
          <div
            className={`fromGroup   ${stateErr !== "" ? "has-error" : ""
              } `}
          >
            <label htmlFor=" hh" className="form-label ">
              <p className="form-label">
                State <span className="text-red-500">*</span>
              </p>
            </label>
            <select
              name="state"
              value={stateName}
              onChange={(e) => handleState(e)}
              className="form-control py-2  appearance-none relative flex-1"
            >
              <option value="">None</option>

              {stateList &&
                stateList?.map((state) => (
                  <option key={state?.isoCode}>{state && state?.name}</option>
                ))}
            </select>
            {<p className="text-sm text-red-500">{stateErr}</p>}

          </div>


          {/* city */}
          <div
            className={`fromGroup   ${cityErr !== "" ? "has-error" : ""
              } `}
          >
            <label htmlFor=" hh" className="form-label ">
              <p className="form-label">
                City <span className="text-red-500">*</span>
              </p>
            </label>
            <select
              name="city"
              value={cityName}
              onChange={(e) => handleCity(e)}
              className="form-control py-2  appearance-none relative flex-1"
            >
              <option value="">None</option>

              {cityList &&
                cityList?.map((city) => (
                  <option key={city?.name}>{city && city?.name}</option>
                ))}
            </select>
            {<p className="text-sm text-red-500">{cityErr}</p>}

          </div>

          <div className="lg:col-span-2 col-span-1">
            <div className="ltr:text-right rtl:text-left">
              <button
                type="submit"
                // className="btn btn-dark text-center"
                onClick={handleSubmitData}
                disabled={loading}
                // isLoading={loading}
                style={
                  loading
                    ? { opacity: "0.5", cursor: "not-allowed" }
                    : { opacity: "1" }
                }
                className={`bg-lightLoginBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center `}
              >
                {loading ? "" : `${profileExists ? "Update" : "Save"}`}
                {loading && (
                  <>
                    <svg
                      className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 unset-classname`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                   Loading
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Card>
      {/* <ViewProfile /> */}
    </>
  );
};

export default profile;
