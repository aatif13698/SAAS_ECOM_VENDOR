import useDarkmode from '@/hooks/useDarkMode';
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "react-data-table-component";
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import categoryService from '@/services/category/category.service';
import subcategoryService from '@/services/subCategory/subcategory.service';
import Tooltip from '../../components/ui/Tooltip';
import Icons from '@/components/ui/Icon';
import Swal from "sweetalert2";
import debounceFunction from '@/helper/Debounce';
// import loadingImg from "../../assets/images/logo/Kosmo-Clinic-Logo.png"
import FormLoader from '@/Common/formLoader/FormLoader';
import IconImg from "../../assets/images/aestree-logo.png"
import tableConfigure from '../common/tableConfigure';
import AttributeValue from './AttributeValue';
import attributeService from '@/services/attribute/attribute.service';
import productBlueprintService from '@/services/productBlueprint/productBlueprint.service';




function Attribute({ centered, noFade, scrollContent }) {
    const [isDark] = useDarkmode()
    const { noDataStyle, customStyles } = tableConfigure()

    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isViewed, setIsViewed] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [paginationData, setPaginationData] = useState();
    const [id, setId] = useState(null);
    const [keyWord, setkeyWord] = useState("");
    const [toggleWord, setToggleWord] = useState(false);
    // const [iconImgErr, setIconImgErr] = useState("");
    // const [imgPreview, setImgPreviwe] = useState(null);
    // const [selectedFile, setselectedFile] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState([]);
    const [activeSubCategory, setActiveSubCategory] = useState([]);
    const [selectedAttributeValue, setSelectedAttributeValue] = useState([])

    console.log("selectedAttributeValue", selectedAttributeValue);

    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [attribute, setAttribute] = useState({
        name: "",
        description: "",
    });

    console.log("attribute", attribute);

    const [activeProductBlueprint, setActiveProductBlueprint] = useState([]);
    


    const [attributeError, setAttributeError] = useState({});

    const [attributeArray, setAttributeArray] = useState([]);

    console.log("attributeError", attributeError);



    const [formData, setFormData] = useState({
        productId: "",
    });

    const [formDataErr, setFormDataErr] = useState({
        productId: "",
    });
    console.log("formDataErr", formDataErr);

    const {
        productId,
        categoryId,
        subCategoryId,
    } = formData;

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

    const closeModal = () => {
        setShowModal(false);
        setLoading(false)
        setFormData((prev) => ({
            ...prev,
            name: "",
            description: "",
            categoryId: "",
            subCategoryId: "",
            values: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            icon: "",
            categoryId: "",
            subCategoryId: "",
            values: ""
        }));
        setSelectedAttributeValue([])
        setLoading(false);
        setId(null)
        setRefresh((prev) => prev + 1)
    };

    const openModal = () => {
        setShowModal(!showModal);
    };

    const handleFilter = (e) => {
        let newkeyWord = e.target.value;
        setkeyWord(newkeyWord);
        debounceSearch(newkeyWord)
    };

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    setPending(true)
                    const response = await attributeService.getAllList({ page, keyword: nextValue, perPage })
                    setPaginationData(response?.data?.attributes)
                    setTotalRows(response?.data?.count)
                    setPending(false)
                } catch (error) {
                    setPending(false)
                    console.log("error while getting list", error);
                }
            },
            1000
        ),
        []
    );

    function handleCreate() {
        openModal()
        setIsViewed(false)
        setFormData((prev) => ({
            ...prev,
            name: "",
            description: "",
            categoryId: "",
            subCategoryId: "",
            values: "",
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            values: "",
            categoryId: "",
            subCategoryId: ""
        }));
        setId(null)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const errorMessages = {
            productId : "Product id is required.",
        };
        setFormDataErr((prev) => ({
            ...prev,
            [name]: value === "" ? errorMessages[name] : "",
        }));
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    useEffect(() => {
        if (selectedAttributeValue.length == 0) {
            setAttributeError((prev) => ({
                ...prev,
                ["values"]: "Values are required."
            }))
        } else {
            setAttributeError((prev) => ({
                ...prev,
                ["values"]: ""
            }))
        }
    }, [selectedAttributeValue])



    function handleSaveAndMore(e) {
        e.preventDefault();
        let errorCount = 0;
        const errors = {};
        const { name, description } = attribute;
        if (!name) {
            errorCount++
            errors["name"] = "Name is required."
        } else {
            errors["name"] = ""
        }
        if (!description) {
            errorCount++
            errors["description"] = "Description is required."
        } else {
            errors["description"] = ""
        }
        if (selectedAttributeValue.length == 0) {
            errorCount++
            errors["values"] = "Values are required."
        } else {
            errors["values"] = ""
        }


        setAttributeError(errors);

        if (errorCount == 0) {
            setAttributeArray((prev) => ([...prev, {
                name: name,
                description: description,
                values: selectedAttributeValue
            }]));
            setSelectedAttributeValue([])
            setAttribute({
                name: "",
                description: "",
            });
        }

    }

    function validation() {
        const fieldErrors = {
            productId: "Product id is required",
        };
        let errorCount = 0;
        const errors = {};
        Object.keys(fieldErrors).forEach((field) => {
            if (!formData[field]) {
                errors[field] = fieldErrors[field];
                errorCount++;
            } else {
                errors[field] = "";
            }
        });

        if (attributeArray.length == 0) {
            errorCount++;
        }
        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));

        console.log("errorCount aa", errorCount);

        return errorCount > 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const isError = validation();
        console.log("isError", isError);

        if (!isError) {
            const clientId = localStorage.getItem("saas_client_clientId");
            let dataObject = {
                clientId: clientId,
                productId: productId,
                attributes: attributeArray
            }

            setLoading(true)
            if (id) {
                console.log("222");
                dataObject = {
                    ...dataObject,
                    attributesId: id
                }
                try {
                    const response = await attributeService.update(dataObject)
                    closeModal()
                    toast.success(response.data.message)
                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while Updating", error);
                }
            } else {
                try {
                    const response = await attributeService?.create(dataObject);
                    closeModal()
                    toast.success(response.data.message)
                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while creating", error);
                }
            }
        }
    }

    const handleView = (row) => {
        const id = row._id;
        setToggleWord(true)
        setShowLoadingModal(true)
        setIsViewed(true)
        setId(id)
        setFormData((prev) => ({
            ...prev,
            productId: row?.productId?._id,
           
        }));
        setFormDataErr((prev) => ({
            ...prev,
            productId: "",
            
        }));
        setAttributeArray(row?.attributes);
        setShowLoadingModal(false)
        openModal()
    };

    const handleEdit = (row) => {
        const id = row._id;
        openModal()
        setIsViewed(false)
        setId(id)
        setFormData((prev) => ({
            ...prev,
            productId: row?.productId?._id,
           
        }));
        setAttributeArray(row?.attributes);

        setFormDataErr((prev) => ({
            ...prev,
            productId: "",
          
        }))
    };

    const handleDelete = (row) => {
        const id = row._id;
        Swal.fire({
            title: `Are you sure you want to delete ${row.name}?`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: isDark ? "#FF4C4C" : "#DC3545",
            cancelButtonColor: isDark ? "rgb(110 147 143)" : "rgb(4 203 182)",
            background: isDark ? "rgb(29 55 54)" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOne({ id, page, keyword: keyWord, perPage });
            }
        });
    };

    async function deleteOne({ id, page, keyword: keyWord, perPage }) {
        try {
            const response = await attributeService.deleteOne({ id, page, keyword: keyWord, perPage });
            setPaginationData(response?.data?.data?.attributes)
            setTotalRows(response?.data?.data?.count)
        } catch (error) {
            console.log("Error while deleting", error);
        }
    }

    const handleActive = async (row) => {
        const id = row._id
        let status = "1"
        setToggleWord(false)
        setShowLoadingModal(true)
        row.isActive ? (status = "0") : (status = "1")
        try {
            const response = await attributeService.activeInActive({ id, status, page, keyword: keyWord, perPage });
            console.log("actve", response);

            setPaginationData(response?.data?.data?.attributes)
            setTotalRows(response?.data?.data?.count)
            setShowLoadingModal(false)
        } catch (error) {
            setShowLoadingModal(false)

            console.log("Error While doing active and inactive", error);
        }
    }

    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, "");
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = "";
        }
    };

    const columns = [
        {
            name: "Product Name",
            selector: (row) => row?.productId?.name,
        },
       
        {
            name: "Attributes",
            selector: (row) => {
                const attributeArray = row?.attributes?.map((item) => item?.name);
                const nameString = attributeArray.join(", ");
                return nameString
            },
        },

        {
            name: "Status",
            sortable: true,
            selector: (row) => {
                return (
                    <span className="block w-full">
                        <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.isActive === true ? "text-success-500 bg-success-500" : ""
                                } 
                ${row?.isActive === false ? "text-warning-500 bg-warning-500" : ""}
                 `}
                            title={
                                row?.isActive === true
                                    ? "Click to deactivate"
                                    : "Click to activate"
                            }
                            onClick={() => handleActive(row)}
                        >
                            {row.isActive === true ? "Active" : "In Active"}
                        </span>
                    </span>
                );
            },
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="flex  space-x-1 rtl:space-x-reverse ">
                        <Tooltip
                            content="View"
                            placement="top"
                            arrow
                            animation="shift-away"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleView(row)}
                            >
                                <Icon icon="heroicons:eye" />
                            </button>
                        </Tooltip>
                        <Tooltip
                            content="Edit"
                            placement="top"
                            arrow
                            animation="shift-away"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleEdit(row)}
                            >
                                <Icons icon="heroicons:pencil-square" />
                            </button>
                        </Tooltip>
                        <Tooltip
                            content=" Delete"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleDelete(row)}
                            >
                                <Icon icon="heroicons:trash" />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllList({ page, keyword: keyWord, perPage })
    }, [refresh]);

    useEffect(() => {
        getAllActiveCategory()
        getActiveProducctBlueprint()
    }, [])

    async function getAllActiveCategory() {
        try {
            const response = await subcategoryService.getAllActiveCategory();
            setActiveCategory(response?.data)
        } catch (error) {
            console.log("error in getting active category", error);
        }
    }

     async function getActiveProducctBlueprint() {
            try {
                const response = await productBlueprintService.getActive();
                setActiveProductBlueprint(response.data.roductBluePrints)
            } catch (error) {
                console.log("error in getting active", error);
            }
        }


    async function getAllList(data) {
        try {
            const response = await attributeService.getAllList(data)
            setPaginationData(response?.data?.attributes)
            setTotalRows(response?.data?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await attributeService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.attributes)
            setTotalRows(response?.data?.count)
            setPerPage(perPage)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const handlePageChange = async (page) => {
        try {
            const response = await attributeService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.attributes)
            setTotalRows(response?.data?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="table-heading text-start ">
                <button className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                    onClick={handleCreate} >
                    Create Attribute
                </button>
            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkInput text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                    onChange={handleFilter}
                />
            </div>
        </div>
    );

    return (
        <>
            <div className={` shadow-md ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
                <div className="text-end mb-4">
                    <div className="flex gap-5 justify-between"></div>
                </div>
                {/* table */}
                <DataTable
                    columns={columns}
                    data={paginationData}
                    highlightOnHover
                    customStyles={customStyles}
                    fixedHeader
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowChange}
                    // selectableRows
                    pointerOnHover
                    progressPending={pending}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    // paginationComponentOptions={paginationOptions}
                    noDataComponent={<div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            There is no record to display
                        </p>
                    </div>
                    }
                    progressComponent={
                        <div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>
                            <FormLoader />
                        </div>
                    }
                />
                {/* model */}
                <Transition appear show={showModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[99999]"
                        onClose={closeModal}
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
                        <div className="fixed inset-0 overflow-y-auto">
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
                                        text-left align-middle shadow-xl transition-alll max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                    >
                                        <div
                                            className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                        >
                                            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                                Create Attribute
                                            </h2>
                                            <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                                <Icon icon="heroicons-outline:x" />
                                            </button>
                                        </div>

                                        <div
                                            className={`px-0 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                                }`}
                                        >


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-4">
                                                 <div className='md:col-span-2'
                                                >
                                                    <label >
                                                        <p className="form-label">
                                                            Product <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="productId"
                                                        value={productId}
                                                        onChange={handleChange}
                                                        disabled={isViewed}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeProductBlueprint &&
                                                            activeProductBlueprint?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.productId}</p>}

                                                </div>
                                                {/* <div className=''
                                                >
                                                    <label >
                                                        <p className="form-label">
                                                            Category <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="categoryId"
                                                        value={categoryId}
                                                        disabled={isViewed}
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

                                                </div> */}
                                                {/* <div className=''
                                                >
                                                    <label >
                                                        <p className="form-label">
                                                            Subcategory <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="subCategoryId"
                                                        value={subCategoryId}
                                                        disabled={isViewed}
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

                                                </div> */}
                                                {/* <div className="col-span-2">
                                                    <label>
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
                                                </div> */}
                                                {/* <div className="col-span-2">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Value<span className="text-red-500">*</span>
                                                        </p>

                                                        <AttributeValue selectedFinding={selectedAttributeValue} setSelectedFinding={setSelectedAttributeValue} isViewed={isViewed} />

                                                        {<p className="text-red-600  text-xs"> {formDataErr.values}</p>}
                                                    </label>
                                                </div> */}
                                                {/* <div className="md:col-span-2">
                                                    <label style={{ marginBottom: "4px" }}>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Description <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <textarea
                                                        name='description'
                                                        className={` form-control py-2 `}
                                                        placeholder="Enter description"
                                                        value={description}
                                                        rows={3}
                                                        disabled={isViewed}

                                                        onChange={handleChange}
                                                    ></textarea>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.description}</p>}
                                                </div> */}
                                            </div>

                                            {
                                                isViewed ? "" :
                                                    <div className=" my-4 bg-gray-300/80 dark:bg-darkAccent rounded-md mx-2 px-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-2   my-4 py-2 px-2  gap-5 ">
                                                            <div className="col-span-2">
                                                                <label>
                                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                                        Name <span className="text-red-500">*</span>
                                                                    </p>
                                                                    <input
                                                                        name="name"
                                                                        type="text"
                                                                        value={attribute?.name}
                                                                        placeholder="Enter name"
                                                                        onChange={(e) => {
                                                                            const { name, value } = e.target;
                                                                            setAttribute((prev) => ({
                                                                                ...prev,
                                                                                [name]: value,
                                                                            }));
                                                                            if (!value) {
                                                                                setAttributeError((prev) => ({
                                                                                    ...prev,
                                                                                    [name]: "Name is required"
                                                                                }))
                                                                            } else {
                                                                                setAttributeError((prev) => ({
                                                                                    ...prev,
                                                                                    [name]: ""
                                                                                }))
                                                                            }
                                                                        }}
                                                                        readOnly={isViewed}
                                                                        className="form-control py-2"
                                                                    />
                                                                    {<p className="text-red-600  text-xs"> {attributeError?.name ? attributeError?.name : ""}</p>}
                                                                </label>
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <label style={{ marginBottom: "4px" }}>
                                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                                        Description <span className="text-red-500">*</span>
                                                                    </p>
                                                                </label>
                                                                <textarea
                                                                    name='description'
                                                                    className={` form-control py-2 `}
                                                                    placeholder="Enter description"
                                                                    rows={3}
                                                                    disabled={isViewed}
                                                                    value={attribute?.description}
                                                                    onChange={(e) => {
                                                                        const { name, value } = e.target;
                                                                        setAttribute((prev) => ({
                                                                            ...prev,
                                                                            [name]: value,
                                                                        }));
                                                                        if (!value) {
                                                                            setAttributeError((prev) => ({
                                                                                ...prev,
                                                                                [name]: "Description is required"
                                                                            }))
                                                                        } else {
                                                                            setAttributeError((prev) => ({
                                                                                ...prev,
                                                                                [name]: ""
                                                                            }))
                                                                        }
                                                                    }}
                                                                ></textarea>
                                                                {<p className="text-red-600  text-xs"> {attributeError?.description ? attributeError?.description : ""}</p>}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label>
                                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                                        Value<span className="text-red-500">*</span>
                                                                    </p>

                                                                    <AttributeValue selectedFinding={selectedAttributeValue} setSelectedFinding={setSelectedAttributeValue} isViewed={isViewed} />

                                                                    {<p className="text-red-600  text-xs"> {attributeError?.values ? attributeError?.values : ""}</p>}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end py-2 px-2 ">
                                                            <button
                                                                onClick={handleSaveAndMore}
                                                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                            >
                                                                Save & Add more
                                                            </button>
                                                        </div>

                                                    </div>
                                            }


                                            {
                                                attributeArray && attributeArray?.length > 0 ?
                                                    <div className='overflow-x-auto my-4 px-2'>
                                                        <table className="min-w-full ">
                                                            <thead className="bg-[#C9FEFF] dark:bg-darkBtn dark:text-white sticky top-0">
                                                                <tr className="border-b border-dashed border-lighttableBorderColor">
                                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                        Name
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                        Description
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                        Values
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3 text-end text-xs font-semibold  tracking-wider">
                                                                        Action
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-darkAccent">
                                                                {attributeArray && attributeArray.length > 0 ? (
                                                                    attributeArray.map((item, ind) => {
                                                                        const valuesArray = item.values.map((items) => items.valueName)
                                                                        const valuesString = valuesArray.join(", ");
                                                                        return (
                                                                            <tr key={ind} className="border-b border-dashed border-lighttableBorderColor">
                                                                                <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                    {item.name}
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                    {item.description}
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                    {valuesString}
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
                                                                                                    const updatedArray = [...attributeArray];
                                                                                                    updatedArray.splice(ind, 1);
                                                                                                    setAttributeArray(updatedArray);
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

                                        {(
                                            <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
                                                <div className="flex gap-2">
                                                    <Button
                                                        text="Cancel"
                                                        // className="border bg-red-300 rounded px-5 py-2"
                                                        className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                                                        onClick={() => closeModal()}
                                                    />

                                                    {
                                                        isViewed && (
                                                            <Button
                                                                text="Edit"
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` bg-lightBtn dark:bg-darkBtn px-4 py-2 rounded`}
                                                                onClick={() => setIsViewed(false)}
                                                                isLoading={loading}
                                                            />

                                                        )
                                                    }
                                                    {
                                                        !isViewed && (
                                                            <Button
                                                                text={`${id ? "Update" : "Save"}`}
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                                                onClick={handleSubmit}
                                                                isLoading={loading}
                                                            />

                                                        )
                                                    }


                                                </div>
                                            </div>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
                {/* loding dialog */}
                <Transition appear show={showLoadingModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[99999]"
                        onClose={handleCloseLoadingModal}
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

                        <div className="fixed inset-0 overflow-y-auto">
                            <div
                                className={`flex min-h-screen min-w-full justify-center text-center p-6 items-center "
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
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] `}
                                    >
                                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                            <FormLoader />
                                            {
                                                toggleWord ? <p className='py-3'>Loading...</p> : <p className='py-5'>processing...</p>
                                            }

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    )
}

export default Attribute