// import ordersService from '@/services/orders/orders.service';
// import React, { useEffect, useState } from 'react'
// import toast from 'react-hot-toast';
// import { useLocation, useNavigate } from 'react-router-dom'

// function ViewOrder() {

//     const navigate = useNavigate()
//     const location = useLocation();
//     const data = location?.state?.data;
//     const [orders, setOrders] = useState([]);

//     console.log("orders", orders);
//     console.log("data",data);



//     // handling status change
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const statusOptions = [
//         "APPROVED",
//         "DISAPPROVED",
//         "IN_PRODUCTION",
//         "SHIPPED",
//         "DELIVERED",
//         "CANCELLED",
//     ];

//     const handleUpdateStatus = async (orderId) => {
//         if (!selectedStatus) {
//             toast.error("Please select a status");
//             return;
//         }
//         if (selectedStatus === "CANCELLED" && !window.confirm("Are you sure you want to cancel this order?")) {
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const response = await ordersService.updateStatus(data?._id, selectedStatus)
//             toast.success(response.data.message);
//             setIsModalOpen(false);
//             navigate("/order-list")
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update status");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (data && data?.items?.length > 0) {
//             setOrders(data?.items)
//         }
//     }, [data]);


//     function removePublicPrefix(path) {
//         if (path.startsWith('/public')) {
//             return path.slice(7); // remove first 7 characters (/public)
//         }
//         return path; // if it doesn't start with /public, return as is
//     }

//     return (
//         <div className="mx-auto px-4 py-6 max-w-7xl">
//             {/* Page Header */}
//             <div className="mb-6 flex justify-between items-center">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white/50">Order Details</h2>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => setIsModalOpen(true)}
//                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                         Update Status
//                     </button>
//                     <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
//                         Cancel Order
//                     </button>
//                 </div>
//             </div>

//             {/* Modal for Status Update */}
//             {isModalOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//                     style={{ backdropFilter: "blur(4px)" }}
//                 >                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">Update Order Status</h3>
//                         <select
//                             value={selectedStatus}
//                             onChange={(e) => setSelectedStatus(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">Select Status</option>
//                             {statusOptions.map((status) => (
//                                 <option key={status} value={status}>
//                                     {status.charAt(0) + status.slice(1).toLowerCase()}
//                                 </option>
//                             ))}
//                         </select>
//                         <div className="mt-6 flex justify-end gap-2">
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => handleUpdateStatus(orders[0]?.id)} // Assuming single order for demo
//                                 disabled={isLoading}
//                                 className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
//                                     }`}
//                             >
//                                 {isLoading ? "Updating..." : "Update"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delivery Details Section */}
//             <div className="grid gap-6 md:grid-cols-3">
//                 <div className="md:col-span-1">
//                     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">Delivery Details</h3>
//                         {data?.address ? (
//                             <div className="space-y-3 text-sm text-gray-600">
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Customer Name</span>
//                                     <span>{data.address.fullName || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Phone</span>
//                                     <span>{data.address.phone || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Alternative Phone</span>
//                                     <span>{data.address.alternativePhone || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Country</span>
//                                     <span>{data.address.country || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">State</span>
//                                     <span>{data.address.state || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">City</span>
//                                     <span>{data.address.city || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Zipcode</span>
//                                     <span>{data.address.zipcode || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Address</span>
//                                     <span>{data.address.addressLine || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Nearby</span>
//                                     <span>{data.address.nearby || "N/A"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-medium text-gray-800 dark:text-white/50">Road Name</span>
//                                     <span>{data.address.roadName || "N/A"}</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <p className="text-sm text-gray-500">No address details available.</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Order Items Section */}
//                 <div className="md:col-span-2">
//                     <div className="bg-white px-6 py-4 mb-2 rounded-lg shadow-md border border-gray-200">

//                         <p>Current Status : <span className='font-semibold'>{data?.status}</span> </p>

//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">Order Items</h3>
//                         <div className="space-y-4">
//                             {orders.length === 0 ? (
//                                 <div className="text-center py-10 text-gray-500">
//                                     <p className="text-lg">No items found.</p>
//                                 </div>
//                             ) : (
//                                 orders?.map((item) => {

//                                     console.log("item",item);



//                                     const name = item?.productStock?.product?.name || "Unnamed Product";
//                                     const priceOption = item?.priceOption || {};
//                                     const price = priceOption?.price || 0;
//                                     const quantity = item?.quantity || 1;
//                                     const subtotal = price * quantity;
//                                     const image =
//                                         item?.productStock?.product?.images?.[0] ||
//                                         "https://via.placeholder.com/80";
//                                     const status = data?.status || "DELIVERED";
//                                     const deliveryDate = item?.deliveryDate
//                                         ? new Date(item.deliveryDate).toLocaleDateString()
//                                         : "Aug 12, 2025";
//                                     const customizationDetails = item?.customizationDetails || new Map();
//                                     return (
//                                         <>
//                                             <div
//                                                 key={item.id}
//                                                 className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
//                                             >
//                                                 <div className="flex-shrink-0">
//                                                     <img
//                                                         src={`${import.meta.env.VITE_BASE_URL}/productBluePrint/${image}`}
//                                                         alt={name}
//                                                         className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
//                                                         onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
//                                                     />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <h4 className="text-lg font-semibold text-gray-900 break-words">
//                                                         {name}
//                                                     </h4>
//                                                     <p className="text-sm text-gray-600">
//                                                         Quantity: {quantity} | Unit Price: ${price.toFixed(2)}
//                                                     </p>
//                                                     <div className="mt-2 flex items-center gap-2">
//                                                         <span
//                                                             className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${status === "DELIVERED"
//                                                                 ? "bg-green-100 text-green-800"
//                                                                 : status === "SHIPPED"
//                                                                     ? "bg-blue-100 text-blue-800"
//                                                                     : status === "PENDING"
//                                                                         ? "bg-yellow-100 text-yellow-800"
//                                                                         : status === "APPROVED"
//                                                                             ? "bg-indigo-100 text-indigo-800"
//                                                                             : status === "DISAPPROVED"
//                                                                                 ? "bg-red-100 text-red-800"
//                                                                                 : status === "IN_PRODUCTION"
//                                                                                     ? "bg-purple-100 text-purple-800"
//                                                                                     : "bg-gray-100 text-gray-800 dark:text-white/50"
//                                                                 }`}
//                                                         >
//                                                             {status}
//                                                         </span>
//                                                         {status === "DELIVERED" && (
//                                                             <p className="text-sm text-gray-500">
//                                                                 Delivered on {deliveryDate}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                     {customizationDetails.size > 0 && (
//                                                         <div className="mt-2 text-sm text-gray-600">
//                                                             <p className="font-medium">Customizations:</p>
//                                                             <ul className="list-disc pl-4">
//                                                                 {[...customizationDetails.entries()].map(([key, value]) => (
//                                                                     <li key={key}>
//                                                                         {key}: {value}
//                                                                     </li>
//                                                                 ))}
//                                                             </ul>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex flex-col items-end gap-2 w-full md:w-auto">
//                                                     <div className="text-lg font-bold text-gray-800 dark:text-white/50">
//                                                         Total: ${subtotal.toFixed(2)}
//                                                     </div>
//                                                 </div>

//                                             </div>

//                                             {
//                                                 item?.productStock?.product?.isCustomizable ?

//                                                     <div>
//                                                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">View Customisation</h3>
//                                                         <div
//                                                             className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
//                                                         >

//                                                             {Object.entries(item?.customizationDetails).map(([key, value]) => (
//                                                                 <div key={key}>
//                                                                     <strong>{key}:</strong> {value}
//                                                                 </div>
//                                                             ))}

//                                                         </div>

//                                                         <div
//                                                             className="flex flex-col mt-2 md:flex-row items-start gap-4 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
//                                                         >

//                                                             {
//                                                                 item?.customizationFiles && item?.customizationFiles?.length > 0 ?
//                                                                     item?.customizationFiles?.map((img, index) => {

//                                                                         const imgUrlHalf = removePublicPrefix(img?.fileUrl)

//                                                                         return (
//                                                                             <div className='flex flex-col gap-2' key={index}>
//                                                                                 <strong className=''>{img?.fieldName}</strong>
//                                                                                 <div className='flex justify-center items-center'>
//                                                                                     <img className='h-[60%] w-[60%]' src={`${import.meta.env.VITE_BASE_URL}${imgUrlHalf}`} alt="" />
//                                                                                 </div>
//                                                                             </div>
//                                                                         )

//                                                                     }) : ""
//                                                             }

//                                                         </div>
//                                                     </div>
//                                                     :
//                                                     ""

//                                             }



//                                         </>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Order Summary */}
//             <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">Order Summary</h3>
//                 <div className="space-y-2 text-sm text-gray-600">
//                     <div className="flex justify-between">
//                         <span>Subtotal</span>
//                         <span>
//                             $
//                             {orders
//                                 .reduce(
//                                     (acc, item) =>
//                                         acc + (item?.priceOption?.price || 0) * (item?.quantity || 1),
//                                     0
//                                 )
//                                 .toFixed(2)}
//                         </span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span>Shipping</span>
//                         <span>$0.00</span>
//                     </div>
//                     <div className="flex justify-between font-semibold text-gray-800 dark:text-white/50">
//                         <span>Total</span>
//                         <span>
//                             $
//                             {orders
//                                 .reduce(
//                                     (acc, item) =>
//                                         acc + (item?.priceOption?.price || 0) * (item?.quantity || 1),
//                                     0
//                                 )
//                                 .toFixed(2)}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ViewOrder

import ordersService from '@/services/orders/orders.service';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';

function ViewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location?.state?.data;
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const [currentItemId, setCurrentItemId] = useState(null);

  const statusOptions = [
    'APPROVED',
    'DISAPPROVED',
    'IN_PRODUCTION',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  const handleUpdateStatus = async (orderId) => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }
    if (selectedStatus === 'CANCELLED' && !window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await ordersService.updateStatus(data?._id, selectedStatus, currentItemId);
      toast.success(response.data.message);
      setRefreshCount((prev) => prev + 1)
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (fileUrl, fieldName) => {
    if (!fileUrl) {
      toast.error('Invalid file URL');
      return;
    }
    setDownloadingFile(fieldName);
    try {
      const cleanUrl = removePublicPrefix(fileUrl);
      const fullUrl = `${import.meta.env.VITE_BASE_URL}${cleanUrl}`;
      console.log('Attempting to download:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'GET',
        // headers: {
        //   'Accept': 'application/octet-stream',
        // },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileExtension = cleanUrl.match(/\.(\w+)$/)?.[1] || '';
      link.download = fieldName ? `${fieldName}${fileExtension ? `.${fileExtension}` : ''}` : `customization-file${fileExtension ? `.${fileExtension}` : ''}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(
        error.message.includes('Failed to fetch')
          ? 'Unable to download file due to server restrictions. Try opening the file directly.'
          : `Failed to download file: ${error.message}`
      );
      // Fallback: Open file in new tab
      window.open(fileUrl, '_blank');
    } finally {
      setDownloadingFile(null);
    }
  };

  useEffect(() => {
    if (data && data?.items?.length > 0) {
      setOrders(data?.items);
    }
  }, [data]);

  useEffect(() => {
    async function fetchUpdatedOrders() {
      try {
        const response = await ordersService.getOne(data?._id);
        setOrders(response?.data?.items);
      } catch (error) {
        console.log("error while getting the updated order", error);
      }
    }
    fetchUpdatedOrders()
  }, [refreshCount])

  function removePublicPrefix(path) {
    if (path && path.startsWith('/public')) {
      return path.slice(7);
    }
    return path || '';
  }

  return (
    <div className="mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Order Details</h2>
        {/* <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Update order status"
          >
            Update Status
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Cancel order"
          >
            Cancel Order
          </button>
        </div> */}
      </div>

      {/* Modal for Status Update */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white dark:bg-darkSecondary p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/50 mb-4">Update Order Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select order status"
            >
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentItemId(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cancel status update"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(data?._id)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Update order status"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-darkSecondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Details</h3>
            {data?.address ? (
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Customer Name</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.fullName || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Phone</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.phone || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Alternative Phone</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.alternativePhone || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Country</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.country || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">State</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.state || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">City</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.city || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Zipcode</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.zipcode || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Address</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.addressLine || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Nearby</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.nearby || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Road Name</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.roadName || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address details available.</p>
            )}
          </div>
        </div>

        {/* Order Items Section */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-darkSecondary px-6 py-4 mb-2 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
            <p className='text-gray-900 dark:text-white'>
              Order ID: <span className="font-semibold dark:text-white/80">{data?.orderNumber}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-darkSecondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Items</h3>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg">No items found.</p>
                </div>
              ) : (
                orders?.map((item, index) => {
                  const name = item?.productStock?.product?.name || 'Unnamed Product';
                  const priceOption = item?.priceOption || {};
                  const price = priceOption?.unitPrice || 0;
                  const quantity = item?.quantity || 1;
                  const subtotal = price * quantity;
                  const image = item?.productStock?.product?.images?.[0] || 'https://via.placeholder.com/80';
                  const status = item?.status || 'DELIVERED';
                  const deliveryDate = item?.deliveryDate
                    ? new Date(item.deliveryDate).toLocaleDateString()
                    : 'Aug 12, 2025';
                  const customizationDetails = item?.customizationDetails || new Map();

                  return (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-darkSecondary/30 transition-colors">
                        <div className="flex-shrink-0">
                          <img
                            src={`${image}`}
                            alt={name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white/90 break-words">{name}</h4>
                          <p className="text-sm text-gray-600 dark:text-white/80">
                            Quantity: {quantity} | Unit Price: ${price.toFixed(2)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${status === 'DELIVERED'
                                ? 'bg-green-100 text-green-800'
                                : status === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : status === 'APPROVED'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : status === 'DISAPPROVED'
                                        ? 'bg-red-100 text-red-800'
                                        : status === 'IN_PRODUCTION'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800 dark:text-white/50'
                                }`}
                            >
                              {status}
                            </span>
                            {status === 'DELIVERED' && (
                              <p className="text-sm text-gray-500">Delivered on {deliveryDate}</p>
                            )}
                          </div>
                          {customizationDetails.size > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="font-medium">Customizations:</p>
                              <ul className="list-disc pl-4">
                                {[...customizationDetails.entries()].map(([key, value]) => (
                                  <li key={key}>
                                    {key}: {value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          <div className="text-lg font-bold text-gray-800 dark:text-white/90">
                            Total: ${priceOption?.price?.toFixed(2)}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsModalOpen(true)
                                setCurrentItemId(item?._id)
                              }}
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="Update order status"
                            >
                              Update Status
                            </button>
                            <button
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label="Cancel order"
                            >
                              Cancel Order
                            </button>
                          </div>
                        </div>
                      </div>

                      {item?.productStock?.product?.isCustomizable && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">View Customization</h3>
                          <div className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border mb-4 border-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-darkSecondary/30 transition-colors">
                            {Object.entries(item?.customizationDetails).map(([key, value]) => (
                              <div key={key} className="text-sm text-gray-600 dark:text-white/80">
                                <strong>{key}:</strong> {value}
                              </div>
                            ))}
                          </div>

                          {item?.customizationFiles && item?.customizationFiles?.length > 0 && (
                            <div className="flex flex-col md:flex-row flex-wrap items-start gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-darkSecondary/30 transition-colors">
                              {item.customizationFiles.map((img, index) => {
                                const imgUrlHalf = removePublicPrefix(img?.fileUrl);
                                const fullUrl = `${import.meta.env.VITE_BASE_URL}${imgUrlHalf}`;

                                return (
                                  <div key={index} className="relative flex flex-col gap-2 w-full md:w-1/3">
                                    <strong className="text-sm text-gray-800 dark:text-white/80">{img?.fieldName}</strong>
                                    <div className="relative flex justify-center items-center">
                                      <img
                                        className="h-[150px] w-full max-w-[200px] object-contain rounded-md border border-gray-200"
                                        src={fullUrl}
                                        alt={`${img?.fieldName} customization`}
                                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                        loading="lazy"
                                      />
                                      <button
                                        onClick={() => handleDownloadFile(img?.fileUrl, img?.fieldName)}
                                        disabled={downloadingFile === img?.fieldName}
                                        className={`absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${downloadingFile === img?.fieldName ? 'opacity-50 cursor-not-allowed' : ''
                                          }`}
                                        aria-label={`Download ${img?.fieldName} file`}
                                        title={`Download ${img?.fieldName}`}
                                      >
                                        {downloadingFile === img?.fieldName ? (
                                          <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth="4"
                                            />
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                          </svg>
                                        ) : (
                                          <FaDownload size={16} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white dark:bg-darkSecondary  p-6 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-white/70">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              $
              {orders
                .reduce((acc, item) => acc + (item?.priceOption?.price || 0) , 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 dark:text-white/80">
            <span>Total</span>
            <span>
              $
              {orders
                .reduce((acc, item) => acc + (item?.priceOption?.price || 0) , 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrder;