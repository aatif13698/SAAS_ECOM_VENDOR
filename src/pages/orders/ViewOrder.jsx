import ordersService from '@/services/orders/orders.service';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom'

function ViewOrder() {

    const navigate = useNavigate()
    const location = useLocation();
    const data = location?.state?.data;
    const [orders, setOrders] = useState([]);

    // handling status change
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const statusOptions = [
        "APPROVED",
        "DISAPPROVED",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ];

    const handleUpdateStatus = async (orderId) => {
        if (!selectedStatus) {
            toast.error("Please select a status");
            return;
        }
        if (selectedStatus === "CANCELLED" && !window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await ordersService.updateStatus(data?._id, selectedStatus)
            toast.success(response.data.message);
            setIsModalOpen(false);
            navigate("/order-list")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (data && data?.items?.length > 0) {
            setOrders(data?.items)
        }
    }, [data]);

    return (
        <div className="mx-auto px-4 py-6 max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Order Details</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Update Status
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                        Cancel Order
                    </button>
                </div>
            </div>

            {/* Modal for Status Update */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backdropFilter: "blur(4px)" }}
                >                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Order Status</h3>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(orders[0]?.id)} // Assuming single order for demo
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isLoading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Details Section */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Details</h3>
                        {data?.address ? (
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Customer Name</span>
                                    <span>{data.address.fullName || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Phone</span>
                                    <span>{data.address.phone || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Alternative Phone</span>
                                    <span>{data.address.alternativePhone || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Country</span>
                                    <span>{data.address.country || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">State</span>
                                    <span>{data.address.state || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">City</span>
                                    <span>{data.address.city || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Zipcode</span>
                                    <span>{data.address.zipcode || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Address</span>
                                    <span>{data.address.addressLine || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Nearby</span>
                                    <span>{data.address.nearby || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">Road Name</span>
                                    <span>{data.address.roadName || "N/A"}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No address details available.</p>
                        )}
                    </div>
                </div>

                {/* Order Items Section */}
                <div className="md:col-span-2">
                    <div className="bg-white px-6 py-4 mb-2 rounded-lg shadow-md border border-gray-200">

                        <p>Current Status : <span className='font-semibold'>{data?.status}</span> </p>

                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <p className="text-lg">No items found.</p>
                                </div>
                            ) : (
                                orders?.map((item) => {
                                    const name = item?.productStock?.product?.name || "Unnamed Product";
                                    const priceOption = item?.priceOption || {};
                                    const price = priceOption?.price || 0;
                                    const quantity = item?.quantity || 1;
                                    const subtotal = price * quantity;
                                    const image =
                                        item?.productStock?.product?.images?.[0] ||
                                        "https://via.placeholder.com/80";
                                    const status = item?.status || "DELIVERED";
                                    const deliveryDate = item?.deliveryDate
                                        ? new Date(item.deliveryDate).toLocaleDateString()
                                        : "Aug 12, 2025";
                                    const customizationDetails = item?.customizationDetails || new Map();

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`${import.meta.env.VITE_BASE_URL}/productBluePrint/${image}`}
                                                    alt={name}
                                                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                                                    onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-semibold text-gray-900 break-words">
                                                    {name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {quantity} | Unit Price: ${price.toFixed(2)}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${status === "DELIVERED"
                                                            ? "bg-green-100 text-green-800"
                                                            : status === "SHIPPED"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : status === "PENDING"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : status === "APPROVED"
                                                                        ? "bg-indigo-100 text-indigo-800"
                                                                        : status === "DISAPPROVED"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : status === "IN_PRODUCTION"
                                                                                ? "bg-purple-100 text-purple-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {status}
                                                    </span>
                                                    {status === "DELIVERED" && (
                                                        <p className="text-sm text-gray-500">
                                                            Delivered on {deliveryDate}
                                                        </p>
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
                                                <div className="text-lg font-bold text-gray-800">
                                                    Total: ${subtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>
                            $
                            {orders
                                .reduce(
                                    (acc, item) =>
                                        acc + (item?.priceOption?.price || 0) * (item?.quantity || 1),
                                    0
                                )
                                .toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-800">
                        <span>Total</span>
                        <span>
                            $
                            {orders
                                .reduce(
                                    (acc, item) =>
                                        acc + (item?.priceOption?.price || 0) * (item?.quantity || 1),
                                    0
                                )
                                .toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrder
