import FormLoader from '@/Common/formLoader/FormLoader';
import customerService from '@/services/customer/customer.service';
import ordersService from '@/services/orders/orders.service';
import stockService from '@/services/stock/stock.service';
import React, { useEffect, useState } from 'react'
import { Card } from "@mui/material";
import useDarkmode from '@/hooks/useDarkMode';

function CreateOrder() {
  const [isDark] = useDarkmode();
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [priceOption, setPriceOptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerAddresses, setCustomerAddresses] = useState([]);

  console.log("priceOption", priceOption);

  const [formData, setFormData] = useState({
    productStockId: "",
    quantity: "",
    priceOption: "",
    customerId: "",
    addressId: "",
  });

  const [formDataErr, setFormDataErr] = useState({
    productStockId: "",
    quantity: "",
    priceOption: "",
    customerId: "",
    addressId: "",
  });

  useEffect(() => {
    if (formData?.customerId) {
      getCustomerAddresses(formData?.customerId)
    }
  }, [formData?.customerId])

  useEffect(() => {
    if (formData?.productStockId && stocks) {
      getPriceOptions(formData?.productStockId);
    }
  }, [formData?.productStockId, stocks]);

  function getPriceOptions(id) {
    const selectedStock = stocks.filter((item) => item?._id == id);
    setPriceOptions(selectedStock[0]?.priceOptions)
  }

  console.log("formData", formData);
  console.log("stocks", stocks);
  console.log("customers", customers);

  useEffect(() => {
    getStockList();
    getCustomersList();
  }, []);

  async function getStockList() {
    try {
      const response = await stockService.getAllStocks();
      setStocks(response?.data?.stocks)
    } catch (error) {
      console.log("error while getting the stocks", error);
    }
  }

  async function getCustomersList() {
    try {
      const response = await customerService.getAll();
      setCustomers(response?.data?.customers)
    } catch (error) {
      console.log("error while getting customers", error);
    }
  }

  async function getCustomerAddresses(id) {
    try {
      const response = await customerService.getCustomerAddress(id);
      console.log("address response ", response);
      setCustomerAddresses(response?.data?.addresses)
    } catch (error) {
      console.log("error while getting customer addresses", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (!value) {
      switch (name) {
        case "productStockId":
          errorMessage = "Stock is required.";
          break;
        case "quantity":
          errorMessage = "Quantity is required.";
          break;
        case "priceOption":
          errorMessage = "Price option is required.";
          break;
        case "customerId":
          errorMessage = "Customer is required.";
          break;
        case "addressId":
          errorMessage = "Address is required.";
          break;
      }
    }

    if (name === "quantity" && value && (isNaN(value) || value <= 0)) {
      errorMessage = "Quantity must be a positive number.";
    }

    setFormDataErr((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = {
      productStockId: "",
      quantity: "",
      priceOption: "",
      customerId: "",
      addressId: "",
    };

    // Validate all fields
    if (!formData.productStockId) {
      newErrors.productStockId = "Stock is required.";
      hasError = true;
    }
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required.";
      hasError = true;
    } else if (isNaN(formData.quantity) || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
      hasError = true;
    }
    if (!formData.priceOption) {
      newErrors.priceOption = "Price option is required.";
      hasError = true;
    }
    if (!formData.customerId) {
      newErrors.customerId = "Customer is required.";
      hasError = true;
    }
    if (!formData.addressId) {
      newErrors.addressId = "Address is required.";
      hasError = true;
    }

    setFormDataErr(newErrors);

    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      const extractPriceOption = priceOption.filter((item) => item?._id == formData?.priceOption);
      const actualPriceOption = {
        price : extractPriceOption[0]?.price,
        quantity : extractPriceOption[0]?.quantity,
        unit : extractPriceOption[0]?.unit
      }
      const dataObject = {
        customerId : formData?.customerId,
        productStockId : formData?.productStockId,
        quantity : formData?.quantity,
        priceOption : JSON.stringify(actualPriceOption),
        addressId : formData?.addressId,
      }
      console.log("dataObject",dataObject);

      await ordersService.createOrder(dataObject);
      // Reset form after successful submission
      setFormData({
        productStockId: "",
        quantity: "",
        priceOption: "",
        customerId: "",
        addressId: "",
      });
      setCustomerAddresses([]);
      setPriceOptions([]);
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {pageLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="flex flex-col justify-center mt-5 items-center gap-2">
            <FormLoader />
          </div>
        </div>
      ) : (
        <div>
          <Card>
            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    className={`fromGroup ${formDataErr.productStockId ? "has-error" : ""}`}
                  >
                    <label htmlFor="productStockId" className="form-label">
                      <p className="form-label">
                        Stock <span className="text-red-500">*</span>
                      </p>
                    </label>
                    <select
                      name="productStockId"
                      value={formData.productStockId}
                      onChange={handleChange}
                      className="form-control py-2 appearance-none relative flex-1"
                    >
                      <option value="">None</option>
                      {stocks?.map((item) => (
                        <option value={item?._id} key={item?._id}>
                          {item?.product?.name}
                        </option>
                      ))}
                    </select>
                    {formDataErr.productStockId && (
                      <p className="text-sm text-red-500">{formDataErr.productStockId}</p>
                    )}
                  </div>
                  <div
                    className={`fromGroup ${formDataErr.priceOption ? "has-error" : ""}`}
                  >
                    <label htmlFor="priceOption" className="form-label">
                      <p className="form-label">
                        Price <span className="text-red-500">*</span>
                      </p>
                    </label>
                    <select
                      name="priceOption"
                      value={formData.priceOption}
                      onChange={handleChange}
                      className="form-control py-2 appearance-none relative flex-1"
                    >
                      <option value="">None</option>
                      {priceOption?.map((item, index) => (
                        <option value={item?._id} key={index}>
                          {`${item?.quantity}/${item?.unit}/Rs${item?.price}`}
                        </option>
                      ))}
                    </select>
                    {formDataErr.priceOption && (
                      <p className="text-sm text-red-500">{formDataErr.priceOption}</p>
                    )}
                  </div>
                  <div
                    className={`fromGroup ${formDataErr.quantity ? "has-error" : ""}`}
                  >
                    <label htmlFor="quantity" className="form-label">
                      <p className="form-label">
                        Quantity <span className="text-red-500">*</span>
                      </p>
                    </label>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-control py-2 appearance-none relative flex-1"
                      type="number"
                    />
                    {formDataErr.quantity && (
                      <p className="text-sm text-red-500">{formDataErr.quantity}</p>
                    )}
                  </div>
                  <div
                    className={`fromGroup ${formDataErr.customerId ? "has-error" : ""}`}
                  >
                    <label htmlFor="customerId" className="form-label">
                      <p className="form-label">
                        Customer <span className="text-red-500">*</span>
                      </p>
                    </label>
                    <select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      className="form-control py-2 appearance-none relative flex-1"
                    >
                      <option value="">None</option>
                      {customers?.map((item) => (
                        <option value={item?._id} key={item?._id}>
                          {item?.firstName + " " + item?.lastName}
                        </option>
                      ))}
                    </select>
                    {formDataErr.customerId && (
                      <p className="text-sm text-red-500">{formDataErr.customerId}</p>
                    )}
                  </div>
                  <div
                    className={`fromGroup ${formDataErr.addressId ? "has-error" : ""}`}
                  >
                    <label htmlFor="addressId" className="form-label">
                      <p className="form-label">
                        Address <span className="text-red-500">*</span>
                      </p>
                    </label>
                    <select
                      name="addressId"
                      value={formData.addressId}
                      onChange={handleChange}
                      className="form-control py-2 appearance-none relative flex-1"
                    >
                      <option value="">None</option>
                      {customerAddresses?.map((item) => (
                        <option value={item?._id} key={item?._id}>
                          {item?.address + " " + (item?.phone)}
                        </option>
                      ))}
                    </select>
                    {formDataErr.addressId && (
                      <p className="text-sm text-red-500">{formDataErr.addressId}</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 col-span-1">
                  <div className="ltr:text-right rtl:text-left p-5">
                    <button
                      disabled={loading}
                      style={
                        loading
                          ? { opacity: "0.5", cursor: "not-allowed" }
                          : { opacity: "1" }
                      }
                      className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center`}
                      type="submit"
                    >
                      {loading && (
                        <>
                          <svg
                            className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 unset-classname`}
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading..
                        </>
                      )}
                      {!loading && "Place Order"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default CreateOrder