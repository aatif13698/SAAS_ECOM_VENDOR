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
import loadingImg from "../../assets/images/aestree-logo.png"




function SubCategory({ centered, noFade, scrollContent }) {
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
    const [iconImgErr, setIconImgErr] = useState("");
    const [imgPreview, setImgPreviwe] = useState(null);
    const [selectedFile, setselectedFile] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState([]);

    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        slug: "",
        categoryId: ""
    });
    console.log("formData subcategory", formData);

    const [formDataErr, setFormDataErr] = useState({
        name: "",
        description: "",
        slug: "",
        icon: "",
        categoryId: ""
    });
    const {
        name,
        slug,
        description,
        categoryId
    } = formData;

    const closeModal = () => {
        setShowModal(false);
        setLoading(false)
        setFormData((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            categoryId: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
            categoryId: ""
        }));
        setImgPreviwe(null);
        setselectedFile(null);
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
                    const response = await subcategoryService.getAllList({ page, keyword: nextValue, perPage })
                    setPaginationData(response?.data?.subCategories)
                    setTotalRows(response?.data?.count)
                    setPending(false)
                } catch (error) {
                    setPending(false)
                    console.log("error while getting faq list", error);
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
            slug: "",
            categoryId: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
            categoryId: ""
        }));
        setId(null)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const errorMessages = {
            name: "Subcategory name is Required",
            slug: "Slug is Required",
            description: "Description is Required",
            categoryId: "Category is required"
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

    function validation() {
        const fieldErrors = {
            name: "Category Name is Required",
            slug: "Slug is Required",
            description: "Description is Required",
            categoryId: "category is required."
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
        if (!id) {
            if (!selectedFile) {
                errors["icon"] = "Icon is required"
            }

        }
        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));
        return errorCount > 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const isError = validation()
        if (!isError) {
            const clientId = localStorage.getItem("saas_client_clientId");

            const formData = new FormData();
            formData.append("clientId", clientId);
            formData.append("name", name);
            formData.append("slug", slug);
            formData.append("description", description);
            formData.append("categoryId", categoryId)
            if (selectedFile) {
                formData.append("icon", selectedFile);
            }
            setLoading(true)
            if (id) {
                try {
                    formData.append("subCategoryId", id)
                    const response = await subcategoryService.update(formData)
                    closeModal()
                    toast.success(response.data.message)

                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while Updating", error);
                }
            } else {
                try {
                    const response = await subcategoryService?.create(formData)
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
            name: row?.name,
            slug: row?.slug,
            description: row?.description,
            categoryId: row?.categoryId
        }));
        setImgPreviwe(`http://localhost:8088/icon/${row?.icon}`)
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
            categoryId: ""
        }))
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
            name: row?.name,
            slug: row?.slug,
            description: row?.description,
            categoryId: row?.categoryId

        }))
        setImgPreviwe(`http://localhost:8088/icon/${row?.icon}`)
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
            categoryId: ""
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
            const response = await subcategoryService.deleteOne({ id, page, keyword: keyWord, perPage });
            setPaginationData(response?.data?.data?.subCategories)
            setTotalRows(response?.data?.data?.count)
        } catch (error) {
            console.log("Error while deleting Business Unit", error);
        }
    }

    const handleActive = async (row) => {
        const id = row._id
        let status = "1"
        setToggleWord(false)
        setShowLoadingModal(true)
        row.isActive ? (status = "0") : (status = "1")
        try {
            const response = await subcategoryService.activeInActive({ id, status, page, keyword: keyWord, perPage });
            console.log("actve", response);

            setPaginationData(response?.data?.data?.subCategories)
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
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Sulg",
            selector: (row) => row.slug,
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
    }, [])

    async function getAllActiveCategory() {
        try {
            const response = await subcategoryService.getAllActiveCategory();
            setActiveCategory(response?.data)
        } catch (error) {
            console.log("error in getting active category", error);
        }
    }


    async function getAllList(data) {
        try {
            const response = await subcategoryService.getAllList(data)
            setPaginationData(response?.data?.subCategories)
            setTotalRows(response?.data?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await subcategoryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.subCategories)
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
            const response = await subcategoryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.subCategories)
            setTotalRows(response?.data?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const handleFileChange = (e) => {
        const { name, value } = e.target;
        if (name == "profileImage") {
            if (!selectedFile && value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "Icon is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "",
                }));
            }
        }
        setIconImgErr("");
        let fileSize = 0;
        let errorCount = 0;
        const file = e.target.files[0];
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setIconImgErr("Only img file is allowd");
                errorCount++;
            }
            if (fileSize > 1024) {
                setIconImgErr("file size less than 1MB");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setselectedFile(file);
                setImgPreviwe(imageAsBase64);
            }
        }
    };
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="table-heading text-start ">
                <button className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                    onClick={handleCreate} >
                    Create Subcategory
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
                        // <div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>
                        //     <FormLoader />
                        // </div>
                        <div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
                            <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />

                            <p className="text-center text-bold text-2xl" style={noDataStyle}>
                                Processing...
                            </p>
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
                                                Create Subcategory
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
                                                            Category <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="categoryId"
                                                        value={categoryId}
                                                        onChange={handleChange}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                        disabled={isViewed}
                                                    >
                                                        <option value="">None</option>

                                                        {activeCategory &&
                                                            activeCategory?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.categoryId}</p>}

                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Subcategory Name <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            value={name}
                                                            placeholder="Enter subcategory name"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.name}</p>}
                                                    </label>
                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Slug
                                                        </p>
                                                        <input
                                                            name="slug"
                                                            type="text"
                                                            value={slug}
                                                            placeholder="Enter slug"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.slug}</p>}
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
                                                        value={description}
                                                        rows={3}
                                                        disabled={isViewed}

                                                        onChange={handleChange}
                                                    ></textarea>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.description}</p>}
                                                </div>
                                                <div
                                                    className={`md:col-span-2 ${formDataErr?.icon !== "" ? "has-error" : ""}  mt-2 form-control  px-4 py-2 `}
                                                >
                                                    <p className="form-label">
                                                        Category Icon
                                                        <span className="text-red-500">*</span>
                                                    </p>
                                                    <label
                                                        htmlFor={isViewed ? "" : "imageInput"}
                                                        className="cursor-pointer"
                                                    >
                                                        <div
                                                            htmlFor="imageInput"
                                                            className="flex flex-col items-center justify-between "
                                                        >
                                                            <label
                                                                htmlFor={isViewed ? "" : "imageInput"}
                                                                className="cursor-pointer"
                                                            >
                                                                <img
                                                                    src={
                                                                        imgPreview ? imgPreview : IconImg
                                                                    }
                                                                    alt="Default"
                                                                    className="w-16 h-16 object-cover"
                                                                />
                                                            </label>
                                                            <input
                                                                name="profileImage"
                                                                id="imageInput"
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                            />
                                                            <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                {iconImgErr}
                                                            </span>
                                                            <label
                                                                htmlFor="imageInput"
                                                                className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                            >
                                                                <p
                                                                    className={`${isDark ? "text-secondary-300" : ""
                                                                        }`}
                                                                >
                                                                    {!imgPreview ? "click to upload icon" : selectedFile?.name}
                                                                </p>
                                                            </label>{" "}
                                                            {
                                                                <p className="text-sm text-red-500">
                                                                    {formDataErr.icon}
                                                                </p>
                                                            }
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
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

export default SubCategory