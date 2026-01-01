import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Card } from "@mui/material";
import debounceFunction from "@/helper/Debounce";
import loadingImg from "../../assets/images/aestree-logo.png"
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import { useSelector } from "react-redux";
import assetService from "@/services/asset/asset.service";


const Asset = ({ noFade }) => {

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
        }
    }, [currentUser])

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isDark] = useDarkMode();
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleView = (row) => {
        scrollToTop();
        const id = row._id;
        const name = "view"
        navigate("/view-assets-&-tool", { state: { id, row, name } });
    };
    const handleEdit = (row) => {
        scrollToTop();
        const id = row._id;
        const name = "edit"
        navigate("/create-assets-&-tools", { state: { id, row, name } });
    };

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
            const response = await assetService.activeInactive(dataObject);

            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.assets);
            toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`);
            setShowLoadingModal(false)

        } catch (error) {
            setShowLoadingModal(false)
            console.error("Error while activating:", error);
        }

    };

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function truncateText(text, limit = 12) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }

    //   ------- Data Table Columns ---
    const columns = [
        {
            name: "Level",
            selector: (row) => {
                let level = "";
                if (row?.isBuLevel) {
                    level = "Business Unit"
                } else if (row?.isBranchLevel) {
                    level = "Branch"
                } else if (row?.isWarehouseLevel) {
                    level = "Warehouse"
                }
                return level
            },
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Unit",
            selector: (row) => {
                let unit = "";
                if (row?.isBuLevel) {
                    unit = row?.businessUnit?.name
                } else if (row?.isBranchLevel) {
                    unit = row?.branch?.name
                } else if (row?.isWarehouseLevel) {
                    unit = row?.warehouse?.name
                }
                return <Tooltip
                    content={unit}
                    placement="top-end"
                    arrow
                    animation="shift-away"
                >
                    <span>{truncateText(unit, 24)}</span>
                </Tooltip>
            },
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Name",
            selector: (row) => row?.assetName,
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Model",
            selector: (row) => row?.model,
            sortable: false,

        },
        {
            name: "Serial Number",
            selector: (row) => row.serialNumber,
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Purchase Date",
            selector: (row) => formatDate(row.purchaseDate),
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Status",
            sortable: true,
            selector: (row) => {
                const status = row?.status;
                return (
                    <span className="block w-full">
                        <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  
                              ${status == "available" ? "text-green-500 bg-green-500"
                                    : status == "assigned" ? "text-blue-500 bg-blue-500"
                                        : status == "in-maintenance" ? "text-violet-500 bg-violet-500"
                                            : status == "disposed" ? "text-red-500 bg-red-500"
                                                : ""
                                }`}
                        >
                            {status?.toUpperCase()}
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
                    </div>
                );
            },
        },
    ];
    //------ Applying server side Pagination------
    const [paginationData, setPaginationData] = useState();

    // FIlter the Data Based on the search
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
                    const response = await assetService.getList(page, nextValue, perPage, currentLevel, levelId);
                    setTotalRows(response?.data?.count);
                    setPaginationData(response?.data?.assets);
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
            const response = await assetService.getList(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.assets);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error while fetching assets");
        }
    }

    useEffect(() => {
        if (currentLevel) {
            getList()
        }
    }, [currentLevel]);

    // ------Performing Action when page change -----------
    const handlePageChange = async (page) => {
        try {
            const response = await assetService.getList(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.assets);
            setPage(page);
        } catch (error) {
            console.log("error while fetching assets");
        }
    };
    // ------Handling Action after the perPage data change ---------
    const handlePerRowChange = async (perPage) => {
        try {
            const response = await assetService.getList(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.assets);
            setPerPage(perPage);
        } catch (error) {
            console.log("error while fetching assets");
        }
        setPerPage(perPage);
    };

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <button className={`w-fit bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                onClick={() => navigate("/create-assets-&-tools")}
            >
                Create Asset
            </button>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search.."
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                />
            </div>
        </div>
    );


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

export default Asset;
