import React, { useEffect, Fragment, useState, useRef } from 'react';
import { BsPlus } from "react-icons/bs";
import { Card } from "@mui/material";
import useDarkmode from '@/hooks/useDarkMode';
import { GoTrash, GoCheck } from "react-icons/go";
import supplierService from '@/services/supplier/supplier.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import { Country, State, City } from "country-state-city";
import toast from 'react-hot-toast';

const PurchaseOrderPage = ({ noFade, scrollContent }) => {
  const [isDark] = useDarkmode();
  const buyerState = "West Bengal"; // Assuming buyer's state; adjust as needed
  const [addresses, setAddresses] = useState([]);

  console.log("addresses", addresses);


  const [formData, setFormData] = useState({
    supplier: null,
    shippingAddress: {
      fullName: "",
      phone: "",
      alternamtivePhone: "",
      country: "",
      state: "",
      city: "",
      ZipCode: "",
      address: "",
      roadName: "",
      nearbyLandmark: "",
      houseNumber: "",
      _id: ""
    },
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    items: [{ srNo: 1, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
    notes: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
    },
    isInterState: false,
    roundOff: false,
    paymentMethod: '',
    paidAmount: 0,
    balance: 0,
  });
  console.log("formData", formData);



  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showBankInput, setShowBankInput] = useState(false);



  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTaxes = (item) => {
    const rate = item.gstPercent;
    if (formData.isInterState) {
      item.igstPercent = rate;
      item.cgstPercent = 0;
      item.sgstPercent = 0;
      item.igst = item.taxableAmount * rate / 100;
      item.cgst = 0;
      item.sgst = 0;
    } else {
      item.cgstPercent = rate / 2;
      item.sgstPercent = rate / 2;
      item.igstPercent = 0;
      item.cgst = item.taxableAmount * (rate / 2) / 100;
      item.sgst = item.cgst;
      item.igst = 0;
    }
    item.tax = item.cgst + item.sgst + item.igst;
    item.totalAmount = item.taxableAmount + item.tax;
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: name === 'itemName' ? value : parseFloat(value) || 0 };

    const item = newItems[index];
    item.taxableAmount = item.mrp - item.discount;
    calculateTaxes(item);

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newSrNo = formData.items.length + 1;
    setFormData({
      ...formData,
      items: [...formData.items, { srNo: newSrNo, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, srNo: i + 1 }));
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotals = () => {
    const totalTaxable = formData.items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalTaxes = formData.items.reduce((sum, item) => sum + item.tax, 0);
    const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
    const totalCGST = formData.items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = formData.items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = formData.items.reduce((sum, item) => sum + item.igst, 0);
    const grandTotal = totalTaxable + totalTaxes;
    const roundOffAmount = formData.roundOff ? Math.round(grandTotal) - grandTotal : 0;
    const finalTotal = grandTotal + roundOffAmount;
    return { totalTaxable, totalTaxes, totalDiscount, totalCGST, totalSGST, totalIGST, grandTotal, roundOffAmount, finalTotal };
  };

  const totals = calculateTotals();

  useEffect(() => {
    setFormData(prev => ({ ...prev, balance: totals.finalTotal - prev.paidAmount }));
  }, [totals.finalTotal, formData.paidAmount]);


  useEffect(() => {
    if (formData?.supplier) {
      getShippingAddress(formData?.supplier?._id)
    }
  }, [formData?.supplier]);

  async function getShippingAddress(id, type) {
    try {
      const response = await supplierService.getSupplierAddress(id);
      setAddresses(response?.data?.addresses?.reverse());
      if (response?.data?.addresses?.length > 0) {
        setFormData((prev) => {
          return {
            ...prev,
            shippingAddress: response?.data?.addresses[0]
          }
        })
      } else {
        setFormData((prev) => {
          return {
            ...prev,
            shippingAddress: null,
          }
        })

      }
      if (type == "new Address") {
        setOpenModal2(true)
      }
    } catch (error) {
      console.log("error while getttinf shipping address", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier) {
      alert('Please select a supplier before submitting.');
      return;
    }
    console.log('Purchase Order Data:', formData);
    // Submit to API here
    alert('Purchase Order submitted successfully!');
  };

  const handleSelectSupplier = (supplier) => {
    setFormData({
      ...formData,
      supplier,
      isInterState: supplier.state !== buyerState,
    });
    setOpenModal(false);
  };

  const handleSelectShippingAddress = (address) => {
    setFormData({
      ...formData,
      shippingAddress: address
    });
    setOpenModal2(false);
  };


  useEffect(() => {
    const getParties = async () => {
      try {
        const response = await supplierService.getAllActive();
        setSuppliers(response?.data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    getParties();
  }, []);

  const isBankFilled = Object.values(formData.bankDetails).some(value => value !== '');


  // add address section
  const [formData2, setFormData2] = useState({
    fullName: "",
    phone: "",
    alternamtivePhone: "",
    country: "",
    state: "",
    city: "",
    ZipCode: "",
    houseNumber: "",
    roadName: "",
    nearbyLandmark: "",
    address: ""
  });


  const [formDataErr2, setFormDataErr2] = useState({
    fullName: "", phone: "", alternamtivePhone: "", country: "", state: "", city: "", ZipCode: "", houseNumber: "", roadName: "", nearbyLandmark: "", address: ""
  });
  const {
    fullName, phone, alternamtivePhone, country, state, city, ZipCode, houseNumber, roadName, nearbyLandmark, address
  } = formData2;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let dataobject = {
      fullName: formData2.fullName,
      phone: formData2.phone,
      alternamtivePhone: formData2.alternamtivePhone,
      ZipCode: formData2.ZipCode,
      houseNumber: formData2.houseNumber,
      roadName: formData2.roadName,
      nearbyLandmark: formData2.nearbyLandmark,
      address: formData2.address,
    }

    if (name == "fullName") {
      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          fullName: "Full Name is required!"
        }))

      } else if (value.length < 3) {
        setFormDataErr2((prev) => ({
          ...prev,
          fullName: "At least 3 characters required!"
        }))
      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          fullName: ""
        }))
      }
      dataobject.fullName = value
    } else if (name == "phone") {
      const phone = /^\d{10}$/;
      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          phone: "Phone number is required!"
        }))
      } else if (!phone.test(value)) {
        setFormDataErr2((prev) => ({
          ...prev,
          phone: "Phone number should be 10-digit!"
        }))
      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          phone: ""
        }))
      }
      dataobject.phone = value
    } else if (name == "alternamtivePhone") {
      const phone = /^\d{10}$/;
      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          alternamtivePhone: "Phone number is required!"
        }))
      } else if (!phone.test(value)) {
        setFormDataErr2((prev) => ({
          ...prev,
          alternamtivePhone: "Phone number should be 10-digit!"
        }))
      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          alternamtivePhone: ""
        }))
      }
      dataobject.alternamtivePhone = value


    } else if (name == "ZipCode") {

      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          ZipCode: "Zip Code is required!"
        }))

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          ZipCode: ""
        }))
      }
      dataobject.ZipCode = value

    } else if (name == "houseNumber") {

      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          houseNumber: "House Number is required!"
        }))

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          houseNumber: ""
        }))
      }
      dataobject.houseNumber = value

    } else if (name == "roadName") {

      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          roadName: "Road Name is required!"
        }))

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          roadName: ""
        }))
      }
      dataobject.roadName = value

    } else if (name == "nearbyLandmark") {

      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          nearbyLandmark: "Nearby Landmark is required!"
        }))

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          nearbyLandmark: ""
        }))
      }
      dataobject.nearbyLandmark = value

    } else if (name == "address") {

      if (!value) {
        setFormDataErr2((prev) => ({
          ...prev,
          address: "Address is required!"
        }))

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          address: ""
        }))
      }
      dataobject.address = value

    }

    setFormData2(dataobject)


  };

  const [countryData, setCountryData] = useState({
    countryList: "",
    countryName: "",
    countryISOCode: "",
    CountryISDCode: "",
    stateList: "",
    stateName: "",
    stateISOCode: "",
    cityList: "",
    cityName: "",
  });
  const {
    countryList,
    countryName,
    countryISOCode,
    CountryISDCode,
    stateList,
    stateName,
    stateISOCode,
    cityList,
    cityName,
  } = countryData;




  useEffect(() => {
    setCountryData((prev) => ({
      ...prev,
      countryList: Country.getAllCountries(),
      stateList: State.getStatesOfCountry(countryISOCode),
      cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
    }));
  }, [countryISOCode, stateISOCode]);

  // ----- Handling the country name
  const handleCountry = (e) => {
    const { name, value } = e.target;
    const selectedCountry = countryList.find(
      (country) => country?.name === value
    );
    if (name == "country") {
      if (value == "") {
        // setFormDataErr((prev) => ({
        //     ...prev,
        //     country: "Country is required",
        // }));

      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          country: "",
        }));
      }
    }
    if (selectedCountry) {
      setCountryData((prev) => ({
        ...prev,
        countryName: selectedCountry?.name,
        countryISOCode: selectedCountry?.isoCode,
        CountryISDCode: selectedCountry?.contactNumbercode,
      }));
      setFormData2((prev) => ({
        ...prev,
        country: selectedCountry?.name
      }))
    } else {

      setCountryData((prev) => ({
        ...prev,
        countryName: "",
        countryISOCode: "",
        CountryISDCode: "",
      }));

    }
  };

  // ----- Handling the state name as per the country name
  const handleState = (e) => {
    const { name, value } = e.target;
    const selectedState = stateList.find((state) => state?.name === value);
    if (name === "state") {
      if (value === "") {
        // setFormDataErr((prev) => ({
        //     ...prev,
        //     state: "State is required",
        // }));
      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          state: "",
        }));
      }
    }

    if (selectedState) {
      setCountryData((prev) => ({
        ...prev,
        stateName: selectedState?.name,
        stateISOCode: selectedState?.isoCode,
      }));
      setFormData2((prev) => ({
        ...prev,
        state: selectedState?.name
      }))
    } else {
      setCountryData((prev) => ({
        ...prev,
        stateName: "",
        stateISOCode: "",
      }));

    }
  };

  // ----- Handling the city name as per the state name
  const handleCity = (e) => {
    const { name, value } = e.target;
    if (name === "city") {
      if (value === "") {
        setFormDataErr2((prev) => ({
          ...prev,
          city: "City is required",
        }));
      } else {
        setFormDataErr2((prev) => ({
          ...prev,
          city: "",
        }));
      }
    }
    setCountryData((prev) => ({
      ...prev,
      cityName: value,
    }));

    setFormData2((prev) => ({
      ...prev,
      city: value
    }))
  };

  function validation() {
    let errorCount = 0;

    if (!fullName) {
      setFormDataErr2((prev) => ({
        ...prev,
        fullName: "Full Name is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        fullName: ""
      }))
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      setFormDataErr2((prev) => ({
        ...prev,
        phone: "Phone No. is Required"
      }))
      errorCount++
    } else if (!phoneRegex.test(phone)) {
      setFormDataErr2((prev) => ({
        ...prev,
        phone: "Phone number should be 10-digit"
      }))
      errorCount++
    }
    else {
      setFormDataErr2((prev) => ({
        ...prev,
        phone: ""
      }))
    }

    if (!alternamtivePhone) {
      setFormDataErr2((prev) => ({
        ...prev,
        alternamtivePhone: "Alternative Phone No. is Required"
      }))
      errorCount++
    } else if (!phoneRegex.test(phone)) {
      setFormDataErr2((prev) => ({
        ...prev,
        alternamtivePhone: "Alternative Phone number should be 10-digit"
      }))
      errorCount++
    }
    else {
      setFormDataErr2((prev) => ({
        ...prev,
        alternamtivePhone: ""
      }))
    }

    if (!ZipCode) {
      setFormDataErr2((prev) => ({
        ...prev,
        ZipCode: "Zip Code is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        ZipCode: ""
      }))
    }

    if (!address) {
      setFormDataErr2((prev) => ({
        ...prev,
        address: "Address is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        address: ""
      }))
    }
    if (!houseNumber) {
      setFormDataErr2((prev) => ({
        ...prev,
        houseNumber: "House Number is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        houseNumber: ""
      }))
    }

    if (!roadName) {
      setFormDataErr2((prev) => ({
        ...prev,
        roadName: "Road Name is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        roadName: ""
      }))
    }
    if (!nearbyLandmark) {
      setFormDataErr2((prev) => ({
        ...prev,
        nearbyLandmark: "Nearby Landmark is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        nearbyLandmark: ""
      }))
    }

    if (!countryData?.countryName) {
      setFormDataErr2((prev) => ({
        ...prev,
        country: "Country is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        country: ""
      }))
    }

    countryData?.countryName
    if (!countryData?.stateName) {
      setFormDataErr2((prev) => ({
        ...prev,
        state: "State is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        state: ""
      }))
    }
    if (!countryData?.cityName) {
      setFormDataErr2((prev) => ({
        ...prev,
        city: "City is Required"
      }))
      errorCount++
    } else {
      setFormDataErr2((prev) => ({
        ...prev,
        city: ""
      }))
    }

    if (errorCount > 0) {
      return true
    } else {
      return false
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    const isError = validation();
    if (!isError) {
      setIsSubmitting(true)
      const data = {
        ...formData2, country: countryData?.countryName,
        state: countryData?.stateName,
        city: countryData?.cityName
      }
      try {
        const response = await supplierService.addAddress({ ...data, customerId: formData?.supplier?._id })
        clearData();
        setIsSubmitting(false);
        setOpenModal3(false);
        toast.success("Address Added Successfully")
        getShippingAddress(formData?.supplier?._id, "new Address")
      } catch (error) {
        setIsSubmitting(false)
        console.log("Error while adding address", error);
      }
    }
  };

  function clearData() {
    setCountryData({
      countryList: "",
      countryName: "",
      countryISOCode: "",
      CountryISDCode: "",
      stateList: "",
      stateName: "",
      stateISOCode: "",
      cityList: "",
      cityName: "",
    })

    setFormData2({
      fullName: "",
      phone: "",
      alternamtivePhone: "",
      country: "",
      state: "",
      city: "",
      ZipCode: "",
      houseNumber: "",
      roadName: "",
      nearbyLandmark: "",
      address: ""
    })
  }


  const handleKeyPress = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^6-9\d]/g, ""); //Allow only number starts with 6 to 9
    if (cleanedValue.trim() !== "") {
      e.target.value = cleanedValue;
    } else {
      e.target.value = ""; // Clear the input if no valid characters are present
    }
  };


  return (
    <div>
      <Card>
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
          <form onSubmit={handleSubmit}>
            {/* Section 1: Supplier, PO Details, and Shipping Address */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Invoice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Supplier */}
                <div className={`bg-white dark:bg-transparent ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-2 md:col-span-2 "}   rounded-lg border border-gray-200`}>
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white lg:h-[20%] md:h-[30%] p-2 rounded-t-lg flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-700">Bill From</h3>
                    {formData.supplier && (
                      <Button
                        text=" Change Party"
                        className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setOpenModal(true)}
                      />
                    )}
                  </div>
                  <div className='lg:h-[80%] md:h-[88%] p-4'>
                    {formData.supplier ? (
                      <div className="text-sm">
                        <p><strong>Name:</strong> {formData.supplier.name}</p>
                        <p><strong>Contact Person:</strong> {formData.supplier.contactPerson}</p>
                        <p><strong>Email:</strong> {formData.supplier.emailContact}</p>
                        <p><strong>Contact Number:</strong> {formData.supplier.contactNumber}</p>
                        <p><strong>Address:</strong> {formData.supplier.address}, {formData.supplier.city}, {formData.supplier.state}, {formData.supplier.ZipCode}, {formData.supplier.country}</p>
                        <p><strong>GST/VAT:</strong> {formData.supplier.GstVanNumber}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenModal(true)}
                        className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                      >
                        <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                        <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                          Add Party
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* card 2 */}
                {formData.supplier && (
                  <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-1  rounded-lg border border-gray-200">
                    <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] p-2 rounded-t-lg flex justify-between items-center'>
                      <h3 className="text-lg font-medium text-gray-700">Ship From</h3>
                      {addresses && addresses?.length > 0 ? (
                        <Button
                          text=" Change Shipping"
                          className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                          onClick={() => setOpenModal2(true)}
                        />
                      ) : ""}
                    </div>
                    <div className='h-[80%] p-4'>
                      {formData.shippingAddress ? (
                        <div className="text-sm">
                          <p><strong>Name:</strong> {formData?.shippingAddress?.fullName}</p>
                          <p><strong>Contact Number:</strong> {formData.shippingAddress.phone}</p>
                          <p><strong>Address:</strong> {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state}, {formData.shippingAddress.ZipCode}, {formData.shippingAddress.country}</p>
                          <p><strong>Landmark:</strong> {formData.shippingAddress.nearbyLandmark}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenModal3(true)}
                          className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                        >
                          <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                          <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                            Add Address
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}


                {/* Card 3: PO Details */}
                <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] h-[12%] p-2 rounded-t-lg'>
                    <h3 className="text-lg font-medium mb-2 text-gray-700">Purchase Order Details</h3>
                  </div>
                  <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">Purchase Inv No</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={formData.poNumber}
                        onChange={handleInputChange}
                        className="form-control py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm">Purchase Inv Date</label>
                      <input
                        type="date"
                        name="poDate"
                        value={formData.poDate}
                        onChange={handleInputChange}
                        className="form-control py-2"
                        required
                      />
                    </div>

                    <div className='col-span-1 md:col-span-2 border-dashed border-2 p-[3px]'>
                      <div className='flex md:flex-row flex-col gap-2 justify-between'>
                        <div className='w-full'>
                          <label className="text-sm">Due Date</label>
                          <input
                            type="date"
                            name="poDate"
                            value={formData.poDate}
                            onChange={handleInputChange}
                            className="form-control w-full py-2"
                            required
                          />
                        </div>

                        <div className='w-full'>
                          <label className="text-sm">Due Days</label>
                          <input
                            type="date"
                            name="poDate"
                            value={formData.poDate}
                            onChange={handleInputChange}
                            className="form-control w-full py-2"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Items Table */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-transparent border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-transparent">
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">SR. NO</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Item Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">MRP</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Discount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Taxable Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">GST (%)</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Tax Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Total Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border border-gray-300">{item.srNo}</td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="text"
                            name="itemName"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            required
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="mrp"
                            value={item.mrp}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="discount"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right">{item.taxableAmount.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 w-[10rem]">
                          <input
                            type="number"
                            name="gstPercent"
                            value={item.gstPercent}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right w-[10rem]">{item.tax.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 text-right w-[10rem]">{item.totalAmount.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="bg-gray-100 text-white px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                            disabled={formData.items.length === 1}
                          >
                            <GoTrash className='text-gray-500' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-transparent">
                      <td colSpan={3} className="py-2 px-4 border border-gray-300"></td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300"></td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Taxes: {totals.totalTaxes.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-bold text-sm">Grand Total: {totals.grandTotal.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button
                type="button"
                onClick={addItem}
                className='mt-2 flex items-center p-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
              >
                <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                  Add Item
                </span>
              </button>
            </section>

            <hr className="my-8 border-gray-300" />

            {/* Two-column layout with vertical divider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Vertical divider */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>

              {/* Left Side: Notes and Bank Details */}
              <div className="flex flex-col gap-6 pr-4">
                {/* Notes Section */}
                <section>
                  {showNotesInput ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                        rows="4"
                      />
                      <Button
                        text="Save"
                        className=" mt-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setShowNotesInput(false)}
                      />
                    </div>
                  ) : formData.notes ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
                      <p className="text-gray-700">{formData.notes}</p>
                      <Button
                        text="Edit Notes"
                        className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setShowNotesInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Notes"
                      className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                      onClick={() => setShowNotesInput(true)}
                    />
                  )}
                </section>

                {/* Bank Details Section */}
                <section>
                  {showBankInput ? (
                    <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="bankName"
                          placeholder="Bank Name"
                          value={formData.bankDetails.bankName}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="accountNumber"
                          placeholder="Account Number"
                          value={formData.bankDetails.accountNumber}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="ifscCode"
                          placeholder="IFSC Code"
                          value={formData.bankDetails.ifscCode}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="branch"
                          placeholder="Branch"
                          value={formData.bankDetails.branch}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                      </div>
                      <Button
                        text="Save"
                        className=" mt-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setShowBankInput(false)}
                      />
                    </div>
                  ) : isBankFilled ? (
                    <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="text-sm">
                        <p><strong>Bank Name:</strong> {formData.bankDetails.bankName}</p>
                        <p><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
                        <p><strong>IFSC Code:</strong> {formData.bankDetails.ifscCode}</p>
                        <p><strong>Branch:</strong> {formData.bankDetails.branch}</p>
                      </div>
                      <Button
                        text="Edit Bank Details"
                        className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setShowBankInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Bank Detail"
                      className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                      onClick={() => setShowBankInput(true)}
                    />
                  )}
                </section>
              </div>

              {/* Right Side: Payment Description */}
              <div className="flex flex-col gap-6 pl-4">
                {/* Detailed Payment Summary */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
                  <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total Taxable Amount:</span>
                      <span>{totals.totalTaxable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total CGST:</span>
                      <span>{totals.totalCGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total SGST:</span>
                      <span>{totals.totalSGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total IGST:</span>
                      <span>{totals.totalIGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total Tax Amount:</span>
                      <span>{totals.totalTaxes.toFixed(2)}</span>
                    </div>
                    <div className='h-[1px] bg-gray-300 my-2'></div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>Grand Total:</span>
                      <span>{totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </section>

                {/* Round Off Option */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="roundOff"
                    checked={formData.roundOff}
                    onChange={(e) => setFormData({ ...formData, roundOff: e.target.checked })}
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-50">Round Off</label>
                  {formData.roundOff && (
                    <span className="text-sm text-gray-700 dark:text-gray-200">Round Off Amount: {totals.roundOffAmount.toFixed(2)}</span>
                  )}
                </div>

                {/* Payment Options */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Options</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm">Paid Amount</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Balance:</span>
                      <span>{formData.balance.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        text="Full Payment"
                        className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setFormData({ ...formData, paidAmount: totals.finalTotal, balance: 0 })}
                      />
                    </div>

                  </div>
                </section>
              </div>
            </div>

            <div className="text-right mt-8">
              <button
                type="submit"
                className="rounded-md px-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
              >
                Submit Purchase Order
              </button>
            </div>
          </form>
        </div>
      </Card>

      {/* Supplier Selection Modal */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => { }}
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
          <div
            className="fixed inset-0 "
          >
            <div
              className={`flex min-h-full justify-center text-center p-6 items-center `}
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
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Select Party
                    </h2>
                    <button onClick={() => setOpenModal(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <div
                          key={supplier._id}
                          className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.supplier?._id === supplier._id ? 'bg-indigo-50 text-gray-500' : ''
                            }`}
                          onClick={() => handleSelectSupplier(supplier)}
                        >
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm">{supplier.contactPerson} - {supplier.emailContact}</p>
                          </div>
                          {formData.supplier?._id === supplier._id && (
                            <GoCheck className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                        No suppliers available
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* List address */}
      <Transition appear show={openModal2} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => { }}
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
          <div
            className="fixed inset-0 "
          >
            <div
              className={`flex min-h-full justify-center text-center p-6 items-center `}
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
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Select Address
                    </h2>
                    <button onClick={() => setOpenModal2(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {addresses?.length > 0 ? (
                      addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.shippingAddress?._id === address._id ? 'bg-indigo-50 text-gray-500' : ''
                            }`}
                          onClick={() => handleSelectShippingAddress(address)}
                        >
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm">{address.phone}</p>
                            <p className="text-sm">{address.address},{address?.city}, {address?.state}</p>
                          </div>
                          {formData.shippingAddress?._id === address._id && (
                            <GoCheck className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                        No address available
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal2(false)
                        setTimeout(() => {
                          setOpenModal3(true);
                        }, 300);
                      }}
                      className='flex items-center px-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                    >
                      <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                      <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                        Add Address
                      </span>
                    </button>
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal2(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* add address  */}
      <Transition appear show={openModal3} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999]"
          onClose={() => { }}
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
          <div
            className="fixed inset-0 "
          >
            <div
              className={`flex min-h-full justify-center text-center p-6 items-center `}
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
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Add Address
                    </h2>
                    <button onClick={() => setOpenModal3(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="">
                        <input
                          type="text"
                          name="fullName"
                          value={formData2.fullName}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.fullName}</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="phone"
                          onInput={handleKeyPress}
                          value={formData2.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.phone}</span>

                      </div>

                      <div>
                        <input
                          type="text"
                          name="alternamtivePhone"
                          onInput={handleKeyPress}
                          value={formData2.alternamtivePhone}
                          onChange={handleChange}
                          placeholder="Alternative Phone Number"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.alternamtivePhone}</span>

                      </div>

                      <div>
                        <input
                          type="text"
                          name="ZipCode"
                          value={formData2.ZipCode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.ZipCode}</span>

                      </div>


                      <div className="">
                        <select
                          name="country"
                          value={countryName}
                          className="form-control py-2"
                          onChange={(e) => handleCountry(e)}
                        >
                          <option value="">--select country--</option>
                          {countryList && countryList.length > 0 &&
                            countryList?.map((country) => (
                              <option className="w-[100%]" key={country?.isoCode}>
                                {country && country?.name}
                              </option>
                            ))}
                        </select>
                        <span className="text-red-800">{formDataErr2?.country}</span>
                      </div>

                      <div>
                        <select
                          name="state"
                          value={stateName}
                          // disabled={isViewed}
                          onChange={(e) => handleState(e)}
                          className="form-control py-2"
                        >
                          <option value="">---select state---</option>
                          {stateList &&
                            stateList?.map((state) => (
                              <option key={state?.isoCode}>
                                {state && state?.name}
                              </option>
                            ))}
                        </select>
                        <span className="text-red-800">{formDataErr2?.state}</span>
                      </div>
                      <div>
                        <select
                          name="city"
                          value={cityName}
                          // disabled={isViewed}
                          onChange={(e) => handleCity(e)}
                          className="form-control py-2"
                        >
                          <option value="">---Select city---</option>
                          {cityList &&
                            cityList?.map((city) => (
                              <option key={city?.name}>
                                {city && city?.name}
                              </option>
                            ))}
                        </select>
                        <span className="text-red-800">{formDataErr2?.city}</span>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="houseNumber"
                          value={formData2.houseNumber}
                          onChange={handleChange}
                          placeholder="House Number"
                          className="form-control py-2"

                        />
                        <span className="text-red-800">{formDataErr2?.houseNumber}</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="roadName"
                          value={formData2.roadName}
                          onChange={handleChange}
                          placeholder="Road Name"
                          className="form-control py-2"

                        />

                        <span className="text-red-800">{formDataErr2?.roadName}</span>

                      </div>

                      <div>
                        <input
                          type="text"
                          name="nearbyLandmark"
                          value={formData2.nearbyLandmark}
                          onChange={handleChange}
                          placeholder="Nearby Landmark"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.nearbyLandmark}</span>

                      </div>

                      <div>
                        <input
                          type="text"
                          name="address"
                          value={formData2.address}
                          onChange={handleChange}
                          placeholder="Address"
                          className="form-control py-2"
                        />
                        <span className="text-red-800">{formDataErr2?.address}</span>

                      </div>


                    </div>
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal3(false)}
                    />
                    <Button
                      text="Save"
                      className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                      onClick={handleSave}
                      isLoading={isSubmitting}
                    />
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

export default PurchaseOrderPage;









{/* <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="supplier-modal-title"
        aria-describedby="supplier-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: isDark ? 'rgb(31, 41, 55)' : 'white',
          border: '1px solid',
          borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div
            className={`relative overflow-hidden rounded-t-lg py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
          >
            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
              Select Party
            </h2>
            <button onClick={() => setOpenModal(false)} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
              <Icon icon="heroicons-outline:x" />
            </button>
          </div>
          <Box sx={{
            p: 2,
            flex: 1,
            overflowY: 'auto',
          }}>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className={`p-2 mb-2 rounded cursor-pointer hover:bg-indigo-100 flex justify-between items-center ${formData.supplier?._id === supplier._id ? 'bg-indigo-50' : ''
                    }`}
                  onClick={() => handleSelectSupplier(supplier)}
                >
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.contactPerson} - {supplier.emailContact}</p>
                  </div>
                  {formData.supplier?._id === supplier._id && (
                    <GoCheck className="text-green-500" />
                  )}
                </div>
              ))
            ) : (
              <Typography className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                No suppliers available
              </Typography>
            )}
          </Box>
          {(
            <div className="px-4 py-3 rounded-b-lg flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
              <div className="flex gap-2">
                <Button
                  text="Close"
                  // className="border bg-red-300 rounded px-5 py-2"
                  className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                  onClick={() => setOpenModal(false)}
                />
              </div>
            </div>
          )}
        </Box>
      </Modal> */}