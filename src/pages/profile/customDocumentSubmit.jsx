

import React, { useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
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
import documentService from "@/services/document/document.service";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

// Secret key for decryption
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

function CustomDocumentSubmit({ roleId, userId }) {
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

    if (roleId) {
      fetchFields(roleId)
    }

  }, [roleId]);


  const fetchFields = async (roleId) => {
    try {
      setIsPageLoading(true);
      const response = await documentService.getAllFieldByRole(roleId);
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

      // const error = validationFunction();

      // if (Object.keys(newErrors).length > 0 || error) {
      //   setErrors(newErrors);
      //   setIsSubmitting(false);
      //   Swal.fire({
      //     icon: "error",
      //     title: "Validation Error",
      //     text: "Please correct the validation in the form before submitting.",
      //   });
      //   return;
      // }
      const clientId = localStorage.getItem("saas_client_clientId");
      const formData = new FormData();
      formData.append("clientId", clientId);
      formData.append("userId", userId);

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
        const response = await documentService.updateFormData(formData);
      } else {
        const response = await documentService.submitDocData(formData);
      }


      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Doc Submitted Successfully",
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
      console.error("Error submitting form:", error?.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.error,
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
        [value.length <= 3, "Minimum 3 characters required."]
      ],
      alias: [
        [!value, "Alias is Required"],
        [value.length <= 3, "Minimum 3 characters required."]
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



  const fetchFormData = async (userId) => {
    try {
      setIsPageLoading(true);
      const response = await documentService.getDocData(userId);

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
    if (userId) {

      fetchFormData(userId)
      if (name == "view") {
        setIsViewed(true)
      } else {
        setIsViewed(false)
      }
    } else {
      setPageLoading(false)
    }
  }, [userId]);



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
      <div className={``}>





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
                  <p className="text-base sm:text-2xl md:text-base font-bold mb-2 ">
                    No Document Uploads Assigned !
                  </p>
                </div>
              )}


            </>


        }



        <div className="flex justify-end mt-4 col-span-1 sm:col-span-2 md:col-span-3">
          {
            existingFields?.length == 0 ? null :
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
          }
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

export default CustomDocumentSubmit;





