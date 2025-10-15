



import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import { Card } from "@mui/material";
import stockService from "@/services/stock/stock.service";
import debounceFunction from "@/helper/Debounce";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import loadingImg from "../../assets/images/aestree-logo.png"

const Stock = ({ noFade }) => {
    const { noDataStyle, customStyles } = tableConfigure();
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isDark] = useDarkMode();
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

    const inputBoxStyle = {
        backgroundColor: isDark ? "#0F172A" : "",
        padding: "12px 14px",
        border: isDark ? "1px solid white" : "1px solid black",
        height: "38px",
        borderRadius: "0.5rem",
    };

    // Fetch data from stockService
    const fetchStockData = useCallback(async (page, keyWord, perPage, level, levelId) => {
        try {
            setPending(true);
            const response = await stockService.getAllList(page, keyWord, perPage, level, levelId);
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.stocks || []);
        } catch (error) {
            console.error("Error fetching stocks:", error);
            toast.error("Failed to fetch stock data");
        } finally {
            setPending(false);
        }
    }, []);

    // Debounced search
    const debounceSearch = useCallback(
        debounceFunction((nextValue) => {
            fetchStockData(page, nextValue, perPage, currentUser.currentLevel, currentUser.levelId);
        }, 1000),
        [page, perPage, fetchStockData]
    );

    // Determine user level and fetch data
    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;
        let currentLevel = "vendor";
        let levelId = "";
        if (currentUser.isVendorLevel) {
            currentLevel = "vendor";
        } else if (currentUser.isBuLevel) {
            currentLevel = "business";
            levelId = currentUser.businessUnit;
        } else if (currentUser.isBranchLevel) {
            currentLevel = "branch";
            levelId = currentUser.branch;
        } else if (currentUser.isWarehouseLevel) {
            currentLevel = "warehouse";
            levelId = currentUser.warehouse;
        }
        // Fetch data only if level and levelId are determined
        fetchStockData(page, keyWord, perPage, currentLevel, levelId);
    }, [isAuthenticated, currentUser, page, perPage, keyWord, fetchStockData]);

    // Handle search input
    const handleFilter = (e) => {
        const currentKeyword = e.target.value;
        setKeyWord(currentKeyword);
        debounceSearch(currentKeyword);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handlePerRowChange = (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1); // Reset to first page
    };

    // Handle view action
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleView = (row) => {
        scrollToTop();
        navigate("/create-stock", { state: { id: row._id, row, isViewed: true } });
    };

    // Handle delete action
    const handleDelete = (row) => {
        Swal.fire({
            title: `Are you sure you want to permanently delete ${row?.name}?`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            customClass: { popup: "sweet-alert-popup-dark-mode-style" },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const dataObject = { keyword: keyWord, page, perPage, warehouseId: row._id };
                    await warehouseService.deleteOne(dataObject);
                    toast.success("Deleted Successfully");
                    fetchStockData(page, keyWord, perPage, currentLevel, levelId);
                } catch (error) {
                    console.error("Error deleting warehouse:", error);
                    toast.error("Failed to delete warehouse");
                }
            }
        });
    };

    // Handle active/inactive toggle
    const handleActive = async (row) => {
        setShowLoadingModal(true);
        try {
            const status = row.isActive === 1 ? 0 : 1;
            const clientId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                keyword: keyWord,
                page,
                perPage,
                status,
                id: row._id,
                clientId,
            };
            await stockService.activeInActive(dataObject);
            toast.success(status === 0 ? "Deactivated Successfully" : "Activated Successfully");
            fetchStockData(page, keyWord, perPage, currentLevel, levelId);
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to update status");
        } finally {
            setShowLoadingModal(false);
        }
    };

    // DataTable columns
    const columns = [
        {
            name: "Product Name",
            selector: (row) => row?.product?.name || "N/A",
            sortable: true,
            style: { width: "20px" },
        },
        {
            name: "Category",
            selector: (row) => row.product?.categoryId?.name || "N/A",
            sortable: true,
            style: { width: "20px" },
        },
        {
            name: "Subcategory",
            selector: (row) => row.product?.categoryId?.name || "N/A",
            sortable: true,
            style: { width: "20px" },
        },
        {
            name: "Variants",
            selector: (row) => row.normalSaleStock?.length || 0,
            sortable: true,
            style: { width: "20px" },
        },
        {
            name: "Status",
            selector: (row) => {
                return (
                    <span className="block w-full">
                        <span
                            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.isActive  ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500"
                                }`}
                            title={row?.isActive  ? "Click to Deactivate" : "Click to Activate"}
                            onClick={() => handleActive(row)}
                        >
                            {row.isActive ? "Active" : "Inactive"}
                        </span>
                    </span>
                )
            },
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Tooltip content="View" placement="top" arrow animation="shift-away">
                        <button className="action-btn" type="button" onClick={() => handleView(row)}>
                            <Icon icon="heroicons:eye" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger">
                        <button className="action-btn" type="button" disabled onClick={() => handleDelete(row)}>
                            <Icon icon="heroicons:trash" />
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    // Subheader for search
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3 items-center">
            <div className="table-heading text-start">Stock List</div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                />
            </div>
        </div>
    );

    const paginationOptions = {
        rowsPerPageText: "row",
        rangeSeparatorText: "of",
    };

    return (
        <div className={isDark ? "bg-darkSecondary text-white" : ""}>
            <Card>
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
                    noDataComponent={
                        <div
                            className={isDark ? "bg-darkBody" : ""}
                            style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}
                        >
                            <p className="text-center text-bold text-2xl" style={noDataStyle}>
                                There is no record to display
                            </p>
                        </div>
                    }
                    progressComponent={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "2rem",
                                border: "2px solid white",
                                flexDirection: "row",
                                gap: "1rem",
                                background: isDark ? "#0F172A" : "",
                                width: "100%",
                            }}
                        >
                            <img src={loadingImg} alt="Loading" style={{ height: "2rem", width: "2rem" }} />
                            <p className="text-center text-bold text-2xl" style={noDataStyle}>
                                Processing...
                            </p>
                        </div>
                    }
                />
            </Card>

            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={() => setShowLoadingModal(false)}>
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full justify-center text-center p-6 items-center">
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300 ease-out"}
                                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                enterTo={noFade ? "" : "opacity-100 scale-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                leaveTo={noFade ? "" : "opacity-0 scale-95"}
                            >
                                <Dialog.Panel
                                    className={`w-full transform overflow-hidden rounded-md bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-all max-w-[17rem] py-10`}
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

export default Stock;
