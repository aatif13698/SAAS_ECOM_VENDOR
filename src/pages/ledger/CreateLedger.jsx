

import React, { useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import customFieldService from "../../services/customFieldService";
import { FaSpinner } from "react-icons/fa";
// import LoadingSpinner from "../../components/Loading/LoadingSpinner";
// import images from "../../constant/images";
import Swal from "sweetalert2";
import Select from "react-select";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "@/helper/getCroppedImage";
import useDarkmode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";
import warehouseService from "@/services/warehouse/warehouse.service";
import ledgerGroupService from "@/services/ledgerGroup/ledgerGroup.service";
import Loading from "@/components/Loading";
import FormLoader from "@/Common/formLoader/FormLoader";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

// Secret key for decryption
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";



function CreateLedger() {
  const [isDark] = useDarkmode();

  const navigate = useNavigate();
  const [existingFields, setExistingFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customizationValues, setCustomizationValues] = useState({});
  const [ledgerGroups, setLedgerGroups] = useState([]);

  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentFieldName, setCurrentFieldName] = useState(null);
  const [currentAspectRation, setCurrentAspectRation] = useState(null);

  const [formData, setFormData] = useState({
    level: "",
    businessUnit: "",
    branch: "",
    warehouse: "",

    ledgerName: "",
    alias: "",
    ledgerGroupId: "",
    ledgerType: "",
    isCustomer: "",
    isSupplier: "",
    isEmployee: "",
    isCredit: "",
    isDebit: "",
    creditLimit: "",
    creditDays: "",
    openingBalance: "",
    openingDate: "",
    status: ""
  });

  const {
    level,
    businessUnit,
    branch,
    warehouse,

    ledgerName,
    alias,
    ledgerGroupId,
    ledgerType,
    isCustomer,
    isSupplier,
    isEmployee,
    isCredit,
    isDebit,
    creditLimit,
    creditDays,
    openingBalance,
    openingDate,
    status
  } = formData;

  const [formDataErr, setFormDataErr] = useState({
    level: "",
    businessUnit: "",
    branch: "",
    warehouse: "",

    ledgerName: "",
    alias: "",
    ledgerGroupId: "",
    ledgerType: "",
    isCustomer: "",
    isSupplier: "",
    isEmployee: "",
    isCredit: "",
    isDebit: "",
    creditLimit: "",
    creditDays: "",
    openingBalance: "",
    openingDate: "",
    status: ""
  });


  useEffect(() => {

    if (ledgerGroupId) {
      fetchFields(ledgerGroupId)
    }

  }, [ledgerGroupId]);


  const fetchFields = async (ledgerGroupId) => {
    try {
      setIsPageLoading(true);
      const response = await ledgerGroupService.getAllField(ledgerGroupId);
      console.log("resposne fields", response);
      const fields = response?.data?.fields || [];
      setExistingFields(fields);
    } catch (error) {
      console.error("Error fetching fields:", error);
      setErrors({ general: "Failed to fetch form fields" });
    } finally {
      setIsPageLoading(false);
    }
  };


  // console.log("errors", errors);
  // console.log("currentAspectRation", currentAspectRation);

  // Handle input changes and validate
  const handleInputChange = (fieldName, value, field) => {
    setCustomizationValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    let newErrors = { ...errors };
    const validation = field.validation;
    if (field?.isRequired) {
      if (typeof value === "string" && !value.trim()) {
        newErrors[fieldName] = `${field?.label} is required`;
      } else if (value === null || value === undefined || value === false) {
        newErrors[fieldName] = `${field?.label} is required`;
      } else {
        delete newErrors[fieldName];
      }
    } else {
      if (typeof value === "string" && !value.trim()) {
        delete newErrors[fieldName];
      }
    }
    if (validation?.regex && value) {
      try {
        const regex = new RegExp(validation.regex);
        if (typeof value === "string" && !regex.test(value.trim())) {
          newErrors[fieldName] = `Please enter a valid ${field?.label}`;
        } else {
          delete newErrors[fieldName];
        }
      } catch (error) {
        console.error(`Invalid regex for ${fieldName}:`, validation.regex, error);
        newErrors[fieldName] = `Invalid validation rule for ${field?.label}`;
      }
    }
    if (validation?.minLength && value) {
      if (value?.length < validation?.minLength) {
        newErrors[fieldName] = `Minimum ${validation?.minLength} characters are required.`;
      } else if (value?.length > validation?.maxLength) {
        newErrors[fieldName] = `Maximum ${validation?.maxLength} characters are required.`;
      } else {
        delete newErrors[fieldName];
      }
    }
    if (validation?.min && value) {
      if (value < validation?.min) {
        newErrors[fieldName] = `Must be greater than or equal to ${validation?.min}`;
      } else if (value > validation?.max) {
        newErrors[fieldName] = `Must be less than or equal to ${validation?.max}`;
      } else {
        delete newErrors[fieldName];
      }
    }
    setErrors(newErrors);
  };

  // Handle image file selection
  const handleFileChange = (fieldName, file, field) => {

    // console.log("field sss", field);

    if (file && field.type === "file" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCurrentFieldName(fieldName);
        if (field?.aspectRation && field?.aspectRation?.xAxis && field?.aspectRation?.yAxis) {
          setCurrentAspectRation(field?.aspectRation)
        }
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      handleInputChange(fieldName, file, field);
    }
  };

  // Cropper callbacks
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Finalize crop and save image
  const handleCropConfirm = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `cropped_${Date.now()}.jpg`;
      const croppedFile = new File([croppedImage], fileName, { type: "image/jpeg" });
      handleInputChange(currentFieldName, croppedFile, existingFields.find((f) => f.name === currentFieldName));
      setCropModalOpen(false);
      setImageSrc(null);
      setCurrentFieldName(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error("Error cropping image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to crop image. Please try again.",
      });
    }
  }, [imageSrc, croppedAreaPixels, currentFieldName, existingFields]);

  // Cancel crop
  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageSrc(null);
    setCurrentFieldName(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    // Clear file input
    setCustomizationValues((prev) => ({
      ...prev,
      [currentFieldName]: null,
    }));
  };

  function isDatePassed(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  }







  const renderFieldPreview = (field) => {
    const options = field?.options
      ? field?.options?.map((item) => ({ value: item, label: item }))
      : [];

    const baseStyles =
      // "w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
      "form-control py-2"

    const fieldName = field.name;

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "hyperlink":
        return (
          <>
            <input
              type={field.type}
              placeholder={field?.placeholder}
              className={baseStyles}
              value={customizationValues[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "textarea":
        return (
          <>
            <textarea
              placeholder={field?.placeholder}
              className={`${baseStyles} min-h-[100px]`}
              value={customizationValues[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "select":
        return (
          <>
            <Select
              name="select"
              options={options}
              classNamePrefix="select"
              onChange={(selected) => handleInputChange(fieldName, selected, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "multiselect":
        return (
          <>
            <Select
              isMulti
              name="colors"
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selected) => handleInputChange(fieldName, selected, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "checkbox":
        return (
          <>
            <input
              type="checkbox"
              checked={customizationValues[fieldName] || false}
              onChange={(e) => handleInputChange(fieldName, e.target.checked, field)}
              className="h-5 w-5 text-blue-600"
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "file":
        return (
          <>
            <input
              type="file"
              accept={field?.validation?.fileTypes?.join(",")}
              onChange={(e) => handleFileChange(fieldName, e.target.files[0], field)}
              className={baseStyles}
            />
            {customizationValues[fieldName] instanceof File && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(customizationValues[fieldName])}
                  alt="Preview"
                  className="max-w-[100px] max-h-[100px] object-cover"
                />
              </div>
            )}
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "date":
        return (
          <>
            <input
              type="date"
              placeholder={field?.placeholder || "Select a date"}
              className={baseStyles}
              value={customizationValues[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "timepicker":
        return (
          <>
            <input
              type="time"
              placeholder={field?.placeholder || "Select a time"}
              className={baseStyles}
              value={customizationValues[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      case "color":
        return (
          <>
            <input
              type="color"
              className={`${baseStyles} h-10`}
              value={customizationValues[fieldName] || "#000000"}
              onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </>
        );
      default:
        return (
          <div className={baseStyles}>
            {field?.type} (Preview not available)
            {errors[fieldName] && (
              <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newErrors = {};
      existingFields.forEach((field) => {
        const fieldName = field.name;
        const value = customizationValues[fieldName];
        if (field.isRequired) {
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && !value.trim()) ||
            (field.type === "file" && !value) ||
            (field.type === "checkbox" && value === false)
          ) {
            newErrors[fieldName] = `${field.label} is required`;
          }
          if (field.type === "multiselect") {
            if (!value?.length) {
              newErrors[fieldName] = `${field.label} is required`;
            }
          }
        }
        if (field.validation?.regex && value) {
          try {
            const regex = new RegExp(field.validation.regex);
            if (typeof value === "string" && !regex.test(value.trim())) {
              newErrors[fieldName] = `Please enter a valid ${field.label}`;
            }
          } catch (error) {
            newErrors[fieldName] = `Invalid validation rule for ${field.label}`;
          }
        }
      });
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please correct the errors in the form before submitting.",
        });
        return;
      }
      const formData = new FormData();
      formData.append("sessionId", decryptedId);
      formData.append("userId", sessionData?.userId || organizationData?.userId);
      formData.append("organizationId", organizationData?._id);
      formData.append("phone", customizationValues?.phone);
      formData.append("firstName", customizationValues?.firstName);
      existingFields.forEach((field) => {
        const fieldName = field.name;
        const label = field.label;
        const value = customizationValues[fieldName];
        if (value !== undefined && value !== null) {
          if (field.type === "file" && value instanceof File) {
            formData.append(fieldName, value);
          } else if (field.type === "multiselect" || field.type === "select") {
            // console.log("value 1212",value);

            // const stringData = JSON.stringify(value);
            const stringData = value?.value;
            formData.append(label, stringData);
          } else {
            formData.append(label, value);
          }
        }
      });
      const response = await customFieldService.submitFormData(formData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Form Submitted Successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: {
          popup: "my-toast-size",
        },
      });
      setCustomizationValues({});
      setErrors({});
      setTimeout(() => {
        Swal.fire({
          title: "Please Note",
          html: `
            <p>If you need to edit the form, you can use this credential.</p>
            <p><strong>ID:</strong> ${response?.data?.data?.data?.serialNumber}</p>
            <p><strong>Password:</strong> ${response?.data?.data?.data?.password}</p>
          `,
          icon: "info",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }, 700);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error === "A form with this phone, first name, and session already exists"
            ? "This form has already been submitted with the same phone, first name, and session."
            : error === "Invalid email format"
              ? "Please enter a valid email address"
              : error || "Failed to submit form",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  //  --------------------------------------------------------------------


  const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
  const [levelList, setLevelList] = useState([
    {
      name: "Vendor",
      value: "vendor"
    },
    {
      name: "Business",
      value: "business"
    },
    // {
    //     name: "Branch",
    //     value: "branch"
    // },
    // {
    //     name: "Warehouse",
    //     value: "warehouse"
    // },
  ])

  const location = useLocation();
  const row = location?.state?.row;
  const name = location?.state?.name;
  const id = location?.state?.id;

  const [pageLoading, setPageLoading] = useState(true);
  const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
  const [levelResult, setLevelResult] = useState(0)
  const [activeBranches, setActiveBranches] = useState([]);
  const [activeWarehouse, setActiveWarehouse] = useState([]);
  const [currentLevel, setCurrentLevel] = useState("");
  const [levelId, setLevelId] = useState("");
  const [parentLedgers, setParentLedgers] = useState([]);
  const [fields, setFields] = useState([]);
  const [ledgerData, setLedgerData] = useState(null)


  useEffect(() => {
    if (currentUser && isAuthenticated) {
      if (currentUser.isVendorLevel) {
        setLevelList([
          {
            name: "Vendor",
            value: "vendor"
          },
          {
            name: "Business",
            value: "business"
          },
        ])
      } else if (currentUser.isBuLevel) {
        setLevelList([
          {
            name: "Business",
            value: "business"
          },
        ]);
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
      } else if (currentUser.isBranchLevel) {
        setLevelList([]);
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
      } else if (currentUser.isWarehouseLevel) {
        setLevelList([])
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
      }
    }

  }, [currentUser])

  const [isViewed, setIsViewed] = useState(false);

  const validateField = (name, value) => {
    const rules = {
      groupName: [
        [!value, "Gruop Name is Required"],
        [value.length <= 3, "Minimum 3 characters required."]
      ],
      level: [[!value, "Level is required"]],
      businessUnit: [[!value && levelResult > 1, "Business Unit is required"]],
      branch: [[!value && levelResult > 2, "Branch is required"]],
      warehouse: [[!value && levelResult > 3, "Warehouse is required"]]
    };
    return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
  };


  const validationFunction = () => {
    const { level, businessUnit, branch, warehouse } = formData;
    let errors = {
      groupName: validateField("groupName", groupName),
    };
    if (hasParent && parentGroup == "") {
      errors.parentGroup = "Parent group is required"
    }
    errors.level = validateField("level", level);
    if (level === "business" || level === "branch" || level === "warehouse") {
      errors.businessUnit = validateField("businessUnit", businessUnit);
    }
    if (level === "branch" || level === "warehouse") {
      errors.branch = validateField("branch", branch);
    }
    if (level === "warehouse") {
      errors.warehouse = validateField("warehouse", warehouse);
    }
    console.log("errors", errors);

    setFormDataErr((prev) => ({
      ...prev,
      ...errors
    }));
    return Object.values(errors).some((error) => error);
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === "businessUnit" && value !== "") {
      setActiveBranches([]);
      setFormData((prev) => ({
        ...prev,
        branchId: ""
      }));
    }
    setFormDataErr((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  useEffect(() => {
    if (level) {
      if (level === "vendor") {
        setLevelResult(1);
      } else if (level === "business") {
        setLevelResult(2)
      } else if (level === "branch") {
        setLevelResult(3)
      } else if (level === "warehouse") {
        setLevelResult(4)
      }
    } else {
      setLevelResult(0)
    }
  }, [level])


  useEffect(() => {
    if (businessUnit) {
      getBranchByBusiness(businessUnit)
    }
  }, [businessUnit]);

  async function getBranchByBusiness(id) {
    try {
      const response = await warehouseService.getBranchByBusiness(id);
      setActiveBranches(response.data)
    } catch (error) {
      console.log("error while getting branch by business unit");
    }
  }

  useEffect(() => {
    if (branch) {
      getWarehouseByBranch(branch)
    }
  }, [branch]);

  async function getWarehouseByBranch(id) {
    try {
      const response = await warehouseService.getWarehouseByBranch(id);
      setActiveWarehouse(response.data)
    } catch (error) {
      console.log("error while getting warehouse by branch");
    }
  }

  //---------- Adding & Editing the Organiser ----------




  // -----setting the data if contain id ----------
  useEffect(() => {
    if (id) {
      if (name == "view") {
        setIsViewed(true)
      } else {
        setIsViewed(false)
      }
      async function getBranch() {
        try {
          setPageLoading(true)
          const baseAddress = location?.state?.row;
          let level = "";
          if (baseAddress.isBuLevel) {
            level = "business"
          } else if (baseAddress.isVendorLevel) {
            level = "vendor"
          } else if (baseAddress.isWarehouseLevel) {
            level = "warehouse"
          } else if (baseAddress.isBranchLevel) {
            level = "branch"
          }

          setLedgerData(baseAddress)

          setFormData((prev) => ({
            ...prev,
            level: level,
            businessUnit: baseAddress.businessUnit,
            branch: baseAddress.branch,
            warehouse: baseAddress.warehouse,
            groupName: baseAddress.groupName,
            hasParent: baseAddress.hasParent,
            parentGroup: baseAddress.parentGroup?._id
          }));
          setPageLoading(false)
        } catch (error) {
          setPageLoading(false)
          console.log("error in fetching vendor data");
        }
      }
      getBranch();
    } else {
      setPageLoading(false)
    }
  }, [id]);



  useEffect(() => {
    async function getActiveBusinessUnit() {
      try {
        const response = await warehouseService.getActiveBusinessUnit();
        console.log("respone active", response);
        setActiveBusinessUnits(response?.data?.businessUnits)
      } catch (error) {
        console.log("error while getting the active business unit", error);
      }
    }
    getActiveBusinessUnit();
    getLedgerGroups();
  }, []);

  async function getLedgerGroups() {
    try {
      const response = await ledgerGroupService.getAllLedgerGroup(currentLevel, levelId);
      setLedgerGroups(response?.data?.ledgerGroup)
    } catch (error) {
      console.log("error while getting ledger groups", error);
    }
  }


  useEffect(() => {

    if (currentUser && isAuthenticated) {
      if (currentUser.isVendorLevel) {
        setCurrentLevel("vendor");
      } else if (currentUser.isBuLevel) {
        setCurrentLevel("business");
        setLevelId(currentUser.businessUnit)
      } else if (currentUser.isBranchLevel) {
        setCurrentLevel("branch");
        setLevelId(currentUser.branch)
      } else if (currentUser.isWarehouseLevel) {
        setCurrentLevel("warehouse");
        setLevelId(currentUser.warehouse)
      } else {
        setCurrentLevel("vendor");
      }
    } else {


    }

  }, [currentUser]);



  return (
    <div>
      <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} p-5 shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-3  gap-5 ">

          <div
            className={`fromGroup   ${formDataErr?.level !== "" ? "has-error" : ""
              } `}
          >
            <label htmlFor="level" className="form-label ">
              <p className="form-label">
                Level <span className="text-red-500">*</span>
              </p>
            </label>
            <select
              name="level"
              value={level}
              onChange={handleChange}
              disabled={isViewed}
              className="form-control py-2  appearance-none relative flex-1"
            >
              <option value="">None</option>

              {levelList &&
                levelList?.map((item) => (
                  <option value={item.value} key={item?.value}>
                    {item && item?.name}
                  </option>
                ))}
            </select>
            {<p className="text-sm text-red-500">{formDataErr.level}</p>}
          </div>


          {
            (levelResult == 0 || levelResult == 1) ? "" :

              <div
                className={`fromGroup   ${formDataErr?.businessUnit !== "" ? "has-error" : ""
                  } `}
              >
                <label htmlFor=" hh" className="form-label ">
                  <p className="form-label">
                    Business Unit <span className="text-red-500">*</span>
                  </p>
                </label>
                <select
                  name="businessUnit"
                  value={businessUnit}
                  onChange={handleChange}
                  disabled={isViewed || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                  className="form-control py-2  appearance-none relative flex-1"
                >
                  <option value="">None</option>

                  {activeBusinessUnits &&
                    activeBusinessUnits?.map((item) => (
                      <option value={item?._id} key={item?._id}>{item?.name}</option>
                    ))}
                </select>
                {<p className="text-sm text-red-500">{formDataErr.businessUnit}</p>}
              </div>
          }


          {
            (levelResult == 0 || levelResult == 1 || levelResult == 2) ? "" :

              <div
                className={`fromGroup   ${formDataErr?.branch !== "" ? "has-error" : ""
                  } `}
              >
                <label htmlFor=" hh" className="form-label ">
                  <p className="form-label">
                    Branch <span className="text-red-500">*</span>
                  </p>
                </label>
                <select
                  name="branch"
                  value={branch}
                  onChange={handleChange}
                  disabled={isViewed || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                  className="form-control py-2  appearance-none relative flex-1"
                >
                  <option value="">None</option>

                  {activeBranches &&
                    activeBranches?.map((item) => (
                      <option value={item?._id} key={item?._id}>{item?.name}</option>
                    ))}
                </select>
                {<p className="text-sm text-red-500">{formDataErr.branch}</p>}
              </div>

          }

          {
            (levelResult == 0 || levelResult == 1 || levelResult == 2 || levelResult == 3) ? "" :
              <div
                className={`fromGroup   ${formDataErr?.warehouse !== "" ? "has-error" : ""
                  } `}
              >
                <label htmlFor=" hh" className="form-label ">
                  <p className="form-label">
                    Warehouse <span className="text-red-500">*</span>
                  </p>
                </label>
                <select
                  name="warehouse"
                  value={warehouse}
                  onChange={handleChange}
                  disabled={isViewed || currentUser.isWarehouseLevel}
                  className="form-control py-2  appearance-none relative flex-1"
                >
                  <option value="">None</option>

                  {activeWarehouse &&
                    activeWarehouse?.map((item) => (
                      <option value={item?._id} key={item?._id}>{item?.name}</option>
                    ))}
                </select>
                {<p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
              </div>
          }

          <label
            className={`fromGroup   ${formDataErr?.ledgerName !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Name <span className="text-red-500">*</span>
            </p>
            <input
              name="ledgerName"
              type="text"
              placeholder="Enter ledger name"
              value={ledgerName}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.ledgerName}
              </p>
            }
          </label>

          <label
            className={`fromGroup   ${formDataErr?.alias !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Alias <span className="text-red-500">*</span>
            </p>
            <input
              name="alias"
              type="text"
              placeholder="Enter alias"
              value={alias}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.alias}
              </p>
            }
          </label>

          <div
            className={`fromGroup   ${formDataErr?.ledgerGroupId !== "" ? "has-error" : ""
              } `}
          >
            <label htmlFor=" hh" className="form-label ">
              <p className="form-label">
                Ledger Group <span className="text-red-500">*</span>
              </p>
            </label>
            <select
              name="ledgerGroupId"
              value={ledgerGroupId}
              onChange={handleChange}
              disabled={isViewed}
              className="form-control py-2  appearance-none relative flex-1"
            >
              <option value="">None</option>
              {ledgerGroups &&
                ledgerGroups?.map((item) => (
                  <option value={item?._id} key={item?._id}>{item?.groupName}</option>
                ))}
            </select>
            {<p className="text-sm text-red-500">{formDataErr.ledgerGroupId}</p>}
          </div>

          <label
            className={`fromGroup   ${formDataErr?.ledgerType !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Ledger Type <span className="text-red-500">*</span>
            </p>
            <input
              name="ledgerType"
              type="text"
              placeholder="Enter ledger type"
              value={ledgerType}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.ledgerType}
              </p>
            }
          </label>


          <label
            className={`fromGroup   ${formDataErr?.creditLimit !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Credit Limit <span className="text-red-500">*</span>
            </p>
            <input
              name="creditLimit"
              type="number"
              placeholder="Enter credit limit"
              value={creditLimit}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.creditLimit}
              </p>
            }
          </label>

          <label
            className={`fromGroup   ${formDataErr?.creditDays !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Credit Days <span className="text-red-500">*</span>
            </p>
            <input
              name="creditDays"
              type="number"
              placeholder="Enter credit days"
              value={creditDays}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.creditDays}
              </p>
            }
          </label>

          <label
            className={`fromGroup   ${formDataErr?.openingBalance !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Opening Balance <span className="text-red-500">*</span>
            </p>
            <input
              name="openingBalance"
              type="number"
              placeholder="Enter opening balance"
              value={openingBalance}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.openingBalance}
              </p>
            }
          </label>

          <label
            className={`fromGroup   ${formDataErr?.openingDate !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Opening Date <span className="text-red-500">*</span>
            </p>
            <input
              name="openingDate"
              type="date"
              placeholder="Enter credit days"
              value={openingDate}
              onChange={handleChange}
              className="form-control py-2"
              disabled={isViewed}
            />
            {
              <p className="text-sm text-red-500">
                {formDataErr.openingDate}
              </p>
            }
          </label>

        </div>

        {
          existingFields?.length > 0 ? <div className="my-4 border-[1px]"></div> : ""
        }



        {
          isPageLoading ?


            <div className="h-32 flex flex-col justify-center items-center">
             <FormLoader />
             <p>Loading field</p>
            </div> :
            <>
              {existingFields?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...existingFields]
                      .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                      .map((field, index) => (
                        <div
                          key={index}
                          style={{ order: field?.gridConfig?.order }}
                          className={`min-w-0 ${field?.type === "checkbox" ? "flex items-center gap-2" : ""
                            }`}
                        >
                          <label className="block text-xs sm:text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                            {field?.label}
                            {field?.isRequired && <span className="text-red-500">*</span>}
                          </label>
                          {renderFieldPreview(field)}
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center">
                  <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                    {/* No Fields Have Been Added */}
                  </h2>
                </div>
              )}


            </>


        }



        <div className="flex justify-end mt-4 col-span-1 sm:col-span-2 md:col-span-3">
          <button
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
            aria-label="Submit session form"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin mr-2 h-4 sm:h-5 w-4 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 24"
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
                Submitting...
              </>
            ) : (
              "Submit Form"
            )}
          </button>
        </div>
      </div>


      {/* Cropper Modal */}
      <Modal
        isOpen={cropModalOpen}
        onRequestClose={handleCropCancel}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            // maxWidth: "600px",
            padding: "20px",
          },
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Crop Image</h2>
        <div style={{ position: "relative", width: "100%", height: "70vh" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={currentAspectRation ? currentAspectRation?.xAxis / currentAspectRation?.yAxis : 3 / 4} // Adjustable aspect ratio
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-[100%]"
          />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={handleCropCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCropConfirm}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Confirm Crop
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CreateLedger;

