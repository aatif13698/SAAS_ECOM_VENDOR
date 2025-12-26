

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
import ledgerService from "@/services/ledger/ledger.service";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

// Secret key for decryption
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";



function CreateLedger() {
  const [isDark] = useDarkmode();
  const location = useLocation();
  const row = location?.state?.row;
  const name = location?.state?.name;
  const id = location?.state?.id;

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
  const [customData, setCustomData] = useState(null);
  const [customDataId, setCustomDataId] = useState(null);




  const [formData, setFormData] = useState({
    level: "",
    businessUnit: "",
    branch: "",
    warehouse: "",

    ledgerName: "",
    alias: "",
    ledgerGroupId: "",
    ledgerType: "",
    isCustomer: false,
    isSupplier: false,
    isEmployee: false,
    isNone: true,
    isCredit: false,
    isDebit: true,
    creditLimit: "",
    creditDays: "",
    openingBalance: "",
    openingDate: "",
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
    isNone,
    isCredit,
    isDebit,
    creditLimit,
    creditDays,
    openingBalance,
    openingDate,
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
    isNone: "",
    isCredit: "",
    isDebit: "",
    creditLimit: "",
    creditDays: "",
    openingBalance: "",
    openingDate: "",
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


  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
              value={customizationValues[fieldName] || ""}
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;

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
          if (field.type === "email" && !emailRegex.test(value)) {
            newErrors[fieldName] = `Enter a valid Email`;
          }
          if (field.type === "number" && field.name == "Phone") {
            if (!phoneRegex.test(value) || value.length === 0) {
              newErrors[fieldName] = `Enter a valid phone no.`;
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

      const error = validationFunction();

      if (Object.keys(newErrors).length > 0 || error) {
        setErrors(newErrors);
        setIsSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please correct the validation in the form before submitting.",
        });
        return;
      }
      const clientId = localStorage.getItem("saas_client_clientId");
      const formData = new FormData();
      formData.append("clientId", clientId);
      formData.append("level", level);
      formData.append("businessUnit", businessUnit);
      formData.append("branch", branch);
      formData.append("warehouse", warehouse);
      formData.append("ledgerName", ledgerName);
      formData.append("alias", alias);
      formData.append("ledgerGroupId", ledgerGroupId);
      formData.append("ledgerType", ledgerType);
      formData.append("creditLimit", creditLimit);
      formData.append("creditDays", creditDays);
      formData.append("openingBalance", openingBalance);
      formData.append("openingDate", openingDate);
      formData.append("isCustomer", isCustomer);
      formData.append("isSupplier", isSupplier);
      formData.append("isEmployee", isEmployee);
      formData.append("isNone", isNone);
      formData.append("isCredit", isCredit);
      formData.append("isDebit", isDebit);

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

      if (id) {
        formData.append("ledgerId", id);
        formData.append("ledgerCustomDataId", customDataId);
        const response = await ledgerService.updateFormData(formData);
      } else {
        const response = await ledgerService.submitFormData(formData);
      }

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
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting form:", error?.response?.data?.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  //  --------------------------------------------------------------------


  const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
  const [levelList, setLevelList] = useState([
    // {
    //   name: "Vendor",
    //   value: "vendor"
    // },
    {
      name: "Business",
      value: "business"
    },
    {
      name: "Branch",
      value: "branch"
    },
    {
      name: "Warehouse",
      value: "warehouse"
    },
  ])



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
          // {
          //     name: "Vendor",
          //     value: "vendor"
          // },
          {
            name: "Business",
            value: "business"
          },
          {
            name: "Branch",
            value: "branch"
          },
          {
            name: "Warehouse",
            value: "warehouse"
          },
        ])
      } else if (currentUser.isBuLevel) {
        setLevelList([
          {
            name: "Business",
            value: "business"
          },
          {
            name: "Branch",
            value: "branch"
          },
          {
            name: "Warehouse",
            value: "warehouse"
          },
        ]);
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
      } else if (currentUser.isBranchLevel) {
        setLevelList([
          {
            name: "Branch",
            value: "branch"
          },
          {
            name: "Warehouse",
            value: "warehouse"
          },
        ]);
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
      } else if (currentUser.isWarehouseLevel) {
        setLevelList([
          {
            name: "Warehouse",
            value: "warehouse"
          },
        ])
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
      }
    }

  }, [currentUser])

  const [isViewed, setIsViewed] = useState(false);

  const validateField = (name, value) => {
    const rules = {
      ledgerName: [
        [!value, "Ledger Name is Required"],
        [value.length < 3, "Minimum 3 characters required."]
      ],
      alias: [
        [!value, "Alias is Required"],
        [value.length < 3, "Minimum 3 characters required."]
      ],
      ledgerGroupId: [
        [!value, "Grup is Required"],
      ],
      ledgerType: [
        [!value, "Ledger type is Required"],
      ],
      creditLimit: [
        [!value, "Credit limit is Required"],
      ],
      creditDays: [
        [!value, "Credit days is Required"],
      ],
      openingBalance: [
        [!value, "Opening balance is Required"],
      ],
      openingDate: [
        [!value, "Opening date is Required"],
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
      ledgerName: validateField("ledgerName", ledgerName),
      alias: validateField("alias", alias),
      ledgerGroupId: validateField("ledgerGroupId", ledgerGroupId),
      ledgerType: validateField("ledgerType", ledgerType),
      isCustomer: validateField("isCustomer", isCustomer),
      isSupplier: validateField("isSupplier", isSupplier),
      isEmployee: validateField("isEmployee", isEmployee),
      isCredit: validateField("isCredit", isCredit),
      isDebit: validateField("isDebit", isDebit),
      creditLimit: validateField("creditLimit", creditLimit),
      creditDays: validateField("creditDays", creditDays),
      openingBalance: validateField("openingBalance", openingBalance),
      openingDate: validateField("openingDate", openingDate),
    };

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
      getBranchByBusiness(businessUnit);
      if (level === "business") {
        getLedgerGroups(level, businessUnit);
      }
      if (!id) {
        setFormData((prev) => {
          return { ...prev, ledgerGroupId: "" }
        })
      }
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
      getWarehouseByBranch(branch);
      if (level === "branch") {
        getLedgerGroups(level, branch);
      }
      if (!id) {
        setFormData((prev) => {
          return { ...prev, ledgerGroupId: "" }
        })
      }
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

  useEffect(() => {
    if (warehouse && level === "warehouse") {
      getLedgerGroups(level, warehouse);
    }
    if (!id) {
      setFormData((prev) => {
        return { ...prev, ledgerGroupId: "" }
      })
    }
  }, [warehouse]);



  const fetchFormData = async (decryptedFormId) => {
    try {
      setIsPageLoading(true);
      const response = await ledgerService.getFormData(decryptedFormId);

      setCustomDataId(response?.data?.data?._id)

      const fieldsData = response?.data?.data || null;
      const otherThanFile = fieldsData?.otherThanFiles;
      const files = fieldsData?.files;
      console.log("files", files);

      const fieldArray = Object.entries(otherThanFile).map(([key, value]) => ({
        key,
        value
      }));
      const fileArray = files.map((item) => {
        return {
          key: item?.fieldName,
          value: item?.fileUrl
        }
      });

      console.log("fileArray", fileArray);


      const resultantDataArray = [...fieldArray, ...fileArray]
      setCustomData(resultantDataArray);
      setIsPageLoading(false);
    } catch (error) {
      console.error("Error fetching form data:", error);
      setIsPageLoading(false);
      setErrors({ general: "Failed to fetch form data" });
    }
  };


  useEffect(() => {
    if (existingFields && customData) {
      let dataObject = {};
      for (let index = 0; index < existingFields.length; index++) {
        const element = existingFields[index];
        const type = element?.type;
        const filedLabel = element?.label;
        const fieldName = element?.name;
        if (type == "select") {
          for (let j = 0; j < customData.length; j++) {
            const data = customData[j];
            if (data?.key == filedLabel) {
              dataObject[fieldName] = { value: data?.value, label: data?.value }
            }
          }
        } else if (type == "multiselect") {
          for (let j = 0; j < customData.length; j++) {
            const data = customData[j];
            if (data?.key == filedLabel) {
              const parse = JSON.parse(data?.value);
              dataObject[fieldName] = parse
            }
          }
        } else if (type == "file") {
          for (let j = 0; j < customData.length; j++) {
            const data = customData[j];
            if (data?.key == fieldName) {
              dataObject[fieldName] = data?.value
            }
          }
        } else {
          for (let j = 0; j < customData.length; j++) {
            const data = customData[j];
            if (data?.key == filedLabel) {
              dataObject[fieldName] = data?.value
            }
          }
        }
      }
      setCustomizationValues(dataObject)
    }
  }, [existingFields, customData]);

  // -----setting the data if contain id ----------
  useEffect(() => {
    if (id) {

      fetchFormData(id)
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
            businessUnit: baseAddress.businessUnit?._id,
            branch: baseAddress.branch?._id,
            warehouse: baseAddress.warehouse?._id,
            ledgerName: baseAddress.ledgerName,
            alias: baseAddress.alias,
            ledgerGroupId: baseAddress.ledgerGroupId?._id,
            ledgerType: baseAddress.ledgerType,
            isCustomer: baseAddress.isCustomer,
            isSupplier: baseAddress.isSupplier,
            isEmployee: baseAddress.isEmployee,
            isNone: baseAddress.isNone,
            isCredit: baseAddress.isCredit,
            isDebit: baseAddress.isDebit,
            creditLimit: baseAddress.creditLimit,
            creditDays: baseAddress.creditDays,
            openingBalance: baseAddress.openingBalance,
            openingDate: baseAddress.openingDate,
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
        setActiveBusinessUnits(response?.data?.businessUnits)
      } catch (error) {
        console.log("error while getting the active business unit", error);
      }
    }
    getActiveBusinessUnit();
  }, []);

  async function getLedgerGroups(level, levelId) {
    try {
      const response = await ledgerGroupService.getAllLedgerGroup(level, levelId);
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
              disabled={isViewed || id}
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
                  disabled={isViewed || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel || id}
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
                  disabled={isViewed || currentUser.isBranchLevel || currentUser.isWarehouseLevel || id}
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
                  disabled={isViewed || currentUser.isWarehouseLevel || id}
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
              disabled={isViewed || id}
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
              value={id ? formatDate(openingDate) : openingDate}
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
          <div className="form-group">
            <p className="form-label">
              Entity Type <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2 flex-wrap ">
              <label className="flex  items-center space-x-2">
                <input
                  type="radio"
                  name="entityType"
                  value="isNone"
                  checked={isNone}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCustomer: false,
                      isSupplier: false,
                      isEmployee: false,
                      isNone: true
                    }))
                  }
                  disabled={isViewed || id}
                  className="form-radio text-blue-600"
                  aria-label="Customer"
                />
                <span>None of these</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="entityType"
                  value="isCustomer"
                  checked={isCustomer}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCustomer: true,
                      isSupplier: false,
                      isEmployee: false,
                      isNone: false
                    }))
                  }
                  disabled={isViewed || id}
                  className="form-radio text-blue-600"
                  aria-label="Customer"
                />
                <span>Customer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="entityType"
                  value="isSupplier"
                  checked={isSupplier}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCustomer: false,
                      isSupplier: true,
                      isEmployee: false,
                      isNone: false
                    }))
                  }
                  disabled={isViewed || id}
                  className="form-radio text-blue-600"
                  aria-label="Supplier"
                />
                <span>Supplier</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="entityType"
                  value="isEmployee"
                  checked={isEmployee}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCustomer: false,
                      isSupplier: false,
                      isEmployee: true,
                      isNone: false
                    }))
                  }
                  disabled={isViewed || id}
                  className="form-radio text-blue-600"
                  aria-label="Employee"
                />
                <span>Employee</span>
              </label>
            </div>
            {formDataErr?.entityType && (
              <p className="text-sm text-red-500">{formDataErr.entityType}</p>
            )}
          </div>

          <div className="form-group">
            <p className="form-label">
              Type <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2 flex-wrap ">
              <label className="flex  items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="isCredit"
                  checked={isCredit}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCredit: true,
                      isDebit: false,
                    }))
                  }
                  disabled={isViewed}
                  className="form-radio text-blue-600"
                  aria-label="Customer"
                />
                <span>Credit</span>
              </label>
              <label className="flex  items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="isDebit"
                  checked={isDebit}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isCredit: false,
                      isDebit: true,
                    }))
                  }
                  disabled={isViewed}
                  className="form-radio text-blue-600"
                  aria-label="Customer"
                />
                <span>Debit</span>
              </label>
            </div>
            {formDataErr?.entityType && (
              <p className="text-sm text-red-500">{formDataErr.entityType}</p>
            )}
          </div>

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
          {/* {
            isViewed ?
              <Button
                text="Edit"
                // className="border bg-blue-gray-300 rounded px-5 py-2"
                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                onClick={() => setIsViewed(false)}
                isLoading={loading}
              /> :

              <>

                {showAddButton ? (
                  <button
                    disabled={loading}
                    style={
                      loading
                        ? { opacity: "0.5", cursor: "not-allowed" }
                        : { opacity: "1" }
                    }
                    className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                  >
                    {loading
                      ? ""
                      : showAddButton && id
                        ? "Update"
                        : "Save"}
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
                        Loading..
                      </>
                    )}
                  </button>
                ) : (
                  ""
                )}
              </>
          } */}
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








{/* <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="supplier-modal-title"
        aria-describedby="supplier-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: isDark ? 'rgb(31, 41, 55)' : 'white',
          border: '1px solid',
          borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div
            className={`relative overflow-hidden rounded-t-lg py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
          >
            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
              Select Party
            </h2>
            <button onClick={() => setOpenModal(false)} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
              <Icon icon="heroicons-outline:x" />
            </button>
          </div>
          <Box sx={{
            p: 2,
            flex: 1,
            overflowY: 'auto',
          }}>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className={`p-2 mb-2 rounded cursor-pointer hover:bg-indigo-100 flex justify-between items-center ${formData.supplier?._id === supplier._id ? 'bg-indigo-50' : ''
                    }`}
                  onClick={() => handleSelectSupplier(supplier)}
                >
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.contactPerson} - {supplier.emailContact}</p>
                  </div>
                  {formData.supplier?._id === supplier._id && (
                    <GoCheck className="text-green-500" />
                  )}
                </div>
              ))
            ) : (
              <Typography className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                No suppliers available
              </Typography>
            )}
          </Box>
          {(
            <div className="px-4 py-3 rounded-b-lg flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
              <div className="flex gap-2">
                <Button
                  text="Close"
                  // className="border bg-red-300 rounded px-5 py-2"
                  className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                  onClick={() => setOpenModal(false)}
                />
              </div>
            </div>
          )}
        </Box>
      </Modal> */}