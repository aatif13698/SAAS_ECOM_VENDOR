import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "@mui/material";
import vendorService from "@/services/vendor/vendor.service";
import debounceFunction from "@/helper/Debounce";

import loadingImg from "../../assets/images/aestree-logo.png"
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import { data } from "autoprefixer";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import branchService from "@/services/branch/branch.service";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import { useSelector } from "react-redux";
import departmentService from "@/services/department/department.service";
import ledgerGroupService from "@/services/ledgerGroup/ledgerGroup.service";
import documentService from "@/services/document/document.service";


// const FormValidationSchema = yup
//   .object({
//     question: yup.string().required("Question is Required"),
//     answer: yup.string().required("Answer is Required"),
//   })
//   .required();


const Documents = ({ noFade, scrollContent }) => {

    const { noDataStyle, customStyles } = tableConfigure();
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");

    console.log("currentLevel", currentLevel);
    console.log("levelId", levelId);


    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);


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

    }, [currentUser])


    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };




    // const {
    //   register,
    //   reset,
    //   formState: { errors },
    //   handleSubmit,
    //   setValue,
    // } = useForm({
    //   resolver: yupResolver(FormValidationSchema),
    // });


    const [isDark] = useDarkMode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isViewed, setIsViewed] = useState(false);
    const [userId, setUserId] = useState(null);
    const inputBoxStyle = {
        backgroundColor: isDark ? "#0F172A" : "",
        padding: "12px 14px",
        border: isDark ? "1px solid white" : "1px solid black",
        height: "38px",
        borderRadius: "0.5rem",
    };


    const [refresh, setRefresh] = useState(0);

    //  ---- Performing the Action After clicking on the view button---
    // This function helps us to move on top side
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // This makes the scrolling smooth
        });
    };
    const scrollToBottom = () => {
        const bottomElement = document.documentElement;
        bottomElement.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    const handleView = (row) => {
        scrollToTop();
        const id = row._id;
        const name = "view"
        setUserId(id);
        setIsViewed(true);
        navigate("/create-document-type", { state: { id, row, name } });
    };
    const handleEdit = (row) => {
        scrollToTop();
        const id = row._id;
        const name = "edit"
        setUserId(id);
        setIsViewed(false);
        navigate("/create-document-type", { state: { id, row, name } });
    };
    //   --- Deletiing the Particulare Row
    const handleDelete = (row) => {
        const id = row._id;
        Swal.fire({
            title: `Are You Sure You Want To Permanantly Delete ${row?.firstName + " " + row?.lastName}?`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: "Cancel",

            customClass: {
                popup: "sweet-alert-popup-dark-mode-style",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                deleteOne(id)
            }
        });
    };
    async function deleteOne(id) {
        try {
            const dataObject = {
                keyword: keyWord,
                page: page,
                perPage: perPage,
                employeeId: id,
            }
            const response = await employeeService.deleteOne(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.employees);
            toast.success(`Deleted Successfully`)
        } catch (error) {
            console.error("Error while fetching manufacturer:", error);
        }
    }
    //   ---- Active And InActive the Row
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
            const response = await ledgerGroupService.activeInactive(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.ledgerGroup);
            toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`);
            setShowLoadingModal(false)
        } catch (error) {
            setShowLoadingModal(false)
            console.error("Error while activating:", error);
        }

    };
    //   ------- Data Table Columns ---
    const columns = [
        {
            name: "Name",
            selector: (row) => row?.name,
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
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
                                <Icon icon="heroicons:pencil-square" />
                            </button>
                        </Tooltip>
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
    //------ Applying server side Pagination------
    // const [paginationData, setPaginationData] = useState(records);
    const [paginationData, setPaginationData] = useState();

    // FIlter the Data Based on the search
    const [filterData, setFilterData] = useState();
    const [keyWord, setkeyWord] = useState("");
    const handleFilter = (e) => {
        let currentKeyword = e.target.value;
        setkeyWord(currentKeyword);
        debounceSearch(currentKeyword);
    };

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    const response = await ledgerGroupService.getList(page, nextValue, perPage, currentLevel, levelId);
                    setTotalRows(response?.data?.count);
                    setPaginationData(response?.data?.ledgerGroup);
                } catch (error) {
                    console.error("Error while fetching:", error);
                }
            },
            1000
        ),
        []
    );


    async function getList() {
        try {
            const response = await documentService.getList(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.documentRequirements);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error while fetching documents");
        }
    }

    useEffect(() => {

        if (currentLevel) {
            getList()
        }
    }, [refresh, currentLevel]);

    // ------Performing Action when page change -----------
    const handlePageChange = async (page) => {
        try {
            const response = await ledgerGroupService.getList(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.ledgerGroup);
            setPage(page);
        } catch (error) {
            console.log("error while fetching ledger group");
        }
    };
    // ------Handling Action after the perPage data change ---------
    const handlePerRowChange = async (perPage) => {
        try {
            const response = await ledgerGroupService.getList(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.ledgerGroup);
            setPerPage(perPage);
        } catch (error) {
            console.log("error while fetching ledger group");
        }
        setPerPage(perPage);
    };

    // -----Adding a Search Box ---------

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <button className={`w-fit bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                onClick={() => navigate("/create-document-type")}
            >
                Create Document
            </button>            
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search.."
                    // style={inputBoxStyle}
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                />
            </div>
        </div>
    );

    const handleBack = () => {
        navigate("/layout/dashboard");
    };

    const paginationOptions = {
        rowsPerPageText: "row",
        rangeSeparatorText: "of",
    };
    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
            <Card></Card>
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
                // selectableRows
                pointerOnHover
                progressPending={pending}
                subHeader
                subHeaderComponent={subHeaderComponent}
                paginationComponentOptions={paginationOptions}
                noDataComponent={<div className={`${isDark ? "bg-darkBody" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

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
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] py-10 `}
                                >
                                    <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                        <FormLoader />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default Documents;
