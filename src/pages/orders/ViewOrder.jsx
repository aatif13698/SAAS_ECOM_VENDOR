

// new 3
import ordersService from '@/services/orders/orders.service';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import jsPDF from 'jspdf';

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
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);


  console.log("data", data);


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
      setRefreshCount((prev) => prev + 1);
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
    setDownloadingFile(fileUrl);
    try {
      const cleanUrl = removePublicPrefix(fileUrl);
      const fullUrl = `${cleanUrl}`;
      console.log('Attempting to download:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
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
      toast.error('Failed to download file. Opening in new tab as fallback.');
      window.open(fileUrl, '_blank');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleViewFile = async (fileUrl) => {
    if (!fileUrl) {
      toast.error('Invalid file URL');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };


  const generatePDF = async () => {
    if (selectedItems.length === 0) {
      toast.error('No items selected');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let yPos = 10;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Order List', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(10, yPos, 200, yPos); // Header underline
    yPos += 10;

    // Company Info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Aestree E-business', 10, yPos);
    doc.text('Fashion Hub Enterprise, Asansol, India', 10, yPos + 5);
    doc.text('Email: contact@fashionhub.com', 10, yPos + 10);
    yPos += 20;

    // Order Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${data?.orderNumber || 'N/A'}`, 10, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 200, yPos, { align: 'right' });
    yPos += 10;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 200, yPos); // Section separator
    yPos += 10;

    // Customer/Delivery Information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Customer & Delivery Information', 10, yPos);
    doc.line(10, yPos + 2, 100, yPos + 2); // Underline heading
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    if (data?.address) {
      doc.text(`Name: ${data.address.fullName || 'N/A'}`, 10, yPos);
      yPos += 6;
      doc.text(`Phone: ${data.address.phone || 'N/A'}`, 10, yPos);
      yPos += 6;
      doc.text(`Alt. Phone: ${data.address.alternamtivePhone || 'N/A'}`, 10, yPos);
      yPos += 6;
      doc.text(`Address: ${data.address.address || 'N/A'}, ${data.address.city || 'N/A'}, ${data.address.state || 'N/A'}, ${data.address.country || 'N/A'} ${data.address.ZipCode || ''}`, 10, yPos, { maxWidth: 190 });
      yPos += 6;
      doc.text(`Nearby: ${data.address.nearbyLandmark || 'N/A'}`, 10, yPos);
      yPos += 6;
      doc.text(`Road: ${data.address.roadName || 'N/A'}`, 10, yPos);
      yPos += 10;
    } else {
      doc.text('No delivery details available.', 10, yPos);
      yPos += 10;
    }
    doc.line(10, yPos, 200, yPos); // Section separator
    yPos += 10;

    // Selected Items (Table-like structure)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Selected Items', 10, yPos);
    doc.line(10, yPos + 2, 60, yPos + 2); // Underline heading
    yPos += 8;
    doc.setFontSize(11);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPos, 190, 8, 'F'); // Table header background
    doc.setFont('helvetica', 'bold');
    doc.text('Item Name', 12, yPos + 6);
    doc.text('Qty', 100, yPos + 6);
    doc.text('Price', 120, yPos + 6);
    doc.text('Subtotal', 140, yPos + 6);
    yPos += 8;

    const selectedOrders = orders.filter((item) => selectedItems.includes(item._id));

    for (const item of selectedOrders) {
      const name = item?.productMainStock?.name || 'Unnamed Product';
      const priceOption = item?.priceOption || {};
      const price = priceOption?.unitPrice || 0;
      const quantity = item?.quantity || 1;
      const subtotal = price * quantity;
      const image = item?.productMainStock?.images?.[0] || 'https://via.placeholder.com/80';
      const customizationDetails = item?.customizationDetails || {};
      const customizationFiles = item?.customizationFiles || [];

      // Item Row
      doc.setFont('helvetica', 'normal');
      doc.text(name.substring(0, 40), 12, yPos + 6, { maxWidth: 85 });
      doc.text(quantity.toString(), 100, yPos + 6);
      doc.text(`$${price.toFixed(2)}`, 120, yPos + 6);
      doc.text(`$${subtotal.toFixed(2)}`, 140, yPos + 6);
      yPos += 10;

      // Image
      try {
        const imgResponse = await fetch(image);
        if (imgResponse.ok) {
          const imgBlob = await imgResponse.blob();
          const imgBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(imgBlob);
            reader.onloadend = () => resolve(reader.result);
          });
          doc.addImage(imgBase64, 'JPEG', 12, yPos, 20, 20); // 20x20 mm
          yPos += 25;
        } else {
          doc.text('Image not available', 12, yPos);
          yPos += 10;
        }
      } catch (error) {
        console.error('Error loading image for PDF:', error);
        doc.text('Image not available', 12, yPos);
        yPos += 10;
      }

      // Customizations
      if (Object.keys(customizationDetails).length > 0 || customizationFiles.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Customizations:', 15, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        Object.entries(customizationDetails).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 20, yPos, { maxWidth: 170 });
          yPos += 6;
        });
        customizationFiles.forEach((file) => {
          doc.text(`${file.fieldName}: ${file.originalName || 'File'}`, 20, yPos, { maxWidth: 170 });
          yPos += 6;
        });
      }

      // Bottom border for item row
      yPos += 5;
      doc.setLineWidth(0.2);
      doc.line(10, yPos, 200, yPos); // Bottom border
      yPos += 10;

      // Check for page overflow
      if (yPos > 270) {
        doc.addPage();
        yPos = 10;
      }
    }

    // Order Summary
    // if (yPos > 250) { // Ensure enough space for summary and footer
    //   doc.addPage();
    //   yPos = 10;
    // }
    // doc.setLineWidth(0.2);
    // doc.line(10, yPos, 200, yPos); // Section separator
    // yPos += 10;
    // doc.setFont('helvetica', 'bold');
    // doc.setFontSize(14);
    // doc.text('Order Summary', 10, yPos);
    // doc.line(10, yPos + 2, 60, yPos + 2); // Underline heading
    // yPos += 10;
    // doc.setFont('helvetica', 'normal');
    // doc.setFontSize(11);
    // const total = selectedOrders.reduce((acc, item) => acc + (item?.priceOption?.price || 0), 0);
    // doc.text(`Subtotal: $${total.toFixed(2)}`, 150, yPos, { align: 'right' });
    // yPos += 6;
    // doc.text('Shipping: $0.00', 150, yPos, { align: 'right' });
    // yPos += 6;
    // doc.setFont('helvetica', 'bold');
    // doc.text(`Total: $${total.toFixed(2)}`, 150, yPos, { align: 'right' });
    // yPos += 10;

    // Footer
    if (yPos > 260) { // Ensure footer fits within bottom margin
      doc.addPage();
      yPos = 10;
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Aestree E-business', 105, 270, { align: 'center' });
    doc.text('Thank you for your business!', 105, 275, { align: 'center' });

    // Save PDF
    doc.save(`Order_${data?.orderNumber || 'Invoice'}.pdf`);
  };

  useEffect(() => {
    if (data && data?.items?.length > 0) {
      setOrders(data?.items.map(item => ({
        ...item,
        productMainStock: item.productMainStock ? item.productMainStock : null,
      })));
    }
  }, [data]);

  useEffect(() => {
    async function fetchUpdatedOrders() {
      try {
        const response = await ordersService.getOne(data?._id);
        setOrders(response?.data?.items.map(item => ({
          ...item,
          productMainStock: item.productMainStock ? item.productMainStock : null,
        })));
      } catch (error) {
        console.log('Error while getting the updated order', error);
      }
    }
    fetchUpdatedOrders();
  }, [refreshCount]);

  function removePublicPrefix(path) {
    if (path && path.startsWith('/public')) {
      return path.slice(7);
    }
    return path || '';
  }

  return (
    <div className="mx-auto md:px-4 px-0 py-6 ">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Order Details</h2>
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
                  setCurrentItemId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cancel status update"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(data?._id)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Update order status"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details Section */}
      <div className="grid gap-6 lg:grid-cols-3 ">
        <div className="lg:col-span-1 col-span-3">
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
                  <span className="text-gray-700 dark:text-white/70">{data.address.alternamtivePhone || 'N/A'}</span>
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
                  <span className="text-gray-700 dark:text-white/70">{data.address.ZipCode || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Address</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.address || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-white/90">Nearby</span>
                  <span className="text-gray-700 dark:text-white/70">{data.address.nearbyLandmark || 'N/A'}</span>
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
        <div className="lg:col-span-2 col-span-3">
          <div className="bg-white dark:bg-darkSecondary px-6 py-4 mb-2 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
            <p className="text-gray-900 dark:text-white">
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
                  console.log("order item", item);
                  
                  const name = item?.productMainStock?.name || 'Unnamed Product';
                  const priceOption = item?.priceOption || {};
                  const price = priceOption?.unitPrice || 0;
                  const hasDiscount = priceOption?.hasDiscount;
                  const discountPercent = priceOption?.discountPercent;
                  const quantity = item?.quantity || 1;
                  const subtotal = price * quantity;
                  const image = item?.productMainStock?.images?.[0] || 'https://via.placeholder.com/80';
                  const status = item?.status || 'DELIVERED';
                  const deliveryDate = item?.deliveryDate
                    ? new Date(item.deliveryDate).toLocaleDateString()
                    : 'Aug 12, 2025';
                  const customizationDetails = item?.customizationDetails || new Map();

                  return (
                    <div className="border-2 border-dashed bg-white dark:bg-transparent shadow-lg border-lightBtn dark:border-darkBtn p-2" key={index}>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedItems.includes(item?._id)}
                          onChange={() => toggleItemSelection(item?._id)}
                        />
                        <label className="text-sm text-gray-700 dark:text-white/70">Select for Print</label>
                      </div>
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
                            Quantity: <span className='font-bold'>{quantity}</span> | Unit Price: <span className='font-bold'>${price.toFixed(2)}</span>
                          </p>
                          {
                            hasDiscount ?
                              <p className="text-sm text-gray-600 dark:text-white/80">
                                Discount <span className='text-red-500 font-bold'>%</span>: <span className='font-bold'>{discountPercent} </span>
                              </p> : ""
                          }
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
                                setIsModalOpen(true);
                                setCurrentItemId(item?._id);
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
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customization Data</h3>
                          <div className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border mb-4 border-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-darkSecondary/30 transition-colors">
                            {Object.entries(item?.customizationDetails).map(([key, value]) => (
                              <div key={key} className="text-sm text-gray-600 dark:text-white/80">
                                <strong>{key}:</strong> {value}
                              </div>
                            ))}
                          </div>

                          {item?.customizationFiles && item?.customizationFiles?.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-darkSecondary/30 transition-colors">
                              {item.customizationFiles.map((img, index) => {
                                console.log('custom image', img);
                                const imgUrlHalf = removePublicPrefix(img?.fileUrl);
                                const fullUrl = `${imgUrlHalf}`;

                                return (
                                  <div
                                    key={index}
                                    className="relative border bg-white dark:bg-transparent px-2 py-4 rounded-md flex flex-col gap-2"
                                  >
                                    <strong className="text-sm text-gray-800 dark:text-white/80">{img?.fieldName}</strong>
                                    <div className="relative flex flex-col gap-2">
                                      <p className='text-wrap'>{img.originalName}</p>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleDownloadFile(img?.fileUrl, img?.fieldName)}
                                          disabled={downloadingFile === img?.fileUrl}
                                          className={`p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${downloadingFile === img?.fileUrl ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                          aria-label={`Download ${img?.fieldName} file`}
                                          title={`Download ${img?.fieldName}`}
                                        >
                                          {downloadingFile === img?.fileUrl ? (
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
                                        <button
                                          onClick={() => handleViewFile(img?.fileUrl)}
                                          disabled={downloadingFile === img?.fileUrl}
                                          className={`p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 ${downloadingFile === img?.fileUrl ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                          aria-label={`View ${img?.fieldName} file`}
                                          title={`View ${img?.fieldName}`}
                                        >
                                          {downloadingFile === img?.fileUrl ? (
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
                                            <MdOutlineRemoveRedEye size={16} />
                                          )}
                                        </button>
                                      </div>
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
            <div className="mt-4 flex justify-end">
              <button
                onClick={generatePDF}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Print selected items"
              >
                Print Selected Items
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-darkSecondary/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-white/70">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              ${orders.reduce((acc, item) => acc + (item?.priceOption?.price || 0), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 dark:text-white/80">
            <span>Total</span>
            <span>
              ${orders.reduce((acc, item) => acc + (item?.priceOption?.price || 0), 0).toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewOrder;