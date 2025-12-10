import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import ProfileImage from "@/assets/images/users/user-1.jpg";
import Radio from "@/components/ui/Radio";
import Icon from "@/components/ui/Icon";
import "../../assets/scss/components/custome.css";
import { Country, State, City } from "country-state-city";
import authService from "@/services/authService";

const Profile = () => {
  const store = useSelector((state) => state);
  console.log("store", store);

  const [profileImgErr, setProfileImgErr] = useState("");
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  console.log("selectedProfileImg", selectedProfileImg);

  const [profileImgPreview, setProfileImgPreview] = useState(ProfileImage);

  const { profileData: profile, profileExists } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    country: "",
    state: "",
    city: ""
  });

  const [errors, setErrors] = useState({});

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryISOCode, setCountryISOCode] = useState("");
  const [stateISOCode, setStateISOCode] = useState("");
  const genderOptions = [
    { value: "Male", label: "Male", activeClass: "ring-primary-500 border-primary-500" },
    { value: "Female", label: "Female", activeClass: "ring-danger-500 border-danger-500" },
    { value: "Other", label: "Other", activeClass: "ring-info-500 border-info-500" },
  ];

  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
        country: profile.country || "",
        state: profile.state || "",
        city: profile.city || "",
      });
      setProfileImgPreview(profile.profileImage || ProfileImage);

      const selectedCountry = countryList.find((item) => item.name === profile.country);
      if (selectedCountry) {
        setCountryISOCode(selectedCountry.isoCode);
        const states = State.getStatesOfCountry(selectedCountry.isoCode);
        setStateList(states);

        const selectedState = states.find((item) => item.name === profile.state);
        if (selectedState) {
          setStateISOCode(selectedState.isoCode);
          setCityList(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
        }
      }
    }
  }, [profile, countryList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: value }));
    validateField('phone', value);
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, country: value }));
    validateField('country', value);
    if (value !== "") {
      const selected = countryList.find((c) => c.name === value);
      if (selected) {
        setCountryISOCode(selected.isoCode);
        setStateList(State.getStatesOfCountry(selected.isoCode));
        setFormData((prev) => ({ ...prev, state: "", city: "" }));
        setStateISOCode("");
        setCityList([]);
      }
    } else {
      setStateList([]);
      setCityList([]);
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, state: value }));
    validateField('state', value);
    if (value !== "") {
      const selected = stateList.find((s) => s.name === value);
      if (selected) {
        setStateISOCode(selected.isoCode);
        setCityList(City.getCitiesOfState(countryISOCode, selected.isoCode));
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setCityList([]);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, city: value }));
    validateField('city', value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        error = value.trim() === "" ? "Required" : "";
        break;
      case "gender":
        error = value === "" ? "Required" : "";
        break;
      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (value.trim() === "") {
          error = "Required";
        } else if (!phoneRegex.test(value)) {
          error = "Enter a valid 10-digit phone number";
        }
        break;
      case "country":
      case "state":
      case "city":
        error = value === "" ? "Required" : "";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (event) => {
    setProfileImgErr("");
    const file = event.target.files[0];
    if (!file) return;

    const fileSize = file.size / 1024; // in KB
    let errorCount = 0;

    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      setProfileImgErr("Only image files are allowed (jpg, jpeg, png, gif)");
      errorCount++;
    }

    if (fileSize > 1024) {
      setProfileImgErr("Image size should be less than 1 MB");
      errorCount++;
    }

    if (errorCount === 0) {
      const imageAsBase64 = URL.createObjectURL(file);
      setSelectedProfileImg(file);
      setProfileImgPreview(imageAsBase64);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) newErrors[key] = errors[key];
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {

      const clientId = localStorage.getItem("saas_client_clientId");
      const payload = new FormData();
      payload.append("clientId", clientId);
      payload.append("useId", profile?._id);
      payload.append("firstName", formData?.firstName);
      payload.append("lastName", formData?.lastName);
      payload.append("gender", formData?.gender);
      payload.append("phone", formData?.phone);
      payload.append("city", formData?.city);
      payload.append("state", formData?.state);
      payload.append("country", formData?.country);
      if (selectedProfileImg) {
        payload.append("profileImage", selectedProfileImg);
      }
      const response = await authService.updateProfile(payload);
      console.log("res", response);
    } catch (error) {
      console.log("error while submit", error);
    }
    // TODO: Submit logic, e.g., service.updateProfile(formData)
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="imageInput" className="cursor-pointer">
            <img
              src={profileImgPreview}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full"
            />
          </label>
          <input
            id="imageInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          {profileImgErr && (
            <span style={{ color: "red", fontSize: "0.7em" }}>{profileImgErr}</span>
          )}
          <label htmlFor="imageInput" className="text-sm mt-2 text-gray-500 cursor-pointer">
            Select Image
          </label>
        </div>

        <div className={`fromGroup ${errors.firstName ? "has-error" : ""}`}>
          <label htmlFor="firstName" className="mb-1">
            First Name
          </label>
          <div className="flex-1 relative">
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={() => validateField("firstName", formData.firstName)}
              placeholder="Enter First Name"
              className="form-control py-2"
            />
            {errors.firstName && (
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              </div>
            )}
          </div>
          {errors.firstName && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.firstName}</div>
          )}
        </div>

        <div className={`fromGroup ${errors.lastName ? "has-error" : ""}`}>
          <label htmlFor="lastName" className="mb-1">
            Last Name
          </label>
          <div className="flex-1 relative">
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={() => validateField("lastName", formData.lastName)}
              placeholder="Enter Last Name"
              className="form-control py-2"
            />
            {errors.lastName && (
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              </div>
            )}
          </div>
          {errors.lastName && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.lastName}</div>
          )}
        </div>

        <div className={`flex flex-wrap space-x-5 items-center ${errors.gender ? "has-error" : ""}`}>
          <label className="mb-1">Gender:</label>
          {genderOptions.map((gend, index) => (
            <Radio
              key={index}
              label={gend.label}
              name="gender"
              value={gend.value}
              checked={formData.gender === gend.value}
              onChange={handleChange}
              activeClass={gend.activeClass}
            />
          ))}
          {errors.gender && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.gender}</div>
          )}
        </div>

        <div className={`fromGroup ${errors.phone ? "has-error" : ""}`}>
          <label htmlFor="phone" className="mb-1">
            Contact Number
          </label>
          <div className="flex-1 relative">
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => validateField("phone", formData.phone)}
              placeholder="Enter 10-digit Phone Number"
              className="form-control py-2"
            />
            {errors.phone && (
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              </div>
            )}
          </div>
          {errors.phone && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.phone}</div>
          )}
        </div>

        <div className={`fromGroup ${errors.country ? "has-error" : ""}`}>
          <label htmlFor="country" className="mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            onBlur={() => validateField("country", formData.country)}
            className="form-control py-2 appearance-none relative flex-1"
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.country}</div>
          )}
        </div>

        <div className={`fromGroup ${errors.state ? "has-error" : ""}`}>
          <label htmlFor="state" className="mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            onBlur={() => validateField("state", formData.state)}
            className="form-control py-2 appearance-none relative flex-1"
          >
            <option value="">Select State</option>
            {stateList.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.state}</div>
          )}
        </div>

        <div className={`fromGroup ${errors.city ? "has-error" : ""}`}>
          <label htmlFor="city" className="mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            onBlur={() => validateField("city", formData.city)}
            className="form-control py-2 appearance-none relative flex-1"
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && (
            <div className="mt-2 text-danger-500 block text-sm">{errors.city}</div>
          )}
        </div>

        <div className="lg:col-span-2 col-span-1">
          <div className="ltr:text-right rtl:text-left">
            <button type="submit" className="bg-lightLoginBtn p-3 rounded-md text-white text-center inline-flex justify-center">
              {profileExists ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Profile;