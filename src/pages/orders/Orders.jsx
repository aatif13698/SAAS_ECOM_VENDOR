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
import { Card } from "@mui/material";
import debounceFunction from "@/helper/Debounce";

import loadingImg from "../../assets/images/aestree-logo.png"
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import warehouseService from "@/services/warehouse/warehouse.service";
import stockService from "@/services/stock/stock.service";
import ordersService from "@/services/orders/orders.service";
import Select from "react-select"; // Import react-select
import zIndex from "@mui/material/styles/zIndex";


const Orders = ({ noFade, scrollContent }) => {

    // new code 
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState([]); // Array for multiple statuses
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    console.log("status", status);


    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "DISAPPROVED", label: "Disapproved" },
        { value: "IN_PRODUCTION", label: "In Production" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const handleStatusChange = (selectedOptions) => {
        setStatus(selectedOptions ? selectedOptions.map((option) => option.value) : []);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate") setStartDate(value);
        if (name === "endDate") setEndDate(value);
    };

    // Custom styles for react-select to match Tailwind and dark mode
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
            borderColor: isDark ? "#334155" : "#CBD5E1",
            color: isDark ? "#FFFFFF" : "#1E293B",
            padding: "0.25rem",
            borderRadius: "0.375rem",
            minHeight: "2.5rem",
            "&:hover": {
                borderColor: isDark ? "#475569" : "#94A3B8",
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#1E293B",
            zIndex:"99999"
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? isDark
                    ? "#3B82F6"
                    : "#2563EB"
                : isDark
                    ? "#1E293B"
                    : "#FFFFFF",
            color: state.isSelected ? "#FFFFFF" : isDark ? "#FFFFFF" : "#1E293B",
            "&:hover": {
                backgroundColor: isDark ? "#334155" : "#F1F5F9",
                zIndex:"999"
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
            color: isDark ? "#FFFFFF" : "#1E293B",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#1E293B",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#1E293B",
            "&:hover": {
                backgroundColor: isDark ? "#2563EB" : "#BFDBFE",
                color: "#FFFFFF",
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? "#9CA3AF" : "#6B7280",
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#1E293B",
        }),
    };

    const { noDataStyle, customStyles } = tableConfigure()

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isDark] = useDarkMode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isViewed, setIsViewed] = useState(false);
    const [userId, setUserId] = useState(null);

    const [refresh, setRefresh] = useState(0);

    // This function helps us to move on top side
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // This makes the scrolling smooth
        });
    };
    const handleView = async (row) => {
        try {
            setShowLoadingModal(true);
            const response = await ordersService.getOne(row?._id);
            scrollToTop();
            navigate("/order-view", { state: { data: response?.data } });
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false);
        }
    };

    const columns = [
        {
            name: "Order Number",
            selector: (row) => row?.orderNumber,
            sortable: true,
            style: {
                width: "auto", // Set the desired width here
            },
        },
        {
            name: "Customer Name",
            selector: (row) => (row?.customer?.firstName + " " + row?.customer?.lastName),
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Items Purchased",
            selector: (row) => row?.items?.length,
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
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.status == 1 ? "text-success-500 bg-success-500" : ""} `}
                        >
                            {row.status}
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
                    </div>
                );
            },
        },
    ];
    const [paginationData, setPaginationData] = useState();
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
                    const response = await warehouseService.getList(page, nextValue, perPage);
                    setTotalRows(response?.data?.count);
                    setPaginationData(response?.data?.warehouses);
                } catch (error) {
                    console.error("Error while fetching business:", error);
                }
            },
            1000
        ),
        []
    );


    // async function getList() {
    //     try {
    //         const response = await ordersService.getAllList(page, keyWord, perPage);
    //         setTotalRows(response?.data?.count);
    //         setPaginationData(response?.data?.orders);
    //         setPending(false);
    //     } catch (error) {
    //         setPending(false);
    //         console.log("error while fetching orders");
    //     }
    // }


    const debounceFetch = useCallback(
        debounceFunction(async (filters) => {
          try {
            const response = await ordersService.getAllList(
              filters.page,
              filters.keyword,
              filters.perPage,
              filters.status.join(","), // Convert array to comma-separated string
              filters.startDate,
              filters.endDate
            );
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.orders || []);
            setPending(false);
          } catch (error) {
            setPending(false);
            toast.error("Error fetching orders");
            console.error("Error fetching orders:", error);
          }
        }, 500),
        []
      );




    async function getList() {
        setPending(true);
        debounceFetch({
          page,
          keyword,
          perPage,
          status,
          startDate,
          endDate,
        });
      }

    // useEffect(() => {
    //     getList()
    // }, [refresh]);

    useEffect(() => {
        getList();
      }, [page, perPage, keyword, status, startDate, endDate, refresh]);

    // ------Performing Action when page change -----------
    const handlePageChange = async (page) => {
        try {
            const response = await stockService.getAllList(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.warehouses);
            setPage(page);
        } catch (error) {
            console.log("error while fetching orders");
        }
    };
    // ------Handling Action after the perPage data change ---------
    const handlePerRowChange = async (perPage) => {
        try {
            const response = await warehouseService.getList(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.warehouses);
            setPerPage(perPage);
        } catch (error) {
            console.log("error while fetching orders");
        }
        setPerPage(perPage);
    };

    // -----Adding a Search Box ---------

    // const subHeaderComponent = (
    //     <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
    //         <div className="table-heading text-start ">Orders List</div>
    //         <div className="grid lg:justify-end md:justify-start">
    //             <input
    //                 type="text"
    //                 placeholder="Search.."
    //                 // style={inputBoxStyle}
    //                 onChange={handleFilter}
    //                 className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
    //             />
    //         </div>
    //     </div>
    // );

    // new
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-1 md:grid-cols-1 gap-3 items-center">
          <div className="table-heading text-start">Orders List</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
            <input
              type="text"
              placeholder="Search by order number..."
              value={keyword}
              onChange={handleFilter}
              className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
            />
            <Select
              isMulti
              options={statusOptions}
              value={statusOptions.filter((option) => status.includes(option.value))}
              onChange={handleStatusChange}
              placeholder="Select Status..."
              styles={selectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                placeholder="Start Date"
                className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
              />
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleDateChange}
                placeholder="End Date"
                className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
              />
            </div>
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

export default Orders;
