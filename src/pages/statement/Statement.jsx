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
import financialYearService from '@/services/financialYear/financialYear.service';
import currencyService from '@/services/currency/currency.service';
import statementService from '@/services/statement/statement.service';
import { useNavigate } from 'react-router-dom';




function Statement({ centered, noFade, scrollContent }) {
    const navigate = useNavigate()
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
    const [imgPreview, setImgPreviwe] = useState(null);
    const [selectedFile, setselectedFile] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState([]);

    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        decimalName: "",
        decimaNumber: "",
        symbol: "",
        isBase: false

    });
    console.log("formData currency", formData);

    const [formDataErr, setFormDataErr] = useState({
        code: "",
        name: "",
        decimalName: "",
        decimaNumber: "",
        symbol: "",
    });
    const {
        code,
        name,
        decimalName,
        decimaNumber,
        symbol,
        isBase,
    } = formData;

    const validateField = (name, value) => {
        const rules = {
            code: [
                [!value, "Code is Required"],
            ],
            name: [[!value, "Name is required"]],
            decimalName: [[!value, "Decimal Name is required"]],
            decimaNumber: [[!value, "Decimal Number is required"]],
            symbol: [[!value, "Symbol is required"]],
            decimalName: [[!value, "Decimal Name is required"]],
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };



    const validationFunction = () => {
        let errors = {
            code: validateField("code", code),
            name: validateField("name", name),
            decimalName: validateField("decimalName", decimalName),
            decimaNumber: validateField("decimaNumber", decimaNumber),
            symbol: validateField("symbol", symbol),
        };
        setFormDataErr((prev) => ({
            ...prev,
            ...errors
        }));
        return Object.values(errors).some((error) => error);
    };

    const closeModal = () => {
        setShowModal(false);
        setLoading(false)
        setFormData((prev) => ({
            ...prev,
            startDate: "",
            endDate: "",
            isClosed: false,
            notes: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            startDate: "",
            endDate: "",
            isClosed: "",
            notes: ""
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
        navigate("/create-statement")
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const isError = validationFunction()
        if (!isError) {
            const clientId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                clientId: clientId,
                code: code,
                name: name,
                decimalName: decimalName,
                decimaNumber: decimaNumber,
                symbol: symbol,
                isBase: isBase,
            }

            setLoading(true);
            if (id) {
                try {
                    const response = await currencyService.update({ ...dataObject, currencyId: id })
                    closeModal();
                    toast.success(response.data.message)
                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while Updating", error);
                }
            } else {
                try {
                    const response = await currencyService?.create(dataObject)
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
        const name = "view"
        navigate("/create-statement", { state: { id, row, name } });
    };
    const handleEdit = (row) => {
        const id = row._id;
        const name = "edit"
        navigate("/create-statement", { state: { id, row, name } });
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


    const columns = [
        {
            name: "Type",
            selector: (row) => row?.type,
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) => row?.title,
            sortable: true,
        },
        {
            name: "Status",
            sortable: true,
            selector: (row) => {

                return (
                    <span className="block w-full">
                        <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.isActive == 1 ? "text-success-500 bg-success-500" : ""
                                }
            ${row?.isActive == 0 ? "text-warning-500 bg-warning-500" : ""}

             `}
                            title={
                                row?.isActive == 1
                                    ? "Click To Deactivate"
                                    : "Click To Activate"
                            }
                            onClick={() => handleActive(row)}
                        >
                            {row.isActive == 1 ? "Active" : "Inactive"}
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


    async function getAllList() {
        try {
            const response = await statementService.getList(page, keyWord, perPage)
            setPaginationData(response?.data?.statements)
            setTotalRows(response?.data?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handleActive = async (row) => {
        setShowLoadingModal(true)
        const id = row._id;
        let status = 1;
        row.isActive == 1 ? (status = 0) : (status = 1);
        try {
            const clinetId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                keyword: keyWord,
                page: page,
                perPage: perPage,
                status: status,
                id: id,
                clientId: clinetId
            }
            const response = await statementService.activeInactive(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.statements);
            toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`);
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false);
            toast.error(error?.response?.data?.message)
            console.error("Error while activating:", error?.response?.data?.message);
        }
    };

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await subcategoryService.getAllList(page, keyWord, perPage)
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
            const response = await subcategoryService.getAllList(page, keyWord, perPage)
            setPaginationData(response?.data?.subCategories)
            setTotalRows(response?.data?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };


    const handleIsBase = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                isBase: !prev.isBase
            }));
            setFormDataErr((prev) => ({
                ...prev,
                isBase: validateField("isBase", !prev.isBase)
            }));
        }
    };


    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="table-heading text-start ">
                <button className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                    onClick={handleCreate} >
                    Create Statement
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
                                                Create Currency
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

                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Code <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="code"
                                                            type="text"
                                                            value={code}
                                                            placeholder='e.g., INR'
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.code}</p>}
                                                    </label>
                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Name <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            value={name}
                                                            placeholder='e.g., Rupee'

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
                                                            Decimal Name <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="decimalName"
                                                            type="text"
                                                            value={decimalName}
                                                            placeholder='e.g., paisa'
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.decimalName}</p>}
                                                    </label>
                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Decimal Number <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="decimaNumber"
                                                            type="text"
                                                            value={decimaNumber}
                                                            placeholder='e.g., 2'
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.decimaNumber}</p>}
                                                    </label>
                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Symbol <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="symbol"
                                                            type="text"
                                                            value={symbol}
                                                            placeholder='e.g., ₹'
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control py-2"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.symbol}</p>}
                                                    </label>
                                                </div>
                                                <label className={`fromGroup `}>
                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                        Is Base
                                                    </p>
                                                    <div
                                                        className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isBase ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                                        onClick={handleIsBase}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isBase ? "translate-x-4" : "translate-x-0"}`}
                                                        ></div>
                                                    </div>
                                                    {formDataErr?.isBase && <p className="text-red-600 text-xs">{formDataErr.isBase}</p>}
                                                </label>
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

export default Statement