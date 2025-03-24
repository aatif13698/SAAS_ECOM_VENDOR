


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

import Cleave from "cleave.js/react";





// option "unmarried", "married", "widow", "divorced", "other"
const colors = [
  {
    value: "unmarried",
    label: "Unmarried",
    activeClass: "ring-primary-500 border-primary-500",
  },
  {
    value: "married",
    label: "Married",
    activeClass: "ring-secondary-500 border-secondary-500",
  },
  {
    value: "widow",
    label: "Widow",
    activeClass: "ring-danger-500 border-danger-500",
  },
  {
    value: "divorced",
    label: "Divorced",
    activeClass: "ring-warning-500 border-warning-500",
  },
  {
    value: "other",
    label: "Other",
    activeClass: "ring-info-500 border-info-500",
  },
];

const colors2 = [
  {
    value: "male",
    label: "Male",
    activeClass: "ring-primary-500 border-primary-500",
  },
  {
    value: "female",
    label: "Female",
    activeClass: "ring-danger-500 border-danger-500",
  },
  {
    value: "other",
    label: "Other",
    activeClass: "ring-info-500 border-info-500",
  },
];



const furits = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
  { value: "vanilla", label: "Vanilla" },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};



const FormValidationSchema = yup.object({
  firstName: yup.string().required("This Field is Required").min(3, "Enter at least 3 characters."),
  lastName: yup.string().required("This Field is Required").min(3, "Enter at least 3 characters."),
  fatherName: yup.string().required("This Field is Required").min(3, "Enter at least 3 characters."),
  motherName: yup.string().required("This Field is Required").min(3, "Enter at least 3 characters."),
  optionalEmail: yup.string().required("This Field is Required").email("Enter a valid email."),
  emergencyPhone: yup.string().required("This Field is Required").matches(/^\d{10}$/, "Enter a 10-digit phone number."),
}).required();

const profile = () => {


    // ***** this is only demo. there is many thing that need to see.

  const dispatch = useDispatch();

  const [profileImgErr, setProfileImgErr] = useState("");
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState("");

  const [removeProfileImg, setRemoveProfileImg] = useState(false);


  const [stateArray, setStateArray] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cityList, setCityList] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [picker, setPicker] = useState(new Date());


  const [selectColor, setSelectColor] = useState("primary-500");



  const [currentUser, setCurrentUser] = useState({});



  const { stateList } = useSelector((state) => state.states);
  const { profileData: profile, profileExists } = useSelector((state) => state.profile);


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


  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedImage(file);
  //   register("imageInput", {
  //     required: "Profile image is required", // Add any validation rules if needed
  //   });
  // };

  const handleImageChange = (event) => {
    setProfileImgErr("");

    let fileSize = 0;

    let errorCount = 0;

    const file = event.target.files[0];

    if (file) {
      fileSize = file.size / 1024;

      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setProfileImgErr("Only Images are allowed! ");

        errorCount++;
      }

      //check if filesize is not more than 1MB
      if (fileSize > 1024) {
        setProfileImgErr("Please upload a file of size less than 1MB!");

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


  const handleColor = (e) => {
    setSelectColor(e.target.value);
  };


  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);


    if (selectedOption) {

      async function getCity() {

        const response = await cityService.getCityList(selectedOption.value);

        if (response.data.data) {

          const arrayCity = response.data.data

          const filteredCityList = arrayCity.map((item, index) => {
            return { value: item._id, label: item.name }
          })

          setCityList(filteredCityList)


        }


      }

      getCity()


    } else {
      // Reset city list if no state is selected
      setCityList([]);
    }

  };



  const onSubmit = (data) => {

    let errorCount = 0;

    if (!selectedProfileImg) {
      profileImgErr("please select profile image");
      errorCount++
    }


  };


  useEffect(() => {

    if (profile) {
      setCurrentUser(profile)
    }

  }, [profile])


  useEffect(() => {

    if (stateList !== null) {
      const filterdState = stateList.map((item, index) => {
        return { value: item.state_code, label: item.name }
      });
      setStateArray(filterdState)
    }

  }, [stateList])



  useEffect(() => {

    async function getState() {
      try {
        const response = await stateService.getStateList();
        dispatch(setState(response.data.data))
      } catch (error) {
      }
    }
    getState()

  }, []);


  const handleInputValidation = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    setCurrentUser({ ...currentUser, [fieldName]: value });

    const validateInput = (field, minLength, errorMessage) => {
      if (value.length < minLength) {
        setError(field, {
          type: "manual",
          message: errorMessage,
        });
      } else {
        clearErrors(field);
      }
    };

    switch (fieldName) {
      case "firstName":
      case "lastName":
      case "fatherName":
      case "motherName":
        validateInput(fieldName, 3, `Enter at least 3 characters for ${fieldName}.`);
        break;
      case "optionalEmail":
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValidEmail) {
          setError("optionalEmail", {
            type: "manual",
            message: "Enter a valid email address.",
          });
        } else {
          clearErrors("optionalEmail");
        }
        break;
      case "emergencyPhone":
        const isValidPhoneNumber = /^\d{10}$/.test(value);
        if (!isValidPhoneNumber) {
          setError("emergencyPhone", {
            type: "manual",
            message: "Enter a valid 10-digit phone number.",
          });
        } else {
          clearErrors("emergencyPhone");
        }
        break;
      default:
        break;
    }






  };



  return (

    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center"> {/* Updated line */}
            <label htmlFor="imageInput" className="cursor-pointer">
              <img
                src={profileImgPreview ? profileImgPreview : ProfileImage}
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
            <span style={{ color: "red", fontSize: "0.7em" }}>{profileImgErr}</span>
            <label htmlFor="imageInput" className="text-sm mt-2 text-gray-500 cursor-pointer">Select a profile</label> {/* New line */}
          </div>
          {/* <div className="mb-2 ">
            <label htmlFor="firstName" className="mb-1">
              First Name
            </label>
            <Textinput
              name="firstName"
              isMask={false}
              // onChange={handleInputValidation}
              placeholder="Enter First Name Here.."
              register={register}
              error={errors.firstName}
            />
          </div> */}

          <div className={`fromGroup `}>
            <label htmlFor="firstName" className="mb-1">
              First Name
            </label>
            <div className=" flex-1">
              <input type="text" className="form-control py-2" />
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="lastName" className="mb-1">
              Last Name
            </label>
            <Textinput
              name="lastName"
              type="text"
              placeholder="Enter Last Name Here.."
              register={register}
              error={errors.lastName}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="fatherName" className="mb-1">
              Father Name
            </label>
            <Textinput
              name="fatherName"
              type="text"
              placeholder="Enter Father's Name Here.."
              register={register}
              error={errors.fatherName}

            />
          </div>

          <div className="mb-2">
            <label htmlFor="motherName" className="mb-1">
              Mother Name
            </label>
            <Textinput
              name="motherName"
              type="text"
              placeholder="Enter Mother's Name Here.."
              register={register}
              error={errors.motherName}
            // defaultValue={}

            />
          </div>

          <div className="flex flex-wrap space-xy-5" style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="maritalStatus" className="" style={{ marginTop: "-10px" }}>
              Gender
            </label>
            {colors2.map((color, index) => (
              <Radio key={index}
                label={color.label}
                name="color"
                value={color.value}
                checked={selectColor === color.value}
                onChange={handleColor}
                activeClass={color.activeClass}
              />
            ))}


          </div>

          <div className="mb-2">
            <label className="" htmlFor="hf-picker">
              Date Of Birth
            </label>
            <Flatpickr
              value={picker}
              id="hf-picker"
              className="form-control py-2 "
              onChange={(date) => setPicker(date)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
              }}
            />
          </div>

          <div className="flex flex-wrap space-xy-5">
            <label htmlFor="maritalStatus" className="mb-1">
              Marital Status
            </label>
            {colors.map((color, index) => (
              <Radio key={index}
                label={color.label}
                name="color"
                value={color.value}
                checked={selectColor === color.value}
                onChange={handleColor}
                activeClass={color.activeClass}
              />
            ))}
          </div>

          <div className="mb-2">
            <label htmlFor="optionalEmail" className="mb-1">
              Optional Email
            </label>
            <Textinput
              name="optionalEmail"
              type="text"
              placeholder="Enter Optional Email Here.."
              register={register}
              error={errors.optionalEmail}

            />
          </div>

          <div className="mb-2">
            <label htmlFor="emergencyPhone" className="mb-1">
              Emergency Phone
            </label>
            <Textinput
              name="emergencyPhone"
              type="text"
              placeholder="Enter Emergency Phone Here.."
              register={register}
              error={errors.emergencyPhone}

            />
          </div>

          <div className="mb-2">
            <label htmlFor="state" className="mb-1">
              State
            </label>
            <Select
              className="react-select"
              classNamePrefix="select"
              // defaultValue={furits[0]}
              options={stateArray}
              styles={styles}
              id="state"
              onChange={handleStateChange}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="city" className="mb-1">
              City
            </label>
            <Select
              className="react-select"
              classNamePrefix="select"
              // defaultValue={furits[0]}
              options={cityList}
              styles={styles}
              id="city"
            />
          </div>

          <div className="lg:col-span-2 col-span-1">
            <div className="ltr:text-right rtl:text-left">
              <button className="btn btn-dark text-center" >
                Submit
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
