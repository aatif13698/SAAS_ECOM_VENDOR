// import React, { useCallback, useEffect, useState, Fragment } from "react";
// import { useDispatch } from "react-redux";
// import DataTable from "react-data-table-component";
// import "react-contexify/dist/ReactContexify.css";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import useDarkMode from "@/hooks/useDarkMode";
// import Icon from "@/components/ui/Icon";
// import Tooltip from "@/components/ui/Tooltip";
// import Swal from "sweetalert2";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Card } from "@mui/material";
// import vendorService from "@/services/vendor/vendor.service";
// import debounceFunction from "@/helper/Debounce";

// import loadingImg from "../../assets/images/aestree-logo.png"
// import businessUnitService from "@/services/businessUnit/businessUnit.service";
// import { data } from "autoprefixer";
// import { Dialog, Transition } from "@headlessui/react";
// import FormLoader from "@/Common/formLoader/FormLoader";
// import tableConfigure from "../common/tableConfigure";
// import branchService from "@/services/branch/branch.service";
// import CryptoJS from "crypto-js";



// // Secret key for encryption (store this securely in .env in production)
// const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

// const encryptId = (id) => {
//   const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
//   // URL-safe encoding
//   return encodeURIComponent(encrypted);
// };


// const Branch = ({ noFade, scrollContent }) => {

//     const { noDataStyle, customStyles } = tableConfigure()


//     const [showLoadingModal, setShowLoadingModal] = useState(false);
//     const handleCloseLoadingModal = () => {
//         setShowLoadingModal(false);
//     };




//     // const {
//     //   register,
//     //   reset,
//     //   formState: { errors },
//     //   handleSubmit,
//     //   setValue,
//     // } = useForm({
//     //   resolver: yupResolver(FormValidationSchema),
//     // });


//     const [isDark] = useDarkMode();

//     const [pending, setPending] = useState(true);
//     const [totalRows, setTotalRows] = useState();
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isViewed, setIsViewed] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const inputBoxStyle = {
//         backgroundColor: isDark ? "#0F172A" : "",
//         padding: "12px 14px",
//         border: isDark ? "1px solid white" : "1px solid black",
//         height: "38px",
//         borderRadius: "0.5rem",
//     };


//     const [refresh, setRefresh] = useState(0);

//     //  ---- Performing the Action After clicking on the view button---
//     // This function helps us to move on top side
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth", // This makes the scrolling smooth
//         });
//     };
//     const scrollToBottom = () => {
//         const bottomElement = document.documentElement;
//         bottomElement.scrollIntoView({ behavior: "smooth", block: "end" });
//     };
//     const handleView = (row) => {
//         scrollToTop();
//         const id = row._id;
//         setUserId(id);
//         const name = "view"
//         setIsViewed(true);
//         navigate(`/view-branch/${encryptId(id)}`, { state: { id, row, name } });
//     };
//     const handleEdit = (row) => {
//         scrollToTop();
//         const id = row._id;
//         setUserId(id);
//         const name = "edit"
//         setIsViewed(false);
//         navigate("/create-branch", { state: { id, row, name } });
//     };
//     //   --- Deletiing the Particulare Row
//     const handleDelete = (row) => {
//         const id = row._id;
//         Swal.fire({
//             title: `Are You Sure You Want To Permanantly Delete${row?.name}?`,
//             icon: "error",
//             showCloseButton: true,
//             showCancelButton: true,
//             cancelButtonText: "Cancel",

//             customClass: {
//                 popup: "sweet-alert-popup-dark-mode-style",
//             },
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 deleteOne(id)
//             }
//         });
//     };
//     async function deleteOne(id) {
//         try {
//             const dataObject = {
//                 keyword: keyWord,
//                 page: page,
//                 perPage: perPage,
//                 branchId: id,
//             }
//             const response = await branchService.deleteOne(dataObject);
//             setTotalRows(response?.data?.data?.count);
//             setPaginationData(response?.data?.data?.branches);
//             toast.success(`Deleted Successfully`)
//         } catch (error) {
//             console.error("Error while fetching manufacturer:", error);
//         }
//     }
//     //   ---- Active And InActive the Row
//     const handleActive = async (row) => {
//         setShowLoadingModal(true)
//         const id = row._id;
//         let status = 1;
//         row.isActive == 1 ? (status = 0) : (status = 1);
//         try {
//             const clinetId = localStorage.getItem("saas_client_clientId");
//             const dataObject = {
//                 keyword: keyWord,
//                 page: page,
//                 perPage: perPage,
//                 status: status,
//                 id: id,
//                 clientId: clinetId
//             }
//             const response = await branchService.activeInactive(dataObject);

//             setTotalRows(response?.data?.data?.count);
//             setPaginationData(response?.data?.data?.branches);
//             toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`);
//             setShowLoadingModal(false)

//         } catch (error) {
//             setShowLoadingModal(false)
//             console.error("Error while activating:", error);
//         }

//     };
//     //   ------- Data Table Columns ---
//     const columns = [
//         {
//             name: "Name",
//             selector: (row) => row?.name,
//             sortable: true,
//             style: {
//                 width: "20px", // Set the desired width here
//             },
//         },
//         {
//             name: "Email",
//             selector: (row) => row.emailContact,
//             sortable: true,
//             style: {
//                 width: "20px", // Set the desired width here
//             },
//         },

//         {
//             name: "Phone",
//             selector: (row) => row.contactNumber,
//             sortable: true,
//             style: {
//                 width: "20px", // Set the desired width here
//             },
//         },

//         {
//             name: "City",
//             selector: (row) => row.city,
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
//                             className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.isActive == 1 ? "text-success-500 bg-success-500" : ""
//                                 }
//             ${row?.isActive == 0 ? "text-warning-500 bg-warning-500" : ""}

//              `}
//                             title={
//                                 row?.isActive == 1
//                                     ? "Click To Deactivate"
//                                     : "Click To Activate"
//                             }
//                             onClick={() => handleActive(row)}
//                         >
//                             {row.isActive == 1 ? "Active" : "Inactive"}
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
//                         <Tooltip
//                             content="Edit"
//                             placement="top"
//                             arrow
//                             animation="shift-away"
//                         >
//                             <button
//                                 className="action-btn"
//                                 type="button"
//                                 onClick={() => handleEdit(row)}
//                             >
//                                 <Icon icon="heroicons:pencil-square" />
//                             </button>
//                         </Tooltip>
//                         <Tooltip
//                             content="Delete"
//                             placement="top"
//                             arrow
//                             animation="shift-away"
//                             theme="danger"
//                         >
//                             <button
//                                 className="action-btn"
//                                 type="button"
//                                 onClick={() => handleDelete(row)}
//                             >
//                                 <Icon icon="heroicons:trash" />
//                             </button>
//                         </Tooltip>
//                     </div>
//                 );
//             },
//         },
//     ];
//     //------ Applying server side Pagination------
//     // const [paginationData, setPaginationData] = useState(records);
//     const [paginationData, setPaginationData] = useState();

//     // FIlter the Data Based on the search
//     const [filterData, setFilterData] = useState();
//     const [keyWord, setkeyWord] = useState("");
//     const handleFilter = (e) => {
//         let currentKeyword = e.target.value;
//         setkeyWord(currentKeyword);
//         setPending(true)
//         debounceSearch(currentKeyword);
//     };

//     const debounceSearch = useCallback(
//         debounceFunction(
//             async (nextValue) => {
//                 try {
//                     const response = await branchService.getList(page, nextValue, perPage);
//                     setTotalRows(response?.data?.count);
//                     setPaginationData(response?.data?.branches);
//                     setPending(false)
//                 } catch (error) {
//                     setPending(false)
//                     console.error("Error while fetching business:", error);
//                 }
//             },
//             1000
//         ),
//         []
//     );


//     async function getList() {
//         try {
//             const response = await branchService.getList(page, keyWord, perPage);
//             setTotalRows(response?.data?.count);
//             setPaginationData(response?.data?.branches);
//             setPending(false);
//         } catch (error) {
//             setPending(false);
//             console.log("error while fetching vendors");
//         }
//     }

//     useEffect(() => {
//         getList()
//     }, [refresh]);

//     // ------Performing Action when page change -----------
//     const handlePageChange = async (page) => {
//         try {
//             const response = await businessUnitService.getList(page, keyWord, perPage);
//             setTotalRows(response?.data?.count);
//             setPaginationData(response?.data?.businessUnits);
//             setPage(page);
//         } catch (error) {
//             console.log("error while fetching coupons");
//         }
//     };
//     // ------Handling Action after the perPage data change ---------
//     const handlePerRowChange = async (perPage) => {
//         try {
//             const response = await businessUnitService.getList(page, keyWord, perPage);
//             setTotalRows(response?.data?.count);
//             setPaginationData(response?.data?.businessUnits);
//             setPerPage(perPage);
//         } catch (error) {
//             console.log("error while fetching coupons");
//         }
//         setPerPage(perPage);
//     };

//     // -----Adding a Search Box ---------

//     const subHeaderComponent = (
//         <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
//             <div className="table-heading text-start ">Branch List</div>
//             <div className="grid lg:justify-end md:justify-start">
//                 <input
//                     type="text"
//                     placeholder="Search.."
//                     // style={inputBoxStyle}
//                     onChange={handleFilter}
//                     className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
//                 />
//             </div>
//         </div>
//     );

//     const handleBack = () => {
//         navigate("/layout/dashboard");
//     };

//     const paginationOptions = {
//         rowsPerPageText: "row",
//         rangeSeparatorText: "of",
//     };
//     return (
//         <div className={`${isDark ? "bg-darkSecondary text-white" : ""} min-h-[85vh]`}>
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

// export default Branch;





import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import FormLoader from "@/Common/formLoader/FormLoader";
import loadingImg from "../../assets/images/aestree-logo.png";
import branchService from "@/services/branch/branch.service";
import { Dialog, Transition } from "@headlessui/react";
import ProfileImage from "../../assets/images/users/user-4.jpg";
import CryptoJS from "crypto-js";
import debounceFunction from "@/helper/Debounce";

// Secret key for encryption
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
};

const Branch = () => {
    const [isDark] = useDarkMode();
    const navigate = useNavigate();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const handleCloseLoadingModal = () => setShowLoadingModal(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleView = (row) => {
        scrollToTop();
        navigate(`/view-branch/${encryptId(row._id)}`, { state: { id: row._id, name: "view" } });
    };

    const handleEdit = (row) => {
        scrollToTop();
        navigate("/create-branch", { state: { id: row._id, name: "edit", row } });
    };

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
                    const dataObject = { keyword: keyWord, page, perPage, branchId: row._id };
                    const response = await branchService.deleteOne(dataObject);
                    setTotalRows(response?.data?.data?.count);
                    setPaginationData(response?.data?.data?.branches);
                    toast.success("Deleted Successfully");
                } catch (error) {
                    console.error("Error deleting branch:", error);
                    toast.error("Failed to delete");
                }
            }
        });
    };

    const handleActive = async (row) => {
        setShowLoadingModal(true);
        const status = row.isActive ? 0 : 1;
        try {
            const clientId = localStorage.getItem("saas_client_clientId");
            const dataObject = { keyword: keyWord, page, perPage, status, id: row._id, clientId };
            const response = await branchService.activeInactive(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.branches);
            toast.success(status ? "Activated Successfully" : "Deactivated Successfully");
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to update status");
        } finally {
            setShowLoadingModal(false);
        }
    };

    const handleFilter = (e) => {
        const value = e.target.value;
        setKeyWord(value);
        setPending(true);
        debounceSearch(value);
    };

    const debounceSearch = useCallback(
        debounceFunction(async (searchTerm) => {
            await fetchBranches(page, searchTerm);
        }, 1000),
        [page, perPage]
    );

    const fetchBranches = async (currentPage = page, search = keyWord) => {
        try {
            setPending(true);
            const response = await branchService.getList(currentPage, search, perPage);
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.branches || []);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.error("Error fetching branches:", error);
            toast.error("Failed to load branches");
        }
    };

    useEffect(() => {
        fetchBranches();
    }, [page, perPage]);

    const handlePageChange = (newPage) => setPage(newPage);
    const handlePerRowChange = (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    const totalPages = Math.ceil(totalRows / perPage);

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 gap-3 items-center mb-6">
            <div className="table-heading text-start">
                <button
                    className="bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white px-4 py-2 rounded"
                    onClick={() => navigate("/create-branch")}
                >
                    Create Branch
                </button>
            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search branches..."
                    value={keyWord}
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary bg-lightBgInputColor dark:bg-darkInput text-lightinputTextColor dark:text-white"
                />
            </div>
        </div>
    );

    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white p-4 rounded-lg"} min-h-[85vh]`}>
            {subHeaderComponent}

            {pending ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <img src={loadingImg} alt="Loading" className="h-8 w-8" />
                    <p className="text-xl font-medium">Processing...</p>
                </div>
            ) : paginationData?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-xl font-medium">There is no record to display</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {paginationData.map((row) => (
                        <div
                            key={row._id}
                            className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}
                        >
                            <div onClick={() => handleView(row)} className=" cursor-pointer">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{row.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{row.city || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm">
                                        <span className="font-medium">Email:</span> {row.emailContact || "N/A"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Phone:</span> {row.contactNumber || "N/A"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">GSTIN:</span> {row.gstInNumber || "N/A"}
                                    </p>
                                </div>


                            </div>

                            <div className="flex justify-between items-center">
                                <span
                                    onClick={() => handleActive(row)}
                                    className={`px-4 py-1 rounded-full text-sm cursor-pointer transition ${row.isActive
                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        }`}
                                >
                                    {row.isActive ? "Active" : "Inactive"}
                                </span>
                                <div className="flex gap-3">
                                    <Tooltip content="View" placement="top">
                                        <button onClick={() => handleView(row)} className="text-blue-600 hover:text-blue-800">
                                            <Icon icon="heroicons:eye" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Edit" placement="top">
                                        <button onClick={() => handleEdit(row)} className="text-green-600 hover:text-green-800">
                                            <Icon icon="heroicons:pencil-square" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Delete" placement="top" theme="danger">
                                        <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-800">
                                            <Icon icon="heroicons:trash" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!pending && paginationData?.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <select
                        value={perPage}
                        onChange={(e) => handlePerRowChange(Number(e.target.value))}
                        className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-4 py-2 border rounded disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-4 py-2 border rounded disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Modal */}
            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-200 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-8 shadow-xl">
                                    <div className="flex flex-col items-center gap-4">
                                        <FormLoader />
                                        <p className="text-lg font-medium">Processing...</p>
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

export default Branch;
