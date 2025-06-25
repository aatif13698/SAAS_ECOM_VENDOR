// import React, { useCallback, useEffect, useState, Fragment } from "react";
// import { useDispatch } from "react-redux";
// import DataTable from "react-data-table-component";
// import "react-contexify/dist/ReactContexify.css";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import useDarkMode from "@/hooks/useDarkMode";
// import Icon from "@/components/ui/Icon";
// import Tooltip from "@/components/ui/Tooltip";
// import { Card } from "@mui/material";
// import debounceFunction from "@/helper/Debounce";

// import loadingImg from "../../assets/images/aestree-logo.png"
// import { Dialog, Transition } from "@headlessui/react";
// import FormLoader from "@/Common/formLoader/FormLoader";
// import tableConfigure from "../common/tableConfigure";
// import warehouseService from "@/services/warehouse/warehouse.service";
// import stockService from "@/services/stock/stock.service";
// import ordersService from "@/services/orders/orders.service";
// import Select from "react-select"; // Import react-select
// import * as XLSX from "xlsx";
// import Button from "@/components/ui/Button";



// const Orders = ({ noFade, scrollContent }) => {

//     // new code 
//     const [keyword, setKeyword] = useState("");
//     const [status, setStatus] = useState([]); // Array for multiple statuses
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     console.log("status", status);


//     const statusOptions = [
//         { value: "PENDING", label: "Pending" },
//         { value: "APPROVED", label: "Approved" },
//         { value: "DISAPPROVED", label: "Disapproved" },
//         { value: "IN_PRODUCTION", label: "In Production" },
//         { value: "SHIPPED", label: "Shipped" },
//         { value: "DELIVERED", label: "Delivered" },
//         { value: "CANCELLED", label: "Cancelled" },
//     ];

//     const rowsPerPageOptions = Array.from(
//         { length: 100 },
//         (_, i) => (i + 1) * 5
//     );

//     const handleStatusChange = (selectedOptions) => {
//         setStatus(selectedOptions ? selectedOptions.map((option) => option.value) : []);
//     };

//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "startDate") setStartDate(value);
//         if (name === "endDate") setEndDate(value);
//     };

//     // Custom styles for react-select to match Tailwind and dark mode
// const selectStyles = {
//     control: (provided) => ({
//         ...provided,
//         backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
//         borderColor: isDark ? "#334155" : "#CBD5E1",
//         color: isDark ? "#FFFFFF" : "#FFFFFF",
//         padding: "0.25rem",
//         borderRadius: "0.375rem",
//         minHeight: "2.5rem",
//         "&:hover": {
//             borderColor: isDark ? "#475569" : "#94A3B8",
//         },
//         textAlign: "left",
//     }),
//     menu: (provided) => ({
//         ...provided,
//         backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
//         color: isDark ? "#FFFFFF" : "#FFFFFF",
//         zIndex: "99999",
//         textAlign: "left",
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         backgroundColor: state.isSelected
//             ? isDark
//                 ? "#3B82F6"
//                 : "#2563EB"
//             : isDark
//                 ? "#1E293B"
//                 : "#FFFFFF",
//         color: state.isSelected ? "#FFFFFF" : isDark ? "#FFFFFF" : "#1E293B",
//         "&:hover": {
//             backgroundColor: isDark ? "#334155" : "#F1F5F9",
//             zIndex: "999"
//         },
//         textAlign: "left",
//     }),
//     multiValue: (provided) => ({
//         ...provided,
//         backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
//         color: isDark ? "#FFFFFF" : "#FFFFFF",
//         textAlign: "left",
//     }),
//     multiValueLabel: (provided) => ({
//         ...provided,
//         color: isDark ? "#FFFFFF" : "#FFFFFF",
//         textAlign: "left",
//     }),
//     multiValueRemove: (provided) => ({
//         ...provided,
//         color: isDark ? "#FFFFFF" : "#FFFFFF",
//         "&:hover": {
//             backgroundColor: isDark ? "#2563EB" : "#BFDBFE",
//             color: "#FFFFFF",
//         },
//         textAlign: "left",
//     }),
//     placeholder: (provided) => ({
//         ...provided,
//         color: isDark ? "#9CA3AF" : "#6B7280",
//         textAlign: "left",
//     }),
//     input: (provided) => ({
//         ...provided,
//         color: isDark ? "#FFFFFF" : "#1E293B",
//         textAlign: "left",
//     }),
// };

//     const { noDataStyle, customStyles } = tableConfigure()

//     const [showLoadingModal, setShowLoadingModal] = useState(false);
//     const handleCloseLoadingModal = () => {
//         setShowLoadingModal(false);
//     };

//     const [isDark] = useDarkMode();

//     const [pending, setPending] = useState(true);
//     const [totalRows, setTotalRows] = useState();
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [refresh, setRefresh] = useState(0);

//     // This function helps us to move on top side
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth", // This makes the scrolling smooth
//         });
//     };
//     const handleView = async (row) => {
//         try {
//             setShowLoadingModal(true);
//             const response = await ordersService.getOne(row?._id);
//             console.log("order response", response);

//             scrollToTop();
//             navigate("/order-view", { state: { data: response?.data } });
//             setShowLoadingModal(false);
//         } catch (error) {
//             setShowLoadingModal(false);
//         }
//     };

//     const columns = [
//         {
//             name: "Order Number",
//             selector: (row) => row?.orderNumber,
//             sortable: true,
//             style: {
//                 width: "auto", // Set the desired width here
//             },
//         },
//         {
//             name: "Customer Name",
//             selector: (row) => (row?.customer?.firstName + " " + row?.customer?.lastName),
//             sortable: true,
//             style: {
//                 width: "20px", // Set the desired width here
//             },
//         },
//         {
//             name: "Items Purchased",
//             selector: (row) => row?.items?.length,
//             sortable: true,
//             style: {
//                 width: "20px", // Set the desired width here
//             },
//         },
//         {
//             name: "Status",
//             sortable: true,
//             selector: (row) => {

//                 return (
//                     <span className="block w-full">
//                         <span
//                             className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.status == 1 ? "text-success-500 bg-success-500" : ""} `}
//                         >
//                             {row.status}
//                         </span>
//                     </span>
//                 );
//             },
//         },
//         {
//             name: "Action",
//             selector: (row) => {
//                 return (
//                     <div className="flex  space-x-1 rtl:space-x-reverse ">
//                         <Tooltip
//                             content="View"
//                             placement="top"
//                             arrow
//                             animation="shift-away"
//                         >
//                             <button
//                                 className="action-btn"
//                                 type="button"
//                                 onClick={() => handleView(row)}
//                             >
//                                 <Icon icon="heroicons:eye" />
//                             </button>
//                         </Tooltip>
//                     </div>
//                 );
//             },
//         },
//     ];
//     const [paginationData, setPaginationData] = useState();
//     const [keyWord, setkeyWord] = useState("");

//     const handleFilter = (e) => {
//         setKeyword(e.target.value);
//     };



//     const debounceFetch = useCallback(
//         debounceFunction(async (filters) => {
//             try {
//                 const response = await ordersService.getAllList(
//                     filters.page,
//                     filters.keyword,
//                     filters.perPage,
//                     filters.status.join(","), // Convert array to comma-separated string
//                     filters.startDate,
//                     filters.endDate
//                 );
//                 setTotalRows(response?.data?.count || 0);
//                 setPaginationData(response?.data?.orders || []);
//                 setPending(false);
//             } catch (error) {
//                 setPending(false);
//                 toast.error("Error fetching orders");
//                 console.error("Error fetching orders:", error);
//             }
//         }, 500),
//         []
//     );

//     async function getList() {
//         setPending(true);
//         debounceFetch({
//             page,
//             keyword,
//             perPage,
//             status,
//             startDate,
//             endDate,
//         });
//     }


//     useEffect(() => {
//         getList();
//     }, [page, perPage, keyword, status, startDate, endDate, refresh]);

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handlePerRowChange = (newPerPage) => {
//         setPerPage(newPerPage);
//         setPage(1); // Reset to first page when rows per page changes
//     };

//     const exportToExcel = () => {
//         try {
//             const exportData = paginationData.map((row) => ({
//                 OrderNumber: row.orderNumber,
//                 CustomerName: `${row?.customer?.firstName} ${row?.customer?.lastName}`,
//                 Product_Name: row.items
//                     .map((item) => item.productStock?.product?.name || "Unknown")
//                     .join(", "),
//                 Quantity: row.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
//                 ItemsPurchased: row?.items?.length,
//                 Total_Amount: row.totalAmount,
//                 Status: row.status,
//             }));

//             const worksheet = XLSX.utils.json_to_sheet(exportData);
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

//             // Auto-size columns
//             const colWidths = exportData.reduce((acc, row) => {
//                 Object.keys(row).forEach((key, i) => {
//                     const value = row[key] ? row[key].toString() : "";
//                     acc[i] = Math.max(acc[i] || 10, value?.length + 2);
//                 });
//                 return acc;
//             }, []);
//             worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

//             XLSX.writeFile(workbook, `orders_export_${new Date().toISOString()}.xlsx`);
//         } catch (error) {
//             toast.error("Error exporting to Excel");
//             console.error("Error exporting to Excel:", error);
//         }
//     };


//     // new
//     const subHeaderComponent = (
//         <div className="w-full grid xl:grid-cols-1 md:grid-cols-1 gap-3 items-center">
//             <div className="flex justify-between items-center">
//                 <div className="table-heading text-start">Orders List</div>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={exportToExcel}
//                     disabled={!paginationData?.length}
//                 >
//                     Export to Excel
//                 </Button>
//             </div>
//             <div className=" grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
//                 <input
//                     type="text"
//                     placeholder="Search by order number..."
//                     value={keyword}
//                     onChange={handleFilter}
//                     className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
//                 />
//                 <Select
//                     isMulti
//                     options={statusOptions}
//                     value={statusOptions.filter((option) => status.includes(option.value))}
//                     onChange={handleStatusChange}
//                     placeholder="Select Status..."
//                     styles={selectStyles}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                 />
//                 <input
//                     type="date"
//                     name="startDate"
//                     value={startDate}
//                     onChange={handleDateChange}
//                     placeholder="Start Date"
//                     className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
//                 />
//                 <input
//                     type="date"
//                     name="endDate"
//                     value={endDate}
//                     onChange={handleDateChange}
//                     placeholder="End Date"
//                     className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
//                 />
//                 {/* <div className="flex gap-2">


//             </div> */}
//             </div>
//         </div>
//     );


//     const paginationOptions = {
//         rowsPerPageText: "Rows per page:",
//         rangeSeparatorText: "of",
//         selectAllRowsItem: false,
//         rowsPerPageOptions,
//     };
//     return (
//         <div className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
//             <Card></Card>
//             <div className="text-end mb-4">
//                 <div className="flex gap-5 justify-between"></div>
//             </div>

//             <DataTable
//                 columns={columns}
//                 data={paginationData}
//                 highlightOnHover
//                 customStyles={customStyles}
//                 fixedHeader
//                 pagination
//                 paginationServer
//                 paginationTotalRows={totalRows}
//                 onChangePage={handlePageChange}
//                 onChangeRowsPerPage={handlePerRowChange}
//                 paginationRowsPerPageOptions={rowsPerPageOptions}

//                 // selectableRows
//                 pointerOnHover
//                 progressPending={pending}
//                 subHeader
//                 subHeaderComponent={subHeaderComponent}
//                 paginationComponentOptions={paginationOptions}
//                 noDataComponent={<div className={`${isDark ? "bg-darkBody" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

//                     <p className="text-center text-bold text-2xl" style={noDataStyle}>
//                         There is no record to display
//                     </p>
//                 </div>
//                 }
//                 progressComponent={

//                     <div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
//                         <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />

//                         <p className="text-center text-bold text-2xl" style={noDataStyle}>
//                             Processing...
//                         </p>
//                     </div>

//                 }

//             />

//             <Transition appear show={showLoadingModal} as={Fragment}>
//                 <Dialog
//                     as="div"
//                     className="relative z-[99999]"
//                     onClose={handleCloseLoadingModal}
//                 >
//                     {(
//                         <Transition.Child
//                             as={Fragment}
//                             enter={noFade ? "" : "duration-300 ease-out"}
//                             enterFrom={noFade ? "" : "opacity-0"}
//                             enterTo={noFade ? "" : "opacity-100"}
//                             leave={noFade ? "" : "duration-200 ease-in"}
//                             leaveFrom={noFade ? "" : "opacity-100"}
//                             leaveTo={noFade ? "" : "opacity-0"}
//                         >
//                             <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
//                         </Transition.Child>
//                     )}

//                     <div className="fixed inset-0 overflow-y-auto">
//                         <div
//                             className={`flex min-h-full justify-center text-center p-6 items-center "
//                                     }`}
//                         >
//                             <Transition.Child
//                                 as={Fragment}
//                                 enter={noFade ? "" : "duration-300  ease-out"}
//                                 enterFrom={noFade ? "" : "opacity-0 scale-95"}
//                                 enterTo={noFade ? "" : "opacity-100 scale-100"}
//                                 leave={noFade ? "" : "duration-200 ease-in"}
//                                 leaveFrom={noFade ? "" : "opacity-100 scale-100"}
//                                 leaveTo={noFade ? "" : "opacity-0 scale-95"}
//                             >
//                                 <Dialog.Panel
//                                     className={`w-full transform overflow-hidden rounded-md
//                                        bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] py-10 `}
//                                 >
//                                     <div className="flex flex-col justify-center mt-5 items-center gap-2">
//                                         <FormLoader />
//                                     </div>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>

//         </div>
//     );
// };

// export default Orders;


// new code
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
import loadingImg from "../../assets/images/aestree-logo.png";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import ordersService from "@/services/orders/orders.service";
import Select from "react-select";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// PDF styles
const pdfStyles = StyleSheet.create({
    page: { padding: 20, fontSize: 10 },
    table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
    tableRow: { flexDirection: "row" },
    tableHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
    tableCell: {
        flex: 1,
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        flexWrap: "wrap",
        wordBreak: "break-word",
        textAlign: "left",
    },
    serialCell: {
        flex: 0.5,
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        textAlign: "center",
    },
    orderNumberCell: {
        width: 100, // Fixed width for Order Number
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        flexWrap: "wrap",
        wordBreak: "break-word",
        textAlign: "left",
        fontSize: 9, // Slightly smaller font for better fit
    },
    title: { fontSize: 14, marginBottom: 10, textAlign: "center" },
});

// PDF Document Component
const PDFDocument = ({ data }) => (
    <Document>
        <Page size="A4" style={pdfStyles.page}>
            <Text style={pdfStyles.title}>Orders List</Text>
            <View style={pdfStyles.table}>
                {/* Table Header */}
                <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                    <Text style={pdfStyles.serialCell}>S.No</Text>
                    <Text style={pdfStyles.orderNumberCell}>Order Number</Text>
                    <Text style={pdfStyles.tableCell}>Customer Name</Text>
                    <Text style={pdfStyles.tableCell}>Product Name</Text>
                    <Text style={pdfStyles.tableCell}>Quantity</Text>
                    <Text style={pdfStyles.tableCell}>Items Purchased</Text>
                    <Text style={pdfStyles.tableCell}>Total Amount</Text>
                    <Text style={pdfStyles.tableCell}>Status</Text>
                </View>
                {/* Table Rows */}
                {data.map((row, index) => (
                    <View style={pdfStyles.tableRow} key={row.OrderNumber}>
                        <Text style={pdfStyles.serialCell}>{index + 1}</Text>
                        <Text style={pdfStyles.orderNumberCell}>{row.OrderNumber}</Text>
                        <Text style={pdfStyles.tableCell}>{row.CustomerName}</Text>
                        <Text style={pdfStyles.tableCell}>{row.Product_Name}</Text>
                        <Text style={pdfStyles.tableCell}>{row.Quantity}</Text>
                        <Text style={pdfStyles.tableCell}>{row.ItemsPurchased}</Text>
                        <Text style={pdfStyles.tableCell}>{row.Total_Amount}</Text>
                        <Text style={pdfStyles.tableCell}>{row.Status}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);


const Orders = ({ noFade, scrollContent }) => {
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showPDFPreview, setShowPDFPreview] = useState(false);
    const [pdfData, setPDFData] = useState([]);
    const [isDark] = useDarkMode();
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(0);
    const [paginationData, setPaginationData] = useState();

    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "DISAPPROVED", label: "Disapproved" },
        { value: "IN_PRODUCTION", label: "In Production" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const rowsPerPageOptions = Array.from({ length: 100 }, (_, i) => (i + 1) * 5);

    const handleStatusChange = (selectedOptions) => {
        setStatus(selectedOptions ? selectedOptions.map((option) => option.value) : []);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate") setStartDate(value);
        if (name === "endDate") setEndDate(value);
    };

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
            borderColor: isDark ? "#334155" : "#CBD5E1",
            color: isDark ? "#FFFFFF" : "#FFFFFF",
            padding: "0.25rem",
            borderRadius: "0.375rem",
            minHeight: "2.5rem",
            "&:hover": {
                borderColor: isDark ? "#475569" : "#94A3B8",
            },
            textAlign: "left",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#FFFFFF",
            zIndex: "99999",
            textAlign: "left",
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
                zIndex: "999"
            },
            textAlign: "left",
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
            color: isDark ? "#FFFFFF" : "#FFFFFF",
            textAlign: "left",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#FFFFFF",
            textAlign: "left",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#FFFFFF",
            "&:hover": {
                backgroundColor: isDark ? "#2563EB" : "#BFDBFE",
                color: "#FFFFFF",
            },
            textAlign: "left",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? "#9CA3AF" : "#6B7280",
            textAlign: "left",
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? "#FFFFFF" : "#1E293B",
            textAlign: "left",
        }),
    };


    const { noDataStyle, customStyles } = tableConfigure();

    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
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
            toast.error("Error viewing order");
            console.error("Error viewing order:", error);
        }
    };

    const columns = [
        {
            name: "Order Number",
            selector: (row) => row?.orderNumber,
            sortable: true,
            style: {
                 width: "auto",
            },
            cell: (row) => (
                <div
                    // className="truncate"
                    title={row?.orderNumber} // Tooltip for full text on hover
                    // style={{
                    //     width: "150px",
                    //     overflow: "hidden",
                    //     textOverflow: "ellipsis",
                    //     whiteSpace: "nowrap",
                    // }}
                >
                    {row?.orderNumber}
                </div>
            ),
        },
        {
            name: "Customer Name",
            selector: (row) => `${row?.customer?.firstName} ${row?.customer?.lastName}`,
            sortable: true,
            style: { width: "auto" },
        },
        {
            name: "Items Purchased",
            selector: (row) => row?.items?.length,
            sortable: true,
            style: { width: "auto" },
        },
        {
            name: "Status",
            sortable: true,
            selector: (row) => (
                <span className="block w-full">
                    <span
                        className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.status === "PENDING"
                                ? "text-yellow-500 bg-yellow-500"
                                : row?.status === "APPROVED"
                                    ? "text-green-500 bg-green-500"
                                    : row?.status === "DISAPPROVED"
                                        ? "text-red-500 bg-red-500"
                                        : row?.status === "IN_PRODUCTION"
                                            ? "text-blue-500 bg-blue-500"
                                            : row?.status === "SHIPPED"
                                                ? "text-purple-500 bg-purple-500"
                                                : row?.status === "DELIVERED"
                                                    ? "text-teal-500 bg-teal-500"
                                                    : row?.status === "CANCELLED"
                                                        ? "text-gray-500 bg-gray-500"
                                                        : ""
                            }`}
                    >
                        {row.status}
                    </span>
                </span>
            ),
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
                </div>
            ),
        },
    ];

    const handleFilter = (e) => {
        setKeyword(e.target.value);
    };

    const debounceFetch = useCallback(
        debounceFunction(async (filters) => {
            try {
                const response = await ordersService.getAllList(
                    filters.page,
                    filters.keyword,
                    filters.perPage,
                    filters.status.join(","),
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

    useEffect(() => {
        getList();
    }, [page, perPage, keyword, status, startDate, endDate, refresh]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowChange = (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    const exportToExcel = () => {
        try {
            const exportData = paginationData.map((row) => ({
                OrderNumber: row.orderNumber,
                CustomerName: `${row?.customer?.firstName} ${row?.customer?.lastName}`,
                Product_Name: row.items
                    .map((item) => item.productStock?.product?.name || "Unknown")
                    .join(", "),
                Quantity: row.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
                ItemsPurchased: row?.items?.length,
                Total_Amount: row.totalAmount,
                Status: row.status,
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

            const colWidths = exportData.reduce((acc, row) => {
                Object.keys(row).forEach((key, i) => {
                    const value = row[key] ? row[key].toString() : "";
                    acc[i] = Math.max(acc[i] || 10, value?.length + 2);
                });
                return acc;
            }, []);
            worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

            XLSX.writeFile(workbook, `orders_export_${new Date().toISOString()}.xlsx`);
        } catch (error) {
            toast.error("Error exporting to Excel");
            console.error("Error exporting to Excel:", error);
        }
    };

    const preparePDFData = () => {
        const exportData = paginationData.map((row) => ({
            OrderNumber: row.orderNumber,
            CustomerName: `${row?.customer?.firstName} ${row?.customer?.lastName}`,
            Product_Name: row.items
                .map((item) => item.productStock?.product?.name || "Unknown")
                .join(", "),
            Quantity: row.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
            ItemsPurchased: row?.items?.length,
            Total_Amount: row.totalAmount,
            Status: row.status,
        }));
        setPDFData(exportData);
        setShowPDFPreview(true);
    };

    const downloadPDF = async () => {
        try {
            const blob = await pdf(<PDFDocument data={pdfData} />).toBlob();
            saveAs(blob, `orders_report_${new Date().toISOString()}.pdf`);
            setShowPDFPreview(false);
        } catch (error) {
            toast.error("Error downloading PDF");
            console.error("Error downloading PDF:", error);
        }
    };

    const closePDFPreview = () => {
        setShowPDFPreview(false);
    };

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-1 md:grid-cols-1 gap-3 items-center">
            <div className="flex justify-between items-center">
                <div className="table-heading text-start">Orders List</div>
                <div className="flex gap-2">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={exportToExcel}
                        disabled={!paginationData?.length}
                    >
                        Export to Excel
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={preparePDFData}
                        disabled={!paginationData?.length}
                    >
                        Export to PDF
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
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
    );

    const paginationOptions = {
        rowsPerPageText: "Rows per page:",
        rangeSeparatorText: "of",
        selectAllRowsItem: false,
        rowsPerPageOptions,
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
                paginationRowsPerPageOptions={rowsPerPageOptions}
                pointerOnHover
                progressPending={pending}
                subHeader
                subHeaderComponent={subHeaderComponent}
                paginationComponentOptions={paginationOptions}
                noDataComponent={
                    <div
                        className={`${isDark ? "bg-darkBody" : ""}`}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "2rem",
                            border: "2px solid white",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                        }}
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
                        <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />
                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            Processing...
                        </p>
                    </div>
                }
            />

            {/* Loading Modal */}
            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
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

            {/* PDF Preview Modal */}
            <Transition appear show={showPDFPreview} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={closePDFPreview}>
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-200 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full justify-center text-center p-6 items-center">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-4xl transform overflow-hidden rounded-md bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-all`}
                                >
                                    <div className="p-6">
                                        <h2 className="text-lg font-semibold mb-4">PDF Preview</h2>
                                        <div className="border border-gray-300 rounded-md overflow-hidden">
                                            <div className="h-[60vh] bg-gray-100 flex items-center justify-center">
                                                <p className="text-gray-500">
                                                    PDF preview rendering is not supported in this view. Please download to view the PDF.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={closePDFPreview}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={downloadPDF}
                                            >
                                                Download PDF
                                            </Button>
                                        </div>
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