import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaExclamationCircle, FaMapMarkerAlt, FaPhone, FaRegEdit } from 'react-icons/fa';
import Select from 'react-select';
// import customFieldService from '../../services/customFieldService';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { RxValueNone } from "react-icons/rx";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { FiPlus } from "react-icons/fi";

import { FaInfoCircle } from "react-icons/fa";
import useWidth from '@/hooks/useWidth';
import useDarkmode from '@/hooks/useDarkMode';
import ledgerGroupService from '@/services/ledgerGroup/ledgerGroup.service';
import { RiDeleteBinLine } from "react-icons/ri";
import documentService from '@/services/document/document.service';








function DocCustomField() {

    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state;
    const [isDark] = useDarkmode();

    const { width, breakpoints } = useWidth();


    console.log("aatif", data);

    const [trigger, setTrigger] = useState('mouseenter focus');

    useEffect(() => {
        const updateTrigger = () => {
            // Use 'click' for screen width below 768px (mobile)
            if (width < breakpoints.md) {
                setTrigger('click');
            } else {
                setTrigger('mouseenter focus');
            }
        };

        updateTrigger(); // Run once on mount
        window.addEventListener('resize', updateTrigger);
        return () => window.removeEventListener('resize', updateTrigger);
    }, []);


    // custom field handling
    const [formData, setFormData] = useState({
        name: '',
        label: '',
        type: '',
        options: [],
        isRequired: false,
        placeholder: '',
        validation: { regex: '', min: '', max: '', maxLength: '', fileTypes: [], maxSize: '' },
        gridConfig: { span: 12, order: 0 }
    });

    console.log("formData", formData);
    

    const [aspectRation, setAspectRation] = useState({
        xAxis: "",
        yAxis: ""
    });

    const [errors, setErrors] = useState([]);
    const [optionInput, setOptionInput] = useState('');
    const [fileTypeInput, setFileTypeInput] = useState('');
    const [createdFields, setCreatedFields] = useState([]); // Store fields created in this session
    const [existingFields, setExistingFields] = useState([]); // Store fields fetched from API
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0)

    const fieldTypes = [
        'text', 'number', 'email', 'date', 'timepicker', 'select', 'checkbox',
        'textarea', 'multiselect', 'color', 'hyperlink', 'file'
    ].map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }));

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

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "transparent",
            borderColor: "#ccc",
        }),
        input: (provided) => ({
            ...provided,
            backgroundColor: "transparent",
            color: "#000",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#000",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#333", // Dropdown background color
        }),
        option: (provided, { isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: isSelected ? "#555" : isFocused ? "#444" : "transparent", // Option background color
            color: isSelected ? "#fff" : "#ddd", // Text color for options
            cursor: "pointer",
        })
    };


    // Fetch existing fields on component mount
    // useEffect(() => {
    //     const fetchFields = async () => {
    //         try {
    //             setIsDataLoading(true);
    //             const response = await customFieldService.getCustomForms( data?.session?._id);
    //             setExistingFields(response?.data?.data?.data);
    //             setCreatedFields([]);
    //             setIsDataLoading(false);
    //         } catch (error) {
    //             setIsDataLoading(false);
    //             setErrors(['Failed to fetch existing fields']);
    //         }
    //     };
    //     fetchFields();
    // }, [refreshCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleAddOption = () => {
        if (optionInput.trim()) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, optionInput.trim()]
            }));
            setOptionInput('');
        }
    };

    const handleRemoveOption = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleAddFileType = () => {
        if (fileTypeInput.trim() && !formData.validation.fileTypes.includes(fileTypeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                validation: {
                    ...prev.validation,
                    fileTypes: [...prev.validation.fileTypes, fileTypeInput.trim()]
                }
            }));
            setFileTypeInput('');
        }
    };

    const handleRemoveFileType = (index) => {
        setFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: prev.validation.fileTypes.filter((_, i) => i !== index)
            }
        }));
    };

    const handleFileTypesChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: selectedOptions ? selectedOptions.map(opt => opt.value) : []
            }
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors
        const payload = {
            name: formData.name,
            label: formData.label,
            type: formData.type,
            options: formData.options.length > 0 ? formData.options : undefined,
            isRequired: formData.isRequired,
            placeholder: formData.placeholder || undefined,
            validation: {
                regex: formData.validation.regex || undefined,
                min: formData.validation.min ? Number(formData.validation.min) : undefined,
                max: formData.validation.max ? Number(formData.validation.max) : undefined,
                minLength: formData.validation.minLength ? Number(formData.validation.minLength) : undefined,
                maxLength: formData.validation.maxLength ? Number(formData.validation.maxLength) : undefined,
                fileTypes: formData.validation.fileTypes.length > 0 ? formData.validation.fileTypes : undefined,
                maxSize: formData.validation.maxSize ? Number(formData.validation.maxSize) : undefined
            },
            aspectRation: {
                xAxis: aspectRation?.xAxis,
                yAxis: aspectRation?.yAxis
            },
            gridConfig: {
                span: Number(formData.gridConfig.span),
                order: Number(formData.gridConfig.order)
            },
            documentRequirementId: data?.group?._id
            // userId: data?.organization?.userId,
            // sessionId: data?.session?._id
        };
        try {
            setIsSubmitting(true);
            const response = await documentService.createField(payload);
            console.log("Response:", response);
            const newField = response.data?.data;
            if (!newField) {
                throw new Error("No field data returned from the server");
            }
            // Add the new field to the createdFields array
            setCreatedFields(prev => [...prev, newField]);
            // Show success toast
            toast.success('Field created successfully!');
            // Reset form
            setFormData({
                name: '',
                label: '',
                type: '',
                options: [],
                isRequired: false,
                placeholder: '',
                validation: { regex: '', min: '', max: '', maxLength: '', minLength: "", fileTypes: [], maxSize: '' },
                gridConfig: { span: 12, order: 0 }
            });
            setIsSubmitting(false);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Field Created Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
        } catch (error) {
            setIsSubmitting(false);
            console.log("Error creating field:", error?.message);
            const errorMessage = error?.message || 'An error occurred while creating field';
            setErrors([errorMessage]); // Optional: keep in state if you still want to display in UI
        }
    };

    // Render a field preview (simplified for display purposes)
    const renderFieldPreview = (field) => {
        const options = field?.options ? field?.options?.map((item) => ({ value: item, label: item })) : [];

        // console.log("options", options);

        const baseStyles = "w-[100%] bg-transparent   p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'hyperlink':
                return (
                    <input
                        disabled={true}
                        type={field?.type}
                        placeholder={field?.placeholder}
                        className={baseStyles}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        disabled={true}
                        placeholder={field?.placeholder}
                        className={`${baseStyles} min-h-[100px]`}
                    />
                );
            case 'select':
                return (
                    // <select
                    //     // disabled={true}

                    //     className={baseStyles}>
                    //     <option value="">{field?.placeholder || 'Select an option'}</option>
                    //     {field?.options?.map((opt, idx) => (
                    //         <option key={idx} value={opt}>{opt}</option>
                    //     ))}
                    // </select>
                    <Select
                        isDisabled={true}
                        name="select"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                );
            case 'multiselect':
                return (
                    <Select
                        isDisabled={true}
                        isMulti
                        name="colors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                );
            case 'checkbox':
                return (
                    <input
                        disabled={true}
                        type="checkbox"
                        className="h-5 w-5 text-blue-600"
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        disabled={true}
                        accept={field?.validation?.fileTypes?.join(',')}
                        className={baseStyles}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        disabled={true}
                        placeholder={field?.placeholder || 'Select a date'}
                        className={baseStyles}
                    />
                );
            case 'timepicker':
                return (
                    <input
                        type="time"
                        disabled={true}
                        placeholder={field?.placeholder || 'Select a time'}
                        className={baseStyles}
                    />
                );
            case 'color':
                return (
                    <input
                        type="color"
                        disabled={true}
                        className={`${baseStyles} h-10 cursor-not-allowed`}
                    />
                );
            default:
                return <div className={baseStyles}>{field?.type} (Preview not available)</div>;
        }
    };

    async function handleDeleteField(id) {
        try {
            Swal.fire({
                title: "Are you sure you want to delete this field?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `Cancel`,
                customClass: {
                    popup: 'my-delete-alert'
                }
            }
            ).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    finalDeleteField(id)
                }
            });

        } catch (error) {
            console.log("error while deleting the field", error);
        }
    }

    async function finalDeleteField(id) {
        try {

            const fieldId = id;
            const response = await documentService.deleteCustomField( data?.group?._id, fieldId);
            console.log("response", response);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
            setRefreshCount((prev) => prev + 1);

        } catch (error) {
            console.log("error while deleting the field", error);

        }
    }

    useEffect(() => {
        const fetchFields = async () => {
            try {
                setIsDataLoading(true);
                const response = await documentService.getAllField(data?.group?._id);
                setExistingFields(response?.data?.fields);
                setCreatedFields([]);
                setIsDataLoading(false);
            } catch (error) {
                setIsDataLoading(false);
                setErrors(['Failed to fetch existing fields']);
            }
        };
        fetchFields();
    }, [refreshCount]);


    return (
        <div className="flex flex-col  mt-3 min-h-screen ">

            <div
                className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"}  shadow-lg overflow-hidden transition-transform duration-300 mb-3`}
            >

                <div className="relative z-10  hover:bg-opacity-40 flex flex-col  justify-start py-6 px-4">
                    <div className="text-left   w-[100%] ">
                        <h2 className=" md:text-2xl text-xl font-bold mb-2 drop-shadow-md">
                            {`${data?.group?.name}`}
                        </h2>
                    </div>
                </div>
            </div>

            {
                 isDataLoading ?
                    <>
                        <div 
                        // className="w-[100%] h-60 flex justify-center items-center mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 "
                                                className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} h-60   shadow-lg flex justify-center items-center transition-transform duration-300 mb-3 p-6`}

                        >
                            <svg
                                className={`animate-spin mr-2 h-10 w-10  text-black dark:text-white`}
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
                            <span>Loading</span>
                        </div>
                    </> :

                    <div
                        // className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 "
                        className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"}  shadow-lg  transition-transform duration-300 mb-3 p-6`}

                    >
                        <div className='flex  md:flex-row flex-col md:justify-between justify-start md:items-center  mb-4'>
                            <h3 className="text-xl font-bold text-formHeadingLight mb-2  dark:text-formHeadingDark">Custom Fields Preview</h3>
                            <div>
                                <button
                                    disabled={isSubmitting}
                                    onClick={() => navigate("/documents/adjust-order", { state: {group: data?.group } })}
                                    className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                >

                                    Adjust Order

                                </button>

                            </div>

                        </div>


                        {
                            [...existingFields, ...createdFields].length > 0 ?
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                    {[...existingFields, ...createdFields]
                                        .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                        .map((field, index) => {
                                            return (
                                                <div
                                                    className='relative'
                                                    key={index}
                                                    style={{ order: field?.gridConfig?.order }}
                                                >

                                                    {
                                                        field?.isDeleteAble ?
                                                            <Tippy
                                                                content={"delete"}
                                                                placement="top"
                                                            >
                                                                <button
                                                                    onClick={() => handleDeleteField(field?._id)}
                                                                    className={`bg-red-400/20 dark:bg-red-200 absolute top-[2.1rem] right-2 text-[.90rem] font-bold text-black dark:text-white px-1 py-1 rounded-full`}
                                                                >
                                                                    <RiDeleteBinLine className='text-red-600 ' />
                                                                </button>
                                                            </Tippy> :

                                                            <span className=' absolute top-[2.1rem] right-2'>
                                                                <RxValueNone className='text-green-900 dark:text-green-200' />
                                                            </span>


                                                    }

                                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                                                        {field?.label}{field?.isRequired && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {renderFieldPreview(field)}
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                </div>
                                :
                                <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                                    <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                                    <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                        No Fields Found
                                    </p>
                                </div>
                        }


                    </div>

            }



            {/* Field section */}
            <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"}  shadow-lg  mb-3`}>
                <div className="bg-cardBgLight dark:bg-cardBgDark p-6 ">
                    <h2 className="md:text-2xl text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">Add Custom Field</h2>
                    <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Field Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') e.preventDefault(); // Prevent spacebar
                                    }}
                                    required
                                    className="form-control py-2"
                                    placeholder="e.g., emergencyContact"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Label</label>
                                <input
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    required
                                    className="form-control py-2"
                                    placeholder="e.g., Emergency Contact"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Type</label>
                                <Select
                                    options={fieldTypes}
                                    value={fieldTypes.find(opt => opt.value === formData.type) ? fieldTypes.find(opt => opt.value === formData.type) : null}
                                    onChange={(selected) => handleSelectChange('type', selected)}
                                    className="basic-single "
                                    classNamePrefix="select"
                                    styles={customStyles}
                                    required
                                />
                            </div>
                            {['text', 'number', 'email', 'textarea', 'hyperlink'].includes(formData.type) && (
                                <div>
                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Placeholder</label>
                                    <input
                                        type="text"
                                        name="placeholder"
                                        value={formData.placeholder}
                                        onChange={handleChange}
                                        className="form-control py-2"
                                        placeholder="e.g., Enter your email"
                                    />
                                </div>
                            )}
                        </div>

                        {(formData.type === 'select' || formData.type === 'multiselect') && (
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Options</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={optionInput}
                                        onChange={(e) => setOptionInput(e.target.value)}
                                        className="flex-1 bg-transparent p-2 border border-gray-300 rounded-md"
                                        placeholder="Add an option"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                            className={`bg-lightBtn dark:bg-darkBtn p-3 items-center rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                    >
                                        <span><FiPlus /> </span>
                                        <span>Add</span>

                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                            <span>{option}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.type === 'file' && (
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Accepted File Types</label>
                                <Select
                                    isMulti
                                    options={commonFileTypes}
                                    value={commonFileTypes.filter(opt => formData.validation.fileTypes.includes(opt.value))}
                                    onChange={handleFileTypesChange}
                                    // className="basic-multi-select bg-transparent"
                                    classNamePrefix="select"
                                    placeholder="Select file types..."
                                />
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Custom File Type</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={fileTypeInput}
                                            onChange={(e) => setFileTypeInput(e.target.value)}
                                            className="flex-1 bg-transparent p-2 border border-gray-300 rounded-md"
                                            placeholder="e.g., image/x-icon"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFileType}
                                            className={`bg-lightBtn dark:bg-darkBtn p-3 items-center rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                        >
                                            <span><FiPlus /> </span>
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {formData.validation.fileTypes.map((fileType, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
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
                                        value={formData.validation.maxSize}
                                        onChange={handleChange}
                                        className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
                                        placeholder="e.g., 5242880 (5MB)"
                                    />
                                </div>
                            </div>
                        )}


                        {formData.type === 'file' && (
                            <div>
                                <div className="flex flex-row gap-2 items-center">
                                    <p className='font-semibold'>Aspect Ratio (Optional)</p>
                                    <Tippy
                                        content={
                                            "You can set the aspect ratio of the image file. Define the width and height respectively. If left blank, it defaults to 3/4."
                                        }
                                        placement="top"
                                        trigger={trigger}
                                        interactive={true}
                                        hideOnClick={true}
                                    >
                                        <span className="cursor-pointer">
                                            <FaInfoCircle />
                                        </span>
                                    </Tippy>
                                </div>
                                <div className="flex flex-row">
                                    <div className="mt-4 md:w-[10%] w-[30%]">
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Width</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={aspectRation?.xAxis}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        setAspectRation((prev) => ({
                                                            ...prev,
                                                            xAxis: value,
                                                        }));
                                                    }
                                                }}
                                                className="flex-1 md:w-[10%] w-[20%] bg-transparent p-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 4"
                                            />
                                        </div>
                                    </div>
                                    <div className=' flex flex-col justify-end items-center w-7'>
                                        <span className='text-4xl'>/</span>
                                    </div>
                                    <div className="mt-4 md:w-[10%] w-[30%]">
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Height</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={aspectRation?.yAxis}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        setAspectRation((prev) => ({
                                                            ...prev,
                                                            yAxis: value,
                                                        }));
                                                    }
                                                }}
                                                className="flex-1 md:w-[10%] w-[20%] bg-transparent p-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isRequired"
                                checked={formData.isRequired}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-600"
                            />
                            <label className="text-sm font-medium text-formLabelLight dark:text-formLabelDark">Required Field</label>
                        </div>
                        {
                            (formData.type == 'file' || formData.type == "date" || formData.type == "select" || formData.type == "multiselect" || formData.type == "datepicker" || formData.type == "timepicker" || formData.type == "color" || formData.type == "checkbox") ? ""
                                :
                                (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-formHeadingLight dark:text-formHeadingDark">Validation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Regex</label>
                                                <input
                                                    type="text"
                                                    name="validation.regex"
                                                    value={formData.validation.regex}
                                                    onChange={handleChange}
                                                    className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., ^[0-9]{10}$"
                                                />
                                            </div>

                                            {
                                                (formData.type == 'text' || formData.type == 'textarea' || formData.type == 'hyperlink') ?
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Min Length</label>
                                                            <input
                                                                type="number"
                                                                name="validation.minLength"
                                                                value={formData.validation.minLength}
                                                                onChange={handleChange}
                                                                className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max Length</label>
                                                            <input
                                                                type="number"
                                                                name="validation.maxLength"
                                                                value={formData.validation.maxLength}
                                                                onChange={handleChange}
                                                                className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </>
                                                    :
                                                    ""
                                            }
                                            {
                                                formData.type == 'number' ?
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Min Value</label>
                                                            <input
                                                                type="number"
                                                                name="validation.min"
                                                                value={formData.validation.min}
                                                                onChange={handleChange}
                                                                className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max Value</label>
                                                            <input
                                                                type="number"
                                                                name="validation.max"
                                                                value={formData.validation.max}
                                                                onChange={handleChange}
                                                                className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                    </> : ""
                                            }
                                        </div>
                                    </div>
                                )
                        }

                        {errors.length > 0 && (
                            <div className="p-4 bg-red-100 rounded-md">
                                {errors.map((error, index) => (
                                    <p key={index} className="text-red-700 text-sm">{error}</p>
                                ))}
                            </div>
                        )}

                        <div className='flex justify-end'>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}

                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin mr-2 h-5 w-5 text-white"
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
                                        Submitting...
                                    </>
                                ) : (
                                    `Create Field`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DocCustomField
