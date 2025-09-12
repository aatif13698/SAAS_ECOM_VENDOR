import { Card } from "@mui/material";
import React, { useState, Fragment, useEffect } from "react";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss"
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import subcategoryService from "@/services/subCategory/subcategory.service";
import { icon } from "leaflet";
import Icons from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import productBlueprintService from "@/services/productBlueprint/productBlueprint.service";
import CreateOption from "./CreateOption";
import Select from 'react-select';

const commonFileTypes = [
    { value: 'image/jpeg', label: 'JPEG Image (.jpg, .jpeg)' },
    { value: 'image/png', label: 'PNG Image (.png)' },
    { value: 'image/gif', label: 'GIF Image (.gif)' },
    { value: 'image/webp', label: 'WebP Image (.webp)' },
    { value: 'image/bmp', label: 'BMP Image (.bmp)' },
    { value: 'image/tiff', label: 'TIFF Image (.tiff, .tif)' },
    { value: 'image/svg+xml', label: 'SVG Image (.svg)' },
    { value: 'image/heic', label: 'HEIC Image (.heic)' },
    { value: 'image/avif', label: 'AVIF Image (.avif)' },
    { value: 'application/pdf', label: 'PDF (.pdf)' },
    { value: 'text/csv', label: 'CSV (.csv)' },
    { value: 'application/vnd.ms-excel', label: 'Excel (.xls)' },
    { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (.xlsx)' },
    { value: 'application/msword', label: 'Word (.doc)' },
    { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (.docx)' },
    { value: 'text/plain', label: 'Plain Text (.txt)' },
    { value: 'application/json', label: 'JSON (.json)' },
    { value: 'application/zip', label: 'ZIP Archive (.zip)' },
    { value: 'audio/mpeg', label: 'MP3 Audio (.mp3)' },
    { value: 'video/mp4', label: 'MP4 Video (.mp4)' }
];



const CreateProductBluePrint = ({ noFade, scrollContent }) => {


    const [fieldList, setFieldList] = useState([
        {
            name: "Text",
            value: "text"
        },
        {
            name: "File",
            value: "file"
        },
        {
            name: "Select",
            value: "select"
        },
    ]);



    const [customFormArray, setCustomFormArray] = useState([]);
    const [isErrorInCustomForm, setIsErrorInCustomForm] = useState(false);
    const [customiseableFormData, setCustomiseableFormData] = useState({
        selectedField: "",
        labelName: "",
        selectOptions: [],
        validation: { fileTypes: [], maxSize: '' },
    });
    console.log("customFormArray", customFormArray);
    
    const [selectedOptionValue, setSelectedOptionValue] = useState([])
    useEffect(() => {
        if (selectedOptionValue && selectedOptionValue.length > 0) {
            setCustomiseableFormData((prev) => ({
                ...prev,
                selectOptions: selectedOptionValue
            }))
        }
    }, [selectedOptionValue])

    function handleSaveAndMore(e) {
        e.preventDefault()
        const { selectedField, selectOptions, labelName, validation } = customiseableFormData;
        if (!selectedField || !labelName || (selectedField == "select" && selectOptions.length === 0)) {
            toast.error("Please fill all data");
            setIsErrorInCustomForm(true)
            return;
        } else {
            setIsErrorInCustomForm(false)
        }
        setCustomFormArray((prev) => ([...prev, {
            selectedField: selectedField,
            labelName: labelName,
            selectOptions: selectOptions,
            validation: validation
        }]))
        setCustomiseableFormData({
            selectedField: "",
            labelName: "",
            selectOptions: [],
            validation: { fileTypes: [], maxSize: '' },

        });
        setSelectedOptionValue([]);
    }

    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;
    const isView = location?.state?.isViewed;


    const [isViewed, setIsViewed] = useState(false);

    useEffect(() => {
        if (isView) {
            setIsViewed(true)
        } else {
            setIsViewed(false)
        }
    }, [isView])




    const [pageLoading, setPageLoading] = useState(true);

    const [activeCategory, setActiveCategory] = useState([]);
    const [activeSubCategory, setActiveSubCategory] = useState([]);
    const [activeBrand, setActiveBrand] = useState([]);
    const [activeManufacturer, setActiveManufacturer] = useState([]);
    const [activeAttribute, setActiveAttribute] = useState([]);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);


    const [formData, setFormData] = useState({
        categoryId: "",
        subCategoryId: "",
        brandId: "",
        manufacturerId: "",
        // attributeId: "",
        name: "",
        description: "",
        price: "",
        taxRate: "",
        sku: "",
        isCustomizable: false,
        customizableOptions: ""
    });

    const [formDataErr, setFormDataErr] = useState({
        categoryId: "",
        subCategoryId: "",
        brandId: "",
        manufacturerId: "",
        // attributeId: "",
        name: "",
        description: "",
        price: "",
        taxRate: "",
        sku: "",
        isCustomizable: "",
        customizableOptions: "",
        icon: ""
    });

    const {
        categoryId,
        subCategoryId,
        brandId,
        manufacturerId,
        // attributeId,
        name,
        description,
        taxRate,
        sku,
        isCustomizable,

    } = formData;

    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false)
    const [imgPreview, setImgPreviwe] = useState(null);
    const [selectedFile, setselectedFile] = useState(null);
    const [iconImgErr, setIconImgErr] = useState("")

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "categoryId") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    categoryId: "Category is Required"
                }))
            } else {

                setFormDataErr((prev) => ({
                    ...prev,
                    categoryId: ""
                }))
            }
        }
        if (name == "subCategoryId") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    subCategoryId: "SubCategory is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    subCategoryId: ""
                }))
            }
        }
        if (name == "brandId") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    brandId: "Brand is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    brandId: ""
                }))
            }
        }
        if (name == "manufacturerId") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    manufacturerId: "Manufacturer is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    manufacturerId: ""
                }))
            }
        }
        // if (name == "attributeId") {
        //     if (value == "") {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             attributeId: "Attribute is Required"
        //         }))
        //     } else {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             attributeId: ""
        //         }))
        //     }
        // }
        if (name === "name") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "Name Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "Minimum 4 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "",
                }));
            }
        }

        if (name === "description") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    description: "Description Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    description: "Minimum 4 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    description: "",
                }));
            }
        }
        if (name == "taxRate") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    taxRate: "Tax Rate is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    taxRate: ""
                }))
            }
        }
        if (name == "sku") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    sku: "SKU Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    sku: "",
                }));
            }
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //---------- Adding & Editing  ----------

    //------- Handling the VAlidation ------
    function validationFunction() {
        let errorCount = 0;
        if (!categoryId) {
            setFormDataErr((prev) => ({
                ...prev,
                categoryId: "Category is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                categoryId: ""
            }))
        }

        if (!subCategoryId) {
            setFormDataErr((prev) => ({
                ...prev,
                subCategoryId: "SubCategory is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                subCategoryId: ""
            }))
        }
        if (!brandId) {
            setFormDataErr((prev) => ({
                ...prev,
                brandId: "Brand is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                brandId: ""
            }))
        }
        if (!manufacturerId) {
            setFormDataErr((prev) => ({
                ...prev,
                manufacturerId: "Manufacturer is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                manufacturerId: ""
            }))
        }
        // if (!attributeId) {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         attributeId: "Attribute is Required"
        //     }))
        //     errorCount++
        // } else {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         attributeId: ""
        //     }))
        // }
        if (!name) {
            setFormDataErr((prev) => ({
                ...prev,
                name: "Name Is Required.",
            }));
            errorCount++
        } else if (name?.length <= 3) {
            setFormDataErr((prev) => ({
                ...prev,
                name: "Minimum 4 characters required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                name: "",
            }));
        }
        if (!description) {
            setFormDataErr((prev) => ({
                ...prev,
                description: "Description Is Required.",
            }));
            errorCount++
        } else if (description?.length <= 3) {
            setFormDataErr((prev) => ({
                ...prev,
                description: "Minimum 4 characters required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                description: "",
            }));
        }
        if (!taxRate) {
            setFormDataErr((prev) => ({
                ...prev,
                taxRate: "Tax Rate is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                taxRate: ""
            }))
        }
        if (!sku) {
            setFormDataErr((prev) => ({
                ...prev,
                sku: "SKU Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                sku: "",
            }));
        }
        if (iconImgErr) {
            errorCount++
        }
        if (id == null) {
            if (!selectedFile) {
                setIconImgErr("Images is required.")
                errorCount++
            }
        }

        if (isCustomizable) {
            if (isErrorInCustomForm) {
                errorCount++
            }

            if (customFormArray.length == 0) {
                errorCount++
            }
        }

        if (errorCount > 0) {
            return true
        } else {
            return false
        }
    }



    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (error) {
            setLoading(false);
            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");
                const payload = new FormData();
                payload.append("clientId", clientId);
                if (selectedFile && selectedFile) {
                    for (let i = 0; i < selectedFile?.length; i++) {
                        payload.append("file", selectedFile[i]);
                    }
                }
                payload.append("categoryId", categoryId);
                payload.append("subCategoryId", subCategoryId);
                payload.append("brandId", brandId);
                payload.append("manufacturerId", manufacturerId);
                // payload.append("attributeId", attributeId);
                payload.append("name", name);
                payload.append("description", description);
                payload.append("taxRate", taxRate);
                payload.append("sku", sku);
                payload.append("isCustomizable", isCustomizable);
                if (isCustomizable) {
                    payload.append("customizableOptions", JSON.stringify(customFormArray));
                }

                if (id) {
                    payload.append("productBlueprintId", id);
                    const response = await productBlueprintService.update(payload);
                    // console.log("response kasif", response);

                    toast.success(response?.data?.message);
                } else {
                    const response = await productBlueprintService.create(payload);

                    toast.success(response?.data?.message);
                }



                setBaseAddress(response?.data?.data)

                setFormData({
                    categoryId: "",
                    subCategoryId: "",
                    brandId: "",
                    manufacturerId: "",
                    // attributeId: "",
                    name: "",
                    description: "",
                    price: "",
                    taxRate: "",
                    sku: "",
                    isCustomizable: false,
                    customizableOptions: ""
                });
                setFormDataErr({
                    categoryId: "",
                    subCategoryId: "",
                    brandId: "",
                    manufacturerId: "",
                    // attributeId: "",
                    name: "",
                    description: "",
                    price: "",
                    taxRate: "",
                    sku: "",
                    isCustomizable: "",
                    customizableOptions: "",
                    icon: ""
                })
                setImgPreviwe(null);
                setselectedFile(null);
                setLoading(false);





            } catch (error) {
                setLoading(false);
                console.log("error while creating or updating", error);
            }
        }
    };
    // -----setting the data if contain id ----------



    // useEffect(() => {

    //     console.log("coming hrer", baseAddress);


    //     if (baseAddress) {

    //         setFormData((prev) => ({
    //             categoryId: baseAddress.categoryId,
    //             subCategoryId: baseAddress.subCategoryId,
    //             brandId: baseAddress.brandId,
    //             manufacturerId: baseAddress.manufacturerId,
    //             // attributeId: baseAddress.attributeId,
    //             name: baseAddress.name,
    //             description: baseAddress.description,
    //             price: baseAddress.price,
    //             taxRate: baseAddress.taxRate,
    //             sku: baseAddress.sku,
    //             isCustomizable: baseAddress.isCustomizable,
    //             customizableOptions: ""
    //         }));

    //         if (baseAddress.isCustomizable) {
    //             setCustomFormArray(baseAddress.customizableOptions)
    //         };

    //         if (baseAddress.images) {
    //             setImgPreviwe(baseAddress.images.map((image) => {
    //                 return `${import.meta.env.VITE_BASE_URL}/productBluePrint/${image}`
    //             }))
    //         }

    //     }

    // }, [baseAddress])

    useEffect(() => {
        if (id) {
            async function getBranch() {
                try {
                    setPageLoading(true)
                    const response = await productBlueprintService.getOne(id);
                    const baseAddress = response?.data;
                    // setBaseAddress(response?.data)
                    setFormData((prev) => ({
                        categoryId: baseAddress.categoryId,
                        subCategoryId: baseAddress.subCategoryId,
                        brandId: baseAddress.brandId,
                        manufacturerId: baseAddress.manufacturerId,
                        // attributeId: baseAddress.attributeId,
                        name: baseAddress.name,
                        description: baseAddress.description,
                        price: baseAddress.price,
                        taxRate: baseAddress.taxRate,
                        sku: baseAddress.sku,
                        isCustomizable: baseAddress.isCustomizable,
                        customizableOptions: ""
                    }));

                    if (baseAddress.isCustomizable) {
                        setCustomFormArray(baseAddress.customizableOptions)
                    };

                    if (baseAddress.images) {
                        setImgPreviwe(baseAddress.images.map((image) => {
                            return `${image}`
                        }))
                    }
                    setPageLoading(false)

                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching vendor data", error);
                }
            }
            getBranch()
        } else {
            setPageLoading(false)
        }
    }, [id]);












    useEffect(() => {
        if (categoryId) {
            getSubCategoryByCategory(categoryId)
        }
    }, [categoryId]);

    async function getSubCategoryByCategory(categoryId) {
        try {
            const response = await subcategoryService.getAllSubCategoryByCategory(categoryId);
            setActiveSubCategory(response?.data)
        } catch (error) {
            console.log("error while gettting the subcategory by category", error);
        }
    }


    useEffect(() => {
        getAllActiveCategory();
        getAllActiveBrand();
        getAllActiveManufacturer();
        getAllActiveAttribute();
    }, [])

    async function getAllActiveCategory() {
        try {
            const response = await subcategoryService.getAllActiveCategory();
            setActiveCategory(response?.data)
        } catch (error) {
            console.log("error in getting active category", error);
        }
    }


    async function getAllActiveBrand() {
        try {
            const response = await subcategoryService.getAllActiveBrand();
            setActiveBrand(response?.data.brands)
        } catch (error) {
            console.log("error in getting active brand", error);
        }
    }


    async function getAllActiveManufacturer() {
        try {
            const response = await subcategoryService.getAllActiveManufacturer();
            setActiveManufacturer(response?.data.manufacturers)
        } catch (error) {
            console.log("error in getting active manufacturer", error);
        }
    }

    async function getAllActiveAttribute() {
        try {
            const response = await subcategoryService.getAllActiveAttribute();
            setActiveAttribute(response?.data.attributes)
        } catch (error) {
            console.log("error in getting active attribute", error);
        }
    }



    const handleFileChange1 = (e) => {
        const files = e.target.files;
        let errorCount = 0;
        let tempImgPreviews = [];
        let tempSelectedFiles = [];
        let errorMessage = "";
        if (files) {
            if (files.length + tempSelectedFiles.length > 5) {
                setIconImgErr("You can only upload up to 5 images.");
                return;
            }
            Array.from(files).forEach((file) => {
                const fileSize = file.size / (1024 * 1024); // Convert size to MB
                if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    errorMessage = "Only image files are allowed (jpg, jpeg, png, gif, WEBP)";
                    errorCount++;
                } else if (fileSize > 1) {
                    errorMessage = "File size must be less than 1MB";
                    errorCount++;
                } else {
                    const imageAsBase64 = URL.createObjectURL(file);
                    tempImgPreviews.push(imageAsBase64);
                    tempSelectedFiles.push(file);
                }
            });
            if (errorCount === 0) {
                setIconImgErr(""); // Clear any previous errors
                setselectedFile(tempSelectedFiles); // Save selected files
                setImgPreviwe(tempImgPreviews); // Save previews
            } else {
                setIconImgErr(errorMessage);
            }
        }
    };

    function handleEdit(e) {
        e.preventDefault();
        setIsViewed(false)
    }


    const handleFileTypesChange = (selectedOptions) => {
        setCustomiseableFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: selectedOptions ? selectedOptions.map(opt => opt.value) : []
            }
        }));
    };


    const handleRemoveFileType = (index) => {
        setCustomiseableFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: prev.validation.fileTypes.filter((_, i) => i !== index)
            }
        }));
    };




    return (

        <>
            {
                pageLoading ?
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "100vh",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >

                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                            <FormLoader />

                        </div>

                    </div>

                    :
                    <div>
                        <Card>
                            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>

                                <form onSubmit={onSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2  gap-5 ">


                                        <label className={`fromGroup   ${formDataErr?.categoryId !== "" ? "has-error" : ""
                                            } `}
                                        >
                                            <p className="form-label">
                                                Category <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="categoryId"
                                                value={categoryId}
                                                // disabled={isViewed}
                                                readOnly={isViewed}

                                                onChange={handleChange}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {activeCategory &&
                                                    activeCategory?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-red-600  text-xs"> {formDataErr.categoryId}</p>}

                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.subCategoryId !== "" ? "has-error" : ""
                                            } `}
                                        >
                                            <p className="form-label">
                                                Subcategory <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="subCategoryId"
                                                value={subCategoryId}
                                                // disabled={isViewed}
                                                readOnly={isViewed}

                                                onChange={handleChange}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {activeSubCategory &&
                                                    activeSubCategory?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-red-600  text-xs"> {formDataErr.subCategoryId}</p>}

                                        </label>
                                        <label className={`fromGroup   ${formDataErr?.brandId !== "" ? "has-error" : ""
                                            } `}
                                        >
                                            <p className="form-label">
                                                Brand <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="brandId"
                                                value={brandId}
                                                // disabled={isViewed}
                                                readOnly={isViewed}

                                                onChange={handleChange}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {activeBrand &&
                                                    activeBrand?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-red-600  text-xs"> {formDataErr.brandId}</p>}

                                        </label>
                                        <label className={`fromGroup   ${formDataErr?.manufacturerId !== "" ? "has-error" : ""
                                            } `}
                                        >
                                            <p className="form-label">
                                                Manufacturer <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="manufacturerId"
                                                value={manufacturerId}
                                                // disabled={isViewed}
                                                readOnly={isViewed}

                                                onChange={handleChange}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {activeManufacturer &&
                                                    activeManufacturer?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-red-600  text-xs"> {formDataErr.manufacturerId}</p>}

                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.name !== "" ? "has-error" : ""
                                            } `}>
                                            <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="name"
                                                type="text"
                                                value={name}
                                                placeholder="Enter name"
                                                onChange={handleChange}
                                                readOnly={isViewed}
                                                className="form-control py-2"
                                            />
                                            {<p className="text-red-600  text-xs"> {formDataErr.name}</p>}
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.description !== "" ? "has-error" : ""
                                            } `}>
                                            <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                Description <span className="text-red-500">*</span>
                                            </p>
                                            <textarea
                                                name='description'
                                                className={` form-control py-2 `}
                                                placeholder="Enter description"
                                                value={description}
                                                rows={3}
                                                readOnly={isViewed}
                                                // disabled={isViewed}
                                                onChange={handleChange}
                                            ></textarea>
                                            {<p className="text-red-600  text-xs"> {formDataErr.description}</p>}
                                        </label>
                                        <label className={`fromGroup   ${formDataErr?.taxRate !== "" ? "has-error" : ""
                                            } `}>
                                            <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                Tax Rate <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="taxRate"
                                                type="text"
                                                value={taxRate}
                                                placeholder="Enter text rate"
                                                onChange={handleChange}
                                                readOnly={isViewed}
                                                className="form-control py-2"
                                            />
                                            {<p className="text-red-600  text-xs"> {formDataErr.taxRate}</p>}
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.sku !== "" ? "has-error" : ""
                                            } `}>
                                            <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                SKU <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="sku"
                                                type="text"
                                                value={sku}
                                                placeholder="Enter sku"
                                                onChange={handleChange}
                                                readOnly={isViewed}
                                                className="form-control py-2"
                                            />
                                            {<p className="text-red-600  text-xs"> {formDataErr.sku}</p>}
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.isCustomizable !== "" ? "has-error" : ""
                                            } `}>
                                            <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                Is Customiseabl
                                            </p>
                                            <div
                                                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isCustomizable ? "bg-lightBtn" : "bg-darkBtn"
                                                    }`}
                                                onClick={() => setFormData((prev) => ({ ...prev, isCustomizable: !isCustomizable }))}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isCustomizable ? "translate-x-4" : "translate-x-0"
                                                        }`}
                                                ></div>
                                            </div>
                                            {<p className="text-red-600  text-xs"> {formDataErr.isCustomizable}</p>}
                                        </label>
                                    </div>

                                    {
                                        isCustomizable ?

                                            <>

                                                {
                                                    !isViewed ?
                                                        <div className=" my-4    border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-lg">
                                                            <div className="grid grid-cols-1 md:grid-cols-2   my-4 py-2 px-2  gap-5 ">
                                                                <label className={`fromGroup   `}>
                                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                                        Select Field <span className="text-red-500">*</span>
                                                                    </p>
                                                                    <select
                                                                        name="selectedField"
                                                                        value={customiseableFormData.selectedField}
                                                                        disabled={isViewed}
                                                                        onChange={(e) => {
                                                                            const { name, value } = e.target;

                                                                            setCustomiseableFormData((prev) => ({
                                                                                ...prev,
                                                                                [name]: value,
                                                                            }))
                                                                        }}
                                                                        className="form-control py-2  appearance-none relative flex-1"
                                                                    >
                                                                        <option value="">None</option>

                                                                        {fieldList &&
                                                                            fieldList?.map((item) => (
                                                                                <option value={item?.value} key={item?.value}>{item && item?.name}</option>
                                                                            ))}
                                                                    </select>
                                                                    {<p className="text-red-600  text-xs"> {formDataErr.isCustomizable}</p>}
                                                                </label>

                                                                <label className={`fromGroup   `}>
                                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                                        Label Name <span className="text-red-500">*</span>
                                                                    </p>
                                                                    <input
                                                                        name="labelName"
                                                                        type="text"
                                                                        value={customiseableFormData.labelName}
                                                                        placeholder="Enter label"
                                                                        onChange={(e) => {
                                                                            const { name, value } = e.target;
                                                                            setCustomiseableFormData((prev) => ({
                                                                                ...prev,
                                                                                [name]: value,
                                                                            }))
                                                                        }}
                                                                        readOnly={isViewed}
                                                                        className="form-control py-2"
                                                                    />
                                                                    {<p className="text-red-600  text-xs"> {formDataErr.isCustomizable}</p>}
                                                                </label>
                                                                {
                                                                    customiseableFormData.selectedField == "select" ?
                                                                        <div className="col-span-2">
                                                                            <CreateOption selectedFinding={selectedOptionValue} setSelectedFinding={setSelectedOptionValue} isViewed={isViewed} />
                                                                        </div>
                                                                        : ""
                                                                }

                                                            </div>

                                                            {customiseableFormData.selectedField === 'file' && (
                                                                <div className="px-2">
                                                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Accepted File Types</label>
                                                                    <Select
                                                                        isMulti
                                                                        options={commonFileTypes}
                                                                        value={commonFileTypes.filter(opt => customiseableFormData.validation.fileTypes.includes(opt.value))}
                                                                        onChange={handleFileTypesChange}
                                                                        className="basic-multi-select bg-white dark:bg-darkInput "
                                                                        classNamePrefix="select"
                                                                        placeholder="Select file types..."
                                                                    />

                                                                    <div className="space-y-2 mt-2">
                                                                        {customiseableFormData.validation.fileTypes.map((fileType, index) => (
                                                                            <div key={index} className="flex items-center border-[1px] justify-between p-2 bg-white dark:bg-darkInput rounded-md">
                                                                                <span>{fileType}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleRemoveFileType(index)}
                                                                                    className="text-red-500 hover:text-red-700"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="mt-4">
                                                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max File Size (bytes)</label>
                                                                        <input
                                                                            type="number"
                                                                            name="validation.maxSize"
                                                                            value={customiseableFormData.validation.maxSize}
                                                                            onChange={(e) => {
                                                                                setCustomiseableFormData((prev) => ({
                                                                                    ...prev,
                                                                                    validation: {
                                                                                        ...prev.validation,
                                                                                        maxSize: e.target.value
                                                                                    }
                                                                                }));
                                                                            }}
                                                                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
                                                                            placeholder="e.g. 5 for 5MB"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}


                                                            <div className="flex justify-end py-2 px-2 ">
                                                                <button
                                                                    onClick={handleSaveAndMore}
                                                                    className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                                >
                                                                    Save & Add more
                                                                </button>
                                                            </div>

                                                        </div> : ""
                                                }


                                                <div>
                                                    {
                                                        customFormArray && customFormArray?.length > 0 ?
                                                            <div className='overflow-x-auto my-4'>
                                                                <table className="min-w-full ">
                                                                    <thead className="bg-[#C9FEFF] dark:bg-darkBtn dark:text-white sticky top-0">
                                                                        <tr className="border-b border-dashed border-lighttableBorderColor">
                                                                            <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                Field
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                Label
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                options
                                                                            </th>
                                                                             <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                File type
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-end text-xs font-semibold  tracking-wider">
                                                                                Action
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white dark:bg-darkAccent">
                                                                        {customFormArray && customFormArray.length > 0 ? (
                                                                            customFormArray.map((item, ind) => {
                                                                                const fileType = item?.validation?.fileTypes;

                                                                                const fileTypetring = fileType?.length > 0 ? fileType.join(", ") :  "N/A";


                                                                                console.log("fileType", fileType);
                                                                                

                                                                                const newArr = item.selectOptions.map((items) => items.valueName)
                                                                                const optionsString = newArr.join(", ");
                                                                                return (
                                                                                    <tr key={ind} className="border-b border-dashed border-lighttableBorderColor">
                                                                                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                            {item.selectedField}
                                                                                        </td>
                                                                                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                            {item.labelName}
                                                                                        </td>
                                                                                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                            {optionsString ? optionsString : "N/A"}
                                                                                        </td>
                                                                                         <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                            {fileTypetring}
                                                                                        </td>
                                                                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-tableTextColor">
                                                                                            <div className="flex justify-end text-lg space-x-5 rtl:space-x-reverse">
                                                                                                <Tooltip
                                                                                                    content="Delete"
                                                                                                    placement="top"
                                                                                                    arrow
                                                                                                    animation="shift-away"
                                                                                                    theme="danger"
                                                                                                >
                                                                                                    <button
                                                                                                        className="action-btn"
                                                                                                        type="button"
                                                                                                        disabled={isViewed}
                                                                                                        onClick={() => {
                                                                                                            const updatedArray = [...customFormArray];
                                                                                                            updatedArray.splice(ind, 1);
                                                                                                            setCustomFormArray(updatedArray);
                                                                                                        }}
                                                                                                    >
                                                                                                        <Icons icon="heroicons:trash" />
                                                                                                    </button>
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="4" className="px-6 py-4 text-center text-lg font-medium text-lightModalHeaderColor">
                                                                                    NO DATA FOUND
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            : ""
                                                    }
                                                </div>




                                            </>



                                            : ""

                                    }

                                    {/* upload images */}

                                    <div className="">
                                        <label
                                            htmlFor="profileImage1"
                                            className="block text-base  font-medium mb-2"
                                        >
                                            <p className={`mb-1 dark:text-white text-black`}>Upload Files</p>
                                        </label>
                                        <label
                                            htmlFor="profileImage1"
                                            className="flex flex-col cursor-pointer  form-control relative border border-dashed border-lightHoverBgBtn dark:border-darkBtn  rounded-lg py-4 text-center"
                                        >
                                            <label htmlFor="profileImage1" className="text-primary cursor-pointer">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Click to upload.
                                                    </h3>
                                                    <label
                                                        htmlFor="profileImage1"
                                                        className="text-sm text-gray-500 cursor-pointer"
                                                    >
                                                        (Allowed .jpg, .png less than 1MB)
                                                    </label>
                                                </div>
                                            </label>
                                            <input
                                                id="profileImage1"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple // Enable multiple file selection
                                                disabled={isViewed}
                                                onChange={(e) => {
                                                    handleFileChange1(e);
                                                }}
                                            />
                                            <span style={{ color: "red", fontSize: "0.7em" }}>
                                                {<p className="text-red-600 text-xs pt-6 ">{iconImgErr}</p>}
                                            </span>
                                        </label>
                                        {imgPreview && imgPreview.length > 0 && (
                                            <div
                                                onClick={() => setShowAttachmentModal(true)}
                                                className="flex form-control flex-wrap gap-4 mt-3 px-2 py-2 justify-center border border-dashed border-lightHoverBgBtn dark:border-gray-600">
                                                {imgPreview.map((preview, index) => (
                                                    <div key={index} className="flex justify-center items-center">
                                                        <img
                                                            src={preview}
                                                            className="w-20 h-20 object-cover border-[#ffffff]"
                                                            alt={`Preview ${index + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>







                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="ltr:text-right rtl:text-left p-5">
                                            {showAddButton && !isViewed ? (
                                                <>
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


                                                </>

                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </form>

                                <div className="">
                                    {
                                        isViewed ? <button
                                            onClick={handleEdit}

                                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                        >
                                            Edit
                                        </button> : ""
                                    }

                                </div>



                            </div>
                        </Card>


                        {/* show images */}

                        <Transition appear show={showAttachmentModal} as={Fragment}>
                            <Dialog
                                as="div"
                                className="relative z-[99999]"
                                onClose={() => {
                                    setShowAttachmentModal(false)
                                }}
                            >
                                {(
                                    <Transition.Child
                                        as={Fragment}
                                        enter={noFade ? "" : "duration-300 ease-out"}
                                        enterFrom={noFade ? "" : "opacity-0"}
                                        enterTo={noFade ? "" : "opacity-100"}
                                        leave={noFade ? "" : "duration-200 ease-in"}
                                        leaveFrom={noFade ? "" : "opacity-100"}
                                        leaveTo={noFade ? "" : "opacity-0"}
                                    >
                                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                                    </Transition.Child>
                                )}

                                <div className="fixed inset-0 ">
                                    <div
                                        className={`flex min-h-full justify-center text-center p-6 items-center "
                                    }`}
                                    >
                                        <Transition.Child
                                            as={Fragment}
                                            enter={noFade ? "" : "duration-300  ease-out"}
                                            enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                            enterTo={noFade ? "" : "opacity-100 scale-100"}
                                            leave={noFade ? "" : "duration-200 ease-in"}
                                            leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                            leaveTo={noFade ? "" : "opacity-0 scale-95"}
                                        >
                                            <Dialog.Panel
                                                className={`w-full transform overflow-hidden rounded-md
                                       bg-white dark:bg-darkAccent text-left align-middle shadow-xl transition-alll max-w-4xl`}
                                            >
                                                <div
                                                    className={`relative  py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkSecondary dark:border-b dark:border-darkSecondary `}
                                                >
                                                    <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                                        View Images
                                                    </h2>
                                                    <button onClick={() => {
                                                        setShowAttachmentModal(false)
                                                    }} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                                        <Icons icon="heroicons-outline:x" />
                                                    </button>
                                                </div>
                                                <div className='overflow-y-auto h-[85vh] scrollbar-none'>
                                                    <div className='flex  flex-col items-center justify-center'>
                                                        {
                                                            imgPreview && imgPreview.length > 0 ? imgPreview.map((item, index) => {
                                                                return <img src={item} className='h-[100%] w-[100%] mb-3 border-b border-black' alt="uploded img" />
                                                            }) : "No attachment found"
                                                        }

                                                    </div>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>






                    </div>
            }
        </>

    );
};

export default CreateProductBluePrint;
