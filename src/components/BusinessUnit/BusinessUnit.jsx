import useDarkmode from '@/hooks/useDarkMode';
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "react-data-table-component";
import Button from '../ui/Button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import businessUnitService from '@/services/businessUnitService';
import Tooltip from '../ui/Tooltip';
import Icons from '@/components/ui/Icon';
import Swal from "sweetalert2";
import debounceFunction from '@/helper/Debounce';
import loadingImg from "../../assets/images/logo/Kosmo-Clinic-Logo.png"
import FormLoader from '@/Common/formLoader/FormLoader';
import { DialogContent } from "@mui/material";



function BusinessUnit({ centered, noFade, scrollContent }) {
    const [isDark] = useDarkmode()

    const customStyles = {
        header: {
            // For Heading
            style: {
                minheight: "56px",
                color: isDark ? "rgb(203 213 225 / var(--tw-text-opacity));" : "green",
                fontWeight: "bold",
                backgroundColor: isDark
                    ? " #007475"
                    : "#C9FEFF",
            },
        },
        subHeader: {
            style: {
                backgroundColor: isDark
                    ? "rgb(11 55 51 / var(--tw-bg-opacity))"
                    : "white",
                padding: "1.25rem",
                fontSize: "1.125rem",
                fontWeight: "500",
                lineHeight: "24px",
                color: isDark
                    ? "rgb(203 213 225 / var(--tw-text-opacity))"
                    : "rgb(15 23 42 / var(--tw-text-opacity))",
            },
        },
        headRow: {
            style: {
                color: isDark
                    ? "rgb(203 213 225 / var(--tw-text-opacity))"
                    : "rgb(71 85 105 / var(--tw-text-opacity))",
                fontSize: "0.75rem",
                fontWeight: "bold",
                backgroundColor: isDark
                    ? "#007475"
                    : "#C9FEFF",
                // FontFamily: "Inter, sans-serif",
                lineHeight: "1rem",
                textTransform: "uppercase",
                textOpacity: "1",
                letterSpacing: "1px",
                textAlign: "center",
                // borderBottomWidth: "1px",
                // borderBottomColor: "#bdbdbd",
                // borderBottomStyle: "dashed",
            },
        },
        // headcell
        headCells: {
            style: {
                backgroundColor: isDark ? "rgb(0 116 117 / var(--tw-bg-opacity))" : "",  //its is darkAccent backgroundColor
                color: isDark
                    ? "rgb(203 213 225 / var(--tw-text-opacity))"
                    : "rgb(71 85 105 / var(--tw-text-opacity))",

                fontWeight: "bold",
                fontSize: "0.75rem",
                textAlign: "center",
                paddingTop: "20px",
                paddingBottom: "15px",


            },
        },
        cells: {
            style: {
                backgroundColor: isDark ? " rgb(10 41 43 / var(--tw-bg-opacity))" : "", //its is darkAccent backgroundColor
                color: isDark
                    ? "rgb(203 213 225 / var(--tw-text-opacity))"
                    : "rgb(71 85 105 / var(--tw-text-opacity))",
                fontSize: "0.875rem",
                padding: "1.25rem",
                // FontFamily: "Inter, sans-serif",
                lineHeight: "1rem",
                // textTransform: "capitalize",
                textOpacity: "1",
                letterSpacing: "1px",
                textAlign: "center",


            },
        },
        selectableRows: {
            style: {
                backgroundColor: "red",
                color: "red",


            },
        },
        pagination: {
            style: {
                backgroundColor: isDark
                    ? "rgb(10 41 43 / var(--tw-bg-opacity))" //its is darkAccent backgroundColor
                    : "white",
                color: isDark
                    ? "rgb(203 213 225 / var(--tw-text-opacity))"
                    : "rgb(71 85 105 / var(--tw-text-opacity))",
                fontSize: "15px",
            },
        },
    };

    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isViewed, setIsViewed] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [paginationData, setPaginationData] = useState();
    const [buId, setBuId] = useState(null);
    const [keyWord, setkeyWord] = useState("");
    const [selectedRow, setSelectedRow] = useState()
    const [toggleWord, setToggleWord] = useState(false);

    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        middleName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });
    const [formDataErr, setFormDataErr] = useState({
        email: "",
        phone: "",
        firstName: "",
        middleName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });
    const {
        email,
        phone,
        firstName,
        middleName,
        lastName,
        password,
        confirmPassword
    } = formData;


    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
        setLoading(false)
        setFormData((prev) => ({
            ...prev,
            email: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }))
        setFormDataErr((prev) => ({
            ...prev,
            email: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }))
    };

    const openModal = () => {
        setShowModal(!showModal);

    };
    const returnNull = () => {
        return null;
    };




    const handleFilter = (e) => {
        let newkeyWord = e.target.value;
        setkeyWord(newkeyWord);
        setPending(true)
        debounceSearch(newkeyWord)

    };


    const debounceSearch = useCallback(

        debounceFunction(
            async (nextValue) => {

                try {
                    const response = await businessUnitService.getAllBusinessUnitList({ page, keyword: nextValue, perPage })

                    setPaginationData(response?.listOfBusinessUnit)
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


    function handleCreateBusinessUnit() {
        openModal()
        setIsViewed(false)
        setFormData((prev) => ({
            ...prev,
            email: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }))
        setBuId(null)

    }

    function handleChange(e) {
        const { name, value } = e.target
        if (name == "firstName") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    firstName: "First Name is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    firstName: ""
                }))
            }
        }

        if (name == "lastName") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    lastName: "Last Name is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    lastName: ""
                }))
            }
        }

        if (name == "phone") {
            const phoneRegex = /^\d{10}$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: "Phone No. is Required"
                }))
            } else if (!phoneRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: "Phone No. should be 10-digit"
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: ""
                }))
            }
        }

        if (name == "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: "Email is Required"
                }))
            } else if (!emailRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: "Enter valid Email "
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: ""
                }))
            }
        }

        if (name == "password") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: "Password is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: ""
                }))
            }
        }
        if (name == "confirmPassword") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Confirm Password is Required"
                }))
            } else if (password !== value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Password doesn't Match"
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: ""
                }))
            }
        }


        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    function validation() {
        let errorCount = 0;

        if (!firstName) {
            setFormDataErr((prev) => ({
                ...prev,
                firstName: "First Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                firstName: ""
            }))
        }

        if (!lastName) {
            setFormDataErr((prev) => ({
                ...prev,
                lastName: "Last Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                lastName: ""
            }))
        }
        const phoneRegex = /^\d{10}$/;
        if (!phone) {
            setFormDataErr((prev) => ({
                ...prev,
                phone: "Phone No. is Required"
            }))
            errorCount++
        } else if (!phoneRegex.test(phone)) {
            setFormDataErr((prev) => ({
                ...prev,
                phone: "Phone No. should be 10-digit"
            }))
            errorCount++
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                phone: ""
            }))
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setFormDataErr((prev) => ({
                ...prev,
                email: "Email is Required"
            }))
            errorCount++
        } else if (!emailRegex.test(email)) {
            setFormDataErr((prev) => ({
                ...prev,
                email: "Enter valid Email "
            }))
            errorCount++
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                email: ""
            }))
        }

        if (!password) {
            setFormDataErr((prev) => ({
                ...prev,
                password: "Password is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                password: ""
            }))
        }

        if (!confirmPassword) {
            setFormDataErr((prev) => ({
                ...prev,
                confirmPassword: "Confirm Password is Required"
            }))
            errorCount++
        } else if (confirmPassword !== password) {
            setFormDataErr((prev) => ({
                ...prev,
                confirmPassword: "Confirm Password is Required"
            }))
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                confirmPassword: ""
            }))
        }

        if (errorCount > 0) {
            return true
        } else {
            return false
        }
    }


    async function handleSubmitBusinessUnit(e) {
        e.preventDefault();

        const isError = validation()
        if (!isError) {
            setLoading(true)
            const data = formData
            if (buId) {
                try {
                    const response = await businessUnitService.updateBusinessUnit(data, buId)
                    closeModal()
                    toast.success(response.data.message)
                    setLoading(false);
                    setBuId(null)
                    setFormData((prev) => ({
                        ...prev,
                        email: "",
                        phone: "",
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        password: "",
                        confirmPassword: ""
                    }))
                    setRefresh((prev) => prev + 1)
                } catch (error) {
                    console.log("Error while Updating business Unit", error);
                }


            } else {

                try {
                    const response = await businessUnitService.createBusinessUnit(data)
                    closeModal()
                    toast.success(response.data.message)
                    setLoading(false);
                    setBuId(null)
                    setFormData((prev) => ({
                        ...prev,
                        email: "",
                        phone: "",
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        password: "",
                        confirmPassword: ""
                    }))
                    setRefresh((prev) => prev + 1)
                } catch (error) {
                    console.log("Error while creating business Unit", error);
                }

            }


        }

    }

    const handleView = (row) => {
        console.log("row", row);

        const id = row._id;

        setSelectedRow(row)
        setToggleWord(true)
        setShowLoadingModal(true)
        
        setIsViewed(true)
        setBuId(id)
        setFormData((prev) => ({
            ...prev,
            email: row.email,
            phone: row.phone,
            firstName: row.firstName,
            middleName: row.middleName,
            lastName: row.lastName,
            password: "",
            confirmPassword: ""
        }))
        setFormDataErr((prev) => ({
            ...prev,
            email: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }))
        setShowLoadingModal(false)
        openModal()
    };
    const handleEdit = (row) => {
        const id = row._id;
        setSelectedRow(row)
        openModal()
        setIsViewed(false)
        setBuId(id)
        setFormData((prev) => ({
            ...prev,
            email: row.email,
            phone: row.phone,
            firstName: row.firstName,
            middleName: row.middleName,
            lastName: row.lastName,
            password: "",
            confirmPassword: ""
        }))
        setFormDataErr((prev) => ({
            ...prev,
            email: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }))
    };

    const handleDelete = (row) => {
        const id = row._id;
        Swal.fire({
            title: `Are you Sure Want to Delete ${row.firstName + " " + row.middleName + " " + row.lastName}`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {

                deleteBusinessUnit({ id, page, keyword: keyWord, perPage })
            }
        });
    };

    async function deleteBusinessUnit({ id, page, keyword: keyWord, perPage }) {
        try {
            const response = await businessUnitService.deleteBusinessUnit({ id, page, keyword: keyWord, perPage })

            toast.success(response?.data?.message);
            setRefresh((prev) => prev + 1)
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

            const response = await businessUnitService.activeInActiveBusinessUnit({ id, status, page, keyword: keyWord, perPage })
            // toast.success(response?.data?.message);
            setShowLoadingModal(false)
            setRefresh((prev) => prev + 1)

        } catch (error) {
            console.log("Error While doing active and inactive", error);

        }

    }



    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, ""); //Allow only number starts with 6 to 9
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = ""; // Clear the input if no valid characters are present
        }
    };






    const columns = [
        {
            name: "Name",
            selector: (row) => row.firstName + " " + row.lastName,
            sortable: true,
        },

        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Phone",
            selector: (row) => row.phone,
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
        getBusinessUnit({ page, keyword: keyWord, perPage })
    }, [refresh])


    async function getBusinessUnit(data) {
        try {

            const response = await businessUnitService.getAllBusinessUnitList(data)
            // console.log("response", response);
            setPaginationData(response?.listOfBusinessUnit)
            setTotalRows(response?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting business uni list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {

            const response = await businessUnitService.getAllBusinessUnitList({ page, keyword: keyWord, perPage })
            // console.log("response", response);
            setPaginationData(response?.listOfBusinessUnit)
            setTotalRows(response?.count)
            setPerPage(perPage)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting business uni list", error);
        }
    };

    const handlePageChange = async (page) => {
        try {

            const response = await businessUnitService.getAllBusinessUnitList({ page, keyword: keyWord, perPage })
            // console.log("response", response);
            setPaginationData(response?.listOfBusinessUnit)
            setTotalRows(response?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting business uni list", error);
        }
    };


    const noDataStyle = {
        backgroundColor: isDark ? "#0F172A" : "",
        color: isDark
            ? "rgb(203 213 225 / var(--tw-text-opacity))"
            : "rgb(15 23 42 / var(--tw-text-opacity))",
        fontSize: "1rem"
    };
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="table-heading text-start ">
                {/* Organiser Lists */}
                <button className={` ${isDark ? "dark:bg-darkBtn dark:text-white py-3 px-5 rounded" : "hover-fill"}  `}
                    onClick={handleCreateBusinessUnit} >
                    Create Business Unit
                </button>
            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Searching..."
                    // style={inputBoxStyle}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                    onChange={handleFilter}
                />
            </div>
        </div>
    );


    return (
        <>
            <div className={`${isDark ? "   text-white" : ""}`}>
                <div className="text-end mb-4">
                    <div className="flex gap-5 justify-between"></div>
                </div>
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
                    selectableRows
                    pointerOnHover
                    progressPending={pending}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    // paginationComponentOptions={paginationOptions}
                    noDataComponent={<div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>

                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            There is no record to display
                        </p>
                    </div>
                    }
                    progressComponent={
                        <div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
                            <img src={loadingImg} alt="No Data Image" style={{ height: "3rem", width: "3rem" }} />
                            <p className="text-center text-bold text-2xl" style={noDataStyle}>
                                Processing...
                            </p>
                        </div>
                    }
                />

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
                                       bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll max-w-3xl`}
                                    >
                                        <div
                                            className={`relative overflow-hidden py-4 px-5 border-b border-slate-100 text-lightModalHeaderColor flex justify-between  `}
                                        >
                                            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor">
                                                Create Business Unit
                                            </h2>
                                            <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                                <Icon icon="heroicons-outline:x" />
                                            </button>
                                        </div>
                                        <div
                                            className={`px-6 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                                }`}
                                        >
                                            <h4 class="font-medium text-lg  px-4 py-2 text-lightModalHeaderColor">
                                                Personal Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden p-4">


                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            First Name <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="firstName"
                                                            type="text"
                                                            value={firstName}
                                                            placeholder="Enter First Name"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.firstName}</p>}
                                                    </label>
                                                </div>

                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Middle Name
                                                        </p>
                                                        <input
                                                            name="middleName"
                                                            type="text"
                                                            value={middleName}
                                                            placeholder="Enter Middle Name"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                    </label>
                                                </div>

                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Last Name <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="lastName"
                                                            type="text"
                                                            value={lastName}
                                                            placeholder="Enter Last Name"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.lastName}</p>}
                                                    </label>
                                                </div>


                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Mobile No <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="phone"
                                                            type="text"
                                                            value={phone}
                                                            placeholder="Enter Mobile No"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            onInput={handleKeyPress}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.phone}</p>}
                                                    </label>
                                                </div>
                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Email <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="email"
                                                            type="text"
                                                            value={email}
                                                            placeholder="Enter Email"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.email}</p>}
                                                    </label>
                                                </div>

                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Password <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="password"
                                                            type="password"
                                                            value={password}
                                                            placeholder="Enter Password"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.password}</p>}
                                                    </label>
                                                </div>

                                                <div className=" ">
                                                    <label>
                                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                            Confirm Password <span className="text-red-500">*</span>
                                                        </p>
                                                        <input
                                                            name="confirmPassword"
                                                            type="password"
                                                            value={confirmPassword}
                                                            placeholder="Enter Confirm Password"
                                                            onChange={handleChange}
                                                            readOnly={isViewed}
                                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                        />
                                                        {<p className="text-red-600  text-xs"> {formDataErr.confirmPassword}</p>}
                                                    </label>
                                                </div>

                                            </div>
                                        </div>
                                        {(
                                            <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                                                <div className="flex gap-2">
                                                    <Button
                                                        text="Cancel"
                                                        // className="border bg-red-300 rounded px-5 py-2"
                                                        className="bg-lightmodalBgBtn text-lightmodalbtnText hover:bg-lightmodalBgBtnHover hover:text-white  px-4 py-2 rounded"
                                                        onClick={() => closeModal()}
                                                    />

                                                    {
                                                        isViewed && (
                                                            <Button
                                                                text="Edit"
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` ${isDark ? "bg-darkBtn text-white hover:bg-darkBtnHover" : "bg-lightBgBtn hover:bg-lightHoverBgBtn text-lightBtntext hover:text-white"} px-4 py-2 rounded`}
                                                                onClick={() => setIsViewed(false)}
                                                                isLoading={loading}
                                                            />

                                                        )
                                                    }
                                                    {
                                                        !isViewed && (
                                                            <Button
                                                                text={`${buId ? "Update" : "Save"}`}
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` ${isDark ? "bg-darkBtn text-white hover:bg-darkBtnHover" : "bg-lightBgBtn hover:bg-lightHoverBgBtn text-lightBtntext hover:text-white"} px-4 py-2 rounded`}
                                                                onClick={handleSubmitBusinessUnit}
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
                                       bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll max-w-[17rem] `}
                                    >
                                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                            <FormLoader  />
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

export default BusinessUnit