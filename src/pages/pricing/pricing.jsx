import useDarkmode from '@/hooks/useDarkMode';
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "react-data-table-component";
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import categoryService from '@/services/category/category.service';
import subcategoryService from '@/services/subCategory/subcategory.service';
import Tooltip from '../../components/ui/Tooltip';
import Icons from '@/components/ui/Icon';
import Swal from "sweetalert2";
import debounceFunction from '@/helper/Debounce';
// import loadingImg from "../../assets/images/logo/Kosmo-Clinic-Logo.png"
import FormLoader from '@/Common/formLoader/FormLoader';
import IconImg from "../../assets/images/aestree-logo.png"
import tableConfigure from '../common/tableConfigure';
import productBlueprintService from '@/services/productBlueprint/productBlueprint.service';
import priceService from '@/services/price/price.service';
import attributeService from '@/services/attribute/attribute.service';
import Loading from '@/components/Loading';




function Pricing({ centered, noFade, scrollContent }) {
    const [isDark] = useDarkmode()
    const { noDataStyle, customStyles } = tableConfigure()

    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [attributeLoadinng, setAttributeLoading] = useState(false);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isViewed, setIsViewed] = useState(false);
    const [editData, setEditData] = useState(false);
    const [create, setCreate] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [paginationData, setPaginationData] = useState();
    const [id, setId] = useState(null);
    const [keyWord, setkeyWord] = useState("");
    const [toggleWord, setToggleWord] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeProductBlueprint, setActiveProductBlueprint] = useState([]);


    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isErrorInCustomForm, setIsErrorInCustomForm] = useState(false);

    const [attributesPriceArray, setAttributesPriceArray] = useState([]);
    const [attributesArray, setAttributesArray] = useState([])
    console.log("attributesPriceArray", attributesPriceArray);

    const [formData, setFormData] = useState({
        product: "",
    });

    const [formDataErr, setFormDataErr] = useState({
        product: "",

    });
    const {
        product
    } = formData;

    const generateCombinations = (attributes) => {
        const values = attributes.map((attr) => ({
            name: attr.name,
            values: attr.values.map((v) => v.valueName),
        }));

        const combine = (index, current, result) => {
            if (index === values.length) {
                result.push({ attributes: { ...current }, price: '', active: false });
                return;
            }
            const { name, values: attrValues } = values[index];
            attrValues.forEach((value) => {
                current[name] = value;
                combine(index + 1, current, result);
            });
        };

        const combinations = [];
        combine(0, {}, combinations);
        return combinations;
    };

    const getCombinationColumns = () => {
        const attributeColumns = attributesArray.map((attr) => ({
            name: attr.name,
            selector: (row) => row.attributes[attr.name] || 'N/A',
            sortable: true,
        }));
        return [
            ...attributeColumns,
            {
                name: 'Price (₹)',
                selector: (row, index) => (
                    <input
                        type="number"
                        value={row.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        disabled={editData}
                        className={`form-control py-1 px-2 border rounded-md w-24 ${isDark ? 'bg-darkInput text-white border-darkSecondary' : 'bg-white border-lightborderInputColor'
                            } ${isErrorInCustomForm && !row.price ? 'border-red-500' : ''}`}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        aria-label={`Price for ${Object.values(row.attributes).join('/')}`}
                    />
                ),
            },
            {
                name: 'Action',
                selector: (row, index) => (
                    <button
                        className={`${row?.active == false ? "bg-red-300 " : "bg-green-300"} p-2 rounded-full`}
                        disabled={editData}
                        onClick={() => handleActivate(index, row?.active)}
                    >
                        {row?.active == false ? "Activate" : "Inactivate"}
                    </button>
                ),
            },
        ];
    };


    const handlePriceChange = (index, value) => {
        if (value && (isNaN(value) || value < 0)) {
            toast.error('Price must be a positive number');
            return;
        }
        setAttributesPriceArray((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], price: value };
            return updated;
        });
        setIsErrorInCustomForm(false);
    };

    const handleActivate = (index, value) => {
        setAttributesPriceArray((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], active: !value };
            return updated;
        });
        setIsErrorInCustomForm(false);
    };

    useEffect(() => {
        if (product && create) {
            console.log("product ad", product);
            getAttributesOfProduct(product)
        }
        async function getAttributesOfProduct(product) {
            try {
                const response = await attributeService.getAttributesOfProduct(product);
                setAttributesArray(response?.data?.attributes)
                const combinations = generateCombinations(response?.data?.attributes);
                console.log("combinations", combinations);
                setAttributesPriceArray(combinations);
            } catch (error) {
                console.log("error while fetching attribute of product", error);
            }
        }
    }, [product])

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setCreate(true);
        setFormData((prev) => ({
            ...prev,
            product: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            product: ""
        }));
        setLoading(false);
        setId(null);
        setAttributesPriceArray([])
        setRefresh((prev) => prev + 1)
    };

    const openModal = () => {
        setShowModal(!showModal);
    };

    const handleFilter = (e) => {
        let newkeyWord = e.target.value;
        setkeyWord(newkeyWord);
        debounceSearch(newkeyWord)
    };

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    setPending(true)
                    const response = await priceService.getAllList({ page, keyword: nextValue, perPage })
                    setPaginationData(response?.data?.productRates);
                    setTotalRows(response?.data?.count)
                    setPending(false)
                } catch (error) {
                    setPending(false)
                    console.log("error while getting list", error);
                }
            },
            1000
        ),
        []
    );

    function handleCreate() {
        openModal()
        setIsViewed(false);
        setFormData((prev) => ({
            ...prev,
            product: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            product: ""
        }));
        setId(null)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const errorMessages = {
            product: "Product is Required",
        };
        setFormDataErr((prev) => ({
            ...prev,
            [name]: value === "" ? errorMessages[name] : "",
        }));
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validation() {
        const fieldErrors = {
            product: "Product is Required",
        };
        let errorCount = 0;
        const errors = {};
        Object.keys(fieldErrors).forEach((field) => {
            if (!formData[field]) {
                errors[field] = fieldErrors[field];
                errorCount++;
            } else {
                errors[field] = "";
            }
        });
        if (isErrorInCustomForm) {
            errorCount++
        }
        if (attributesPriceArray.length == 0) {
            errorCount++
        }

        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));
        return errorCount > 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const isError = validation();
        console.log("isError", isError);

        if (!isError) {
            const clientId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                clientId: clientId,
                product: product, priceOptions: attributesPriceArray
            }
            setLoading(true)
            if (id) {
                try {
                    dataObject.productRateId = id
                    const response = await priceService.update(dataObject)
                    closeModal()
                    toast.success(response.data.message)

                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while Updating", error);
                }
            } else {
                try {
                    const response = await priceService?.create(dataObject)
                    closeModal()
                    toast.success(response.data.message)
                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while creating", error);
                }
            }
        }
    }

    const handleView = (row) => {
        const id = row._id;
        setToggleWord(true);
        setShowLoadingModal(true);
        setIsViewed(true);
        setEditData(true);
        setCreate(false);
       
        setId(id);
        setFormData((prev) => ({
            ...prev,
            product: row?.product?._id

        }));

        setAttributesPriceArray(row?.priceOptions);

        getAttributesOfProduct(row?.product?._id)

        async function getAttributesOfProduct(product) {
            try {
                 setAttributeLoading(true)
                const response = await attributeService.getAttributesOfProduct(product);
                setAttributesArray(response?.data?.attributes);
                 setAttributeLoading(false)
            } catch (error) {
                 setAttributeLoading(false)
                console.log("error while fetching attribute of product", error);
            }
        }

        setFormDataErr((prev) => ({
            ...prev,
            product: ""
        }))
        setShowLoadingModal(false)
        openModal()
    };

    const handleEdit = (row) => {
        const id = row._id;
        openModal()
        setIsViewed(true);
        setEditData(false);
        setCreate(false);
        setId(id)
        setFormData((prev) => ({
            ...prev,
            product: row?.product?._id

        }));
        setAttributesPriceArray(row?.priceOptions);
        getAttributesOfProduct(row?.product?._id)

        async function getAttributesOfProduct(product) {
            try {
                 setAttributeLoading(true)
                const response = await attributeService.getAttributesOfProduct(product);
                setAttributesArray(response?.data?.attributes);
                 setAttributeLoading(false)
            } catch (error) {
                 setAttributeLoading(false)
                console.log("error while fetching attribute of product", error);
            }
        }
        setFormDataErr((prev) => ({
            ...prev,
            product: ""
        }))
    };

    const handleDelete = (row) => {
        const id = row._id;
        Swal.fire({
            title: `Are you sure you want to delete ${row?.product?.name}?`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: isDark ? "#FF4C4C" : "#DC3545",
            cancelButtonColor: isDark ? "rgb(110 147 143)" : "rgb(4 203 182)",
            background: isDark ? "rgb(29 55 54)" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOne({ id, page, keyword: keyWord, perPage });
            }
        });
    };

    async function deleteOne({ id, page, keyword: keyWord, perPage }) {
        try {
            const response = await priceService.deleteOne({ id, page, keyword: keyWord, perPage });
            setPaginationData(response?.data?.data?.productRates)
            setTotalRows(response?.data?.data?.count)
        } catch (error) {
            console.log("Error while deleting", error);
        }
    }





    const columns = [
        {
            name: "Name",
            selector: (row) => row?.product?.name,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row?.product?.categoryId?.name,
        },
        {
            name: "Price",
            sortable: true,
            selector: (row) => {

                const priceArr = row?.priceOptions?.map((item) => {
                    const string = `${item?.price}`;
                    return string
                });

                const priceString = priceArr.length > 2
                    ? priceArr.slice(0, 2).join(", ") + "..."
                    : priceArr.join(", ");

                return (
                    <span>{priceString}</span>
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
                                <Icons icon="heroicons:pencil-square" />
                            </button>
                        </Tooltip>
                        <Tooltip
                            content=" Delete"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleDelete(row)}
                            >
                                <Icon icon="heroicons:trash" />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllList({ page, keyword: keyWord, perPage })
    }, [refresh]);

    useEffect(() => {
        getActiveProducctBlueprint()
    }, [])

    async function getActiveProducctBlueprint() {
        try {
            const response = await productBlueprintService.getActive();
            setActiveProductBlueprint(response.data.roductBluePrints)
        } catch (error) {
            console.log("error in getting active", error);
        }
    }

    async function getAllList(data) {
        try {
            const response = await priceService.getAllList(data)
            setPaginationData(response?.data?.productRates)
            setTotalRows(response?.data?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await subcategoryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.subCategories)
            setTotalRows(response?.data?.count)
            setPerPage(perPage)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const handlePageChange = async (page) => {
        try {
            const response = await subcategoryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.subCategories)
            setTotalRows(response?.data?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="table-heading text-start ">
                <button className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                    onClick={handleCreate} >
                    Create Pricing
                </button>
            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkInput text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                    onChange={handleFilter}
                />
            </div>
        </div>
    );

    return (
        <>
            <div className={` shadow-md ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
                <div className="text-end mb-4">
                    <div className="flex gap-5 justify-between"></div>
                </div>
                {/* table */}
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
                    // paginationComponentOptions={paginationOptions}
                    noDataComponent={<div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            There is no record to display
                        </p>
                    </div>
                    }
                    progressComponent={
                        <div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>
                            <FormLoader />
                        </div>
                    }
                />
                {/* model */}
                <Transition appear show={showModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[99999]"
                        onClose={closeModal}
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
                        <div className="fixed w-[100%]  inset-0 overflow-y-auto">
                            <div
                                className={`flex min-h-full    justify-center text-center p-6 items-center "
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
                                        text-left align-middle shadow-xl transition-alll  ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                    >
                                        <div
                                            className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                        >
                                            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                                Create Pricing
                                            </h2>
                                            <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                                <Icon icon="heroicons-outline:x" />
                                            </button>
                                        </div>

                                        <div
                                            className={`px-0 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                                }`}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-4">
                                                <div className=''
                                                >
                                                    <label >
                                                        <p className="form-label">
                                                            Product <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="product"
                                                        value={product}
                                                        onChange={handleChange}
                                                        disabled={isViewed}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeProductBlueprint &&
                                                            activeProductBlueprint?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item && item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.product}</p>}

                                                </div>

                                            </div>

                                            {
                                                attributeLoadinng ? 
                                                <div className='flex flex-col justify-center items-center'>
                                                    <FormLoader /> 
                                                    <span>...Loading</span>
                                                </div> :
                                                    <>

                                                        {attributesPriceArray.length > 0 && (
                                                            <div className='p-4'>
                                                                <label className="form-label">Price Combinations</label>
                                                                <DataTable
                                                                    columns={getCombinationColumns()}
                                                                    data={attributesPriceArray}
                                                                    customStyles={customStyles}
                                                                    highlightOnHover
                                                                    noDataComponent={<p>No combinations available</p>}
                                                                />
                                                                {isErrorInCustomForm && (
                                                                    <p className="text-red-600 text-xs">Please enter valid prices for all combinations</p>
                                                                )}
                                                            </div>
                                                        )}

                                                    </>
                                            }



                                        </div>

                                        {(
                                            <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
                                                <div className="flex gap-2">
                                                    <Button
                                                        text="Cancel"
                                                        // className="border bg-red-300 rounded px-5 py-2"
                                                        className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                                                        onClick={() => closeModal()}
                                                    />

                                                    {
                                                        isViewed && (
                                                            <Button
                                                                text="Edit"
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` bg-lightBtn dark:bg-darkBtn px-4 py-2 rounded`}
                                                                onClick={() => setIsViewed(false)}
                                                                isLoading={loading}
                                                            />

                                                        )
                                                    }
                                                    {
                                                        !isViewed && (
                                                            <Button
                                                                text={`${id ? "Update" : "Save"}`}
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                                                onClick={handleSubmit}
                                                                isLoading={loading}
                                                            />

                                                        )
                                                    }


                                                </div>
                                            </div>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
                {/* loding dialog */}
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
                                className={`flex min-h-screen min-w-full justify-center text-center p-6 items-center "
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
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] `}
                                    >
                                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                            <FormLoader />
                                            {
                                                toggleWord ? <p className='py-3'>Loading...</p> : <p className='py-5'>processing...</p>
                                            }

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    )
}

export default Pricing

