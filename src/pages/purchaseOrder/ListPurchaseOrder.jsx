import React, { useCallback, Fragment, useEffect, useState } from 'react'
import tableConfigure from '../common/tableConfigure';
import useDarkmode from '@/hooks/useDarkMode';
import debounceFunction from '@/helper/Debounce';
import DataTable from 'react-data-table-component';
import FormLoader from '@/Common/formLoader/FormLoader';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import productBlueprintService from '@/services/productBlueprint/productBlueprint.service';
import attributeService from '@/services/attribute/attribute.service';
import variantService from '@/services/variant/variant.service';
import Tooltip from '../../components/ui/Tooltip';
import Icons from '@/components/ui/Icon';
import { key } from 'localforage';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Swal } from 'sweetalert2/dist/sweetalert2';







function ListPurchaseOrder({ centered, noFade, scrollContent }) {

    const navigate = useNavigate()
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

    console.log("activeProductBlueprint", activeProductBlueprint);



    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };


    const [attributesArray, setAttributesArray] = useState([]);

    const [formDataErr2, setFormDataErr2] = useState({
        product: "",

    });

    const [selectedValues, setSelectedValues] = useState({});
    const [attributedError, setAttributeError] = useState("");

    console.log("selectedValues", selectedValues);


    useEffect(() => {

        const attributedError = !Object.values(selectedValues).some(value => value === '');

        if (!attributedError) {
            setAttributeError("Please Select All Attributes")
        } else {
            setAttributeError(null)
        }


    }, [selectedValues])



    // Handle select change for dynamic attributes
    const handleOptionSelect = (e, attributeName) => {
        setSelectedValues((prev) => ({
            ...prev,
            [attributeName]: e.target.value
        }));
    };

    const [formData, setFormData] = useState({
        product: "",
        unit: "",
        stockEffect: "",
        qty: ""
    });

    const [formDataErr, setFormDataErr] = useState({
        product: "",
        unit: "",
        stockEffect: "",
        qty: ""

    });
    const {
        product
    } = formData;


    function transformAttributes(attributes) {
        return attributes.map(({ name, values }) => ({
            name,
            values: values.map(({ valueName }) => ({ valueName }))
        }));
    }


    useEffect(() => {
        if (product) {
            getAttributesOfProduct(product)
        }
        async function getAttributesOfProduct(product) {
            try {
                const response = await attributeService.getAttributesOfProduct(product);
                const attribute = transformAttributes(response?.data?.attributes);
                setAttributesArray(attribute);

                if (create) {
                    setSelectedValues(attribute.reduce((acc, attr) => ({ ...acc, [attr.name]: '' }), {}))

                }

                // setAttributesArray(response?.data?.attributes)
                // const combinations = generateCombinations(response?.data?.attributes);
                // console.log("combinations", combinations);
                // setAttributesPriceArray(combinations);
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
            product: "",
            unit: "",
            qty: "",
            stockEffect: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            product: "",
            unit: "",
            qty: "",
            stockEffect: ""
        }));
        setLoading(false);
        setId(null);
        setAttributesArray([]);
        setSelectedValues({});
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
                    const response = await variantService.getAllList({ page, keyword: nextValue, perPage })
                    setPaginationData(response?.data?.productVariant);
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
        navigate("/create-purchase-order")
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const errorMessages = {
            product: "Product is Required",
            unit: "Unit is required",
            stockEffect: "Stock effect is required",
            qty: "Quaintity is required"
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
            product: "Product is required",
            unit: "Unit is required",
            stockEffect: "Stock effect is required",
            qty: "Quaintity is required"
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


        const attributedError = !Object.values(selectedValues).some(value => value === '');

        if (!attributedError) {
            setAttributeError("Please Select All Attributes")
            errorCount++;
        } else {
            setAttributeError(null

            )

        }



        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));
        return errorCount > 0;
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
            product: row?.product?._id,
            unit: row?.stockEffect?.unit,
            qty: row?.stockEffect?.qty,
            stockEffect: row?.stockEffect?.stockEffect,

        }));

        setSelectedValues(row?.variant)

        // setAttributesPriceArray(row?.priceOptions);

        getAttributesOfProduct(row?.product?._id)

        async function getAttributesOfProduct(product) {
            try {
                setAttributeLoading(true)
                const response = await attributeService.getAttributesOfProduct(product);
                // setAttributesArray(response?.data?.attributes);
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
            product: row?.product?._id,
            unit: row?.stockEffect?.unit,
            qty: row?.stockEffect?.qty,
            stockEffect: row?.stockEffect?.stockEffect,

        }));

        setSelectedValues(row?.variant);
        // setAttributesPriceArray(row?.priceOptions);
        getAttributesOfProduct(row?.product?._id)

        async function getAttributesOfProduct(product) {
            try {
                setAttributeLoading(true)
                const response = await attributeService.getAttributesOfProduct(product);
                // setAttributesArray(response?.data?.attributes);
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
            name: "Unit",
            selector: (row) => row?.stockEffect?.unit,
        },
        {
            name: "Quantity",
            selector: (row) => row?.stockEffect?.qty,
        },

        {
            name: "Stock Effect",
            selector: (row) => row?.stockEffect?.stockEffect,
        },

        {
            name: "Variant",
            selector: (row) => {
                const variant = row?.variant;
                const vari = Object.entries(variant).map(([key, value]) => (`${value}`));
                const variantString = vari.length > 6
                    ? vari.slice(0, 6).join(", ") + "..."
                    : vari.join(" / ");
                return (
                    <span>{variantString}</span>
                )
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
            const response = await variantService.getAllList(data)
            setPaginationData(response?.data?.productVariant)
            setTotalRows(response?.data?.count)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await variantService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.productVariant)
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
            const response = await variantService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.productVariant)
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
                    Create Purchase Order
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

export default ListPurchaseOrder
