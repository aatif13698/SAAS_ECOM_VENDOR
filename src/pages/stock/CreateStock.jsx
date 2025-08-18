import { Card } from "@mui/material";
import React, { useState, Fragment, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../../assets/scss/common.scss"
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";



import { useSelector } from "react-redux";
import ProfileImage from "../../assets/images/users/user-4.jpg"
import TradingLicense from "../../assets/images/tradingLicense.png"
import vendorService from "@/services/vendor/vendor.service";
import Fileinput from "@/components/ui/Fileinput";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import productBlueprintService from "@/services/productBlueprint/productBlueprint.service";
import priceService from "@/services/price/price.service";
import PriceOptions from "./PriceOptions";
import Multiselect from "multiselect-react-dropdown";
import stockService from "@/services/stock/stock.service";
import variantService from "@/services/variant/variant.service";

const CreateStock = ({ noFade, scrollContent }) => {

    // useEffect(() => {
    //     if (roleId !== 1) {
    //         navigate("/dashboard");
    //         return;
    //     }
    //     return;
    // }, []);
    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;
    // const isViewed = location?.state?.isViewed;

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);


    const [pageLoading, setPageLoading] = useState(true);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([])
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState([]);
    const [activeProductBlueprint, setActiveProductBlueprint] = useState([])
    const [activePriceOptions, setActivePriceOptions] = useState([]);
    const [rawPriceOptions, setRawPriceOptions] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState("");
    const [iconImgErr, setIconImgErr] = useState("");

    const [productVariants, setProductVariants] = useState([])

    const [isEditing, setIsEditing] = useState(false);
    const [stockId, setStockId] = useState(null)

    const [normalStocks, setNormalStacks] = useState([])


    // console.log("productVariants", productVariants);



    const [formData, setFormData] = useState({
        product: "",
        variant: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        name: "",
        description: "",

        totalStock: "",
        onlineStock: "",
        offlineStock: "",
        lowStockThreshold: "",
        restockQuantity: "",
    });

    const [seletedVariantData, setSelectedVariantData] = useState(null);

    // console.log("seletedVariantData", seletedVariantData?.priceId?.price);





    const [formDataErr, setFormDataErr] = useState({
        product: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        name: "",
        description: "",

        totalStock: "",
        onlineStock: "",
        offlineStock: "",
        lowStockThreshold: "",
        restockQuantity: "",
        variant: ""
    });


    // console.log("formDataErr", formDataErr);



    const {
        product,
        variant,
        businessUnit,
        branch,
        warehouse,

        name,
        description,

        totalStock,
        onlineStock,
        offlineStock,
        lowStockThreshold,
        restockQuantity,
    } = formData;

    useEffect(() => {
        if (variant) {
            const variantValue = productVariants.find((item) => item?._id === variant);
            setSelectedVariantData(variantValue)
        } else {
            setSelectedVariantData(null)
        }
    }, [variant])



    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [isPasswordVissible, setIsPasswordVissile] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isConfirmPasswordVissible, setConfirmIsPasswordVissile] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [imgPreview, setImgPreviwe] = useState(null);
    const [ImgErr, setImgErr] = useState("");
    const [selectedFile, setselectedFile] = useState(null);



    const [imgPreview2, setImgPreviwe2] = useState(null);
    const [ImgErr2, setImgErr2] = useState("");
    const [selectedFile2, setSelectedFile2] = useState(null);


    const [specifications, setSpecifications] = useState([{ title: '', isSaved: false, items: [{ name: '', description: '' }] }]);
    const [currentSpec, setCurrentSpec] = useState({ title: '', items: [] });
    const [currentItem, setCurrentItem] = useState({ name: '', description: '' });
    const [editingSpecIndex, setEditingSpecIndex] = useState(null);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [specError, setSpecError] = useState('');

    console.log("specifications", specifications);
    console.log("currentSpec", currentSpec);

    useEffect(() => {

    }, [])



    const handleAddSpec = () => {
        if (!currentSpec.title.trim()) {
            setSpecError('Specification title is required');
            return;
        }
        if (currentSpec.items.length === 0) {
            setSpecError('At least one item is required');
            return;
        }
        if (editingSpecIndex !== null) {
            const updatedSpecs = [...specifications];
            updatedSpecs[editingSpecIndex] = currentSpec;
            setSpecifications(updatedSpecs);
            setEditingSpecIndex(null);
        } else {
            setSpecifications([...specifications, currentSpec]);
        }
        setCurrentSpec({ title: '', items: [] });
        setSpecError('');
    };

    const handleAddItem = () => {
        if (!currentItem.name.trim() || !currentItem.description.trim()) {
            setSpecError('Item name and description are required');
            return;
        }
        setCurrentSpec({
            ...currentSpec,
            items: [...currentSpec.items, currentItem],
        });
        setCurrentItem({ name: '', description: '' });
        setSpecError('');
    };

    const handleEditSpec = (index) => {
        setCurrentSpec(specifications[index]);
        setEditingSpecIndex(index);
        setSpecError('');
    };

    const handleDeleteSpec = (index) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    const handleEditItem = (specIndex, itemIndex) => {
        setCurrentSpec(specifications[specIndex]);
        setCurrentItem(specifications[specIndex].items[itemIndex]);
        setEditingSpecIndex(specIndex);
        setEditingItemIndex(itemIndex);
    };

    const handleDeleteItem = (specIndex, itemIndex) => {
        const updatedSpecs = [...specifications];
        updatedSpecs[specIndex].items = updatedSpecs[specIndex].items.filter((_, i) => i !== itemIndex);
        if (updatedSpecs[specIndex].items.length === 0) {
            updatedSpecs.splice(specIndex, 1);
        }
        setSpecifications(updatedSpecs);
        setEditingSpecIndex(null);
        setEditingItemIndex(null);
    };

    const handleUpdateItem = () => {
        if (!currentItem.name.trim() || !currentItem.description.trim()) {
            setSpecError('Item name and description are required');
            return;
        }
        const updatedSpecs = [...specifications];
        updatedSpecs[editingSpecIndex].items[editingItemIndex] = currentItem;
        setSpecifications(updatedSpecs);
        setCurrentSpec({ title: '', items: [] });
        setCurrentItem({ name: '', description: '' });
        setEditingSpecIndex(null);
        setEditingItemIndex(null);
        setSpecError('');
    };

    const navigate = useNavigate();


    //------- Handling the VAlidation ------
    function validationFunction() {
        let errorCount = 0;

        const requiredFields = {
            name: "Name is required",
            description: "Descriptoion is required",
            businessUnit: "Business Unit is Required.",
            branch: "Branch is Required.",
            warehouse: "Warehouse is Required.",
            product: "Product is Required.",
            totalStock: "Total Stock is Required.",
            onlineStock: "Online Stock is Required.",
            offlineStock: "Offline Stock is Required.",
            lowStockThreshold: "Low Stock Threshold is Required.",
            restockQuantity: "Restock Quantity is Required.",
            variant: "Variant is Required."
        };

        const tempErrors = {};

        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!formData[field]) {
                tempErrors[field] = message;
                errorCount++;
            } else {
                tempErrors[field] = "";
            }
        });

        setFormDataErr(tempErrors);
        return errorCount !== 0;
    }








    const handleChange = (e) => {
        const { name, value } = e.target;

        const requiredFields = [
            "businessUnit",
            "branch",
            "warehouse",
            "product",
            "name",
            "description",
            "totalStock",
            "onlineStock",
            "offlineStock",
            "lowStockThreshold",
            "restockQuantity"
        ];

        // Validation for required fields
        if (requiredFields.includes(name)) {
            setFormDataErr(prev => ({
                ...prev,
                [name]: value === "" ? `${formatLabel(name)} is Required.` : ""
            }));
        }

        // Handle special logic for businessUnit
        if (name === "businessUnit") {
            if (value === "") {
                setFormDataErr(prev => ({
                    ...prev,
                    businessUnit: "Business Unit is Required"
                }));
            } else {
                setActiveBranches([]);
                setFormData(prev => ({
                    ...prev,
                    branchId: ""
                }));
            }
        }


        if (name === "variant") {
            if (value === "") {
                setFormDataErr(prev => ({
                    ...prev,
                    variant: "Variant is Required"
                }));
            } else {
                setFormDataErr(prev => ({
                    ...prev,
                    variant: ""
                }));
            }
        }

        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper function to format camelCase to Title Case for labels
    const formatLabel = (fieldName) => {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };



    useEffect(() => {
        if (businessUnit) {
            getBranchByBusiness(businessUnit)
        }
    }, [businessUnit]);


    async function getBranchByBusiness(id) {

        try {
            const response = await warehouseService.getBranchByBusiness(id);

            setActiveBranches(response.data)


        } catch (error) {
            console.log("error while getting branch by business unit");
        }
    }

    useEffect(() => {
        if (branch) {
            getWarehouseByBranch(branch)
        }
    }, [branch]);

    async function getWarehouseByBranch(id) {
        try {
            const response = await warehouseService.getWarehouseByBranch(id);
            setActiveWarehouses(response.data)

        } catch (error) {
            console.log("error while getting warehouse by branch");
        }
    }


    useEffect(() => {
        if (product) {
            // getPriceListByProduct(product);
            getVariant(product);
        }
    }, [product]);


    async function getVariant(product) {
        try {
            const response = await variantService.getVariantByProductId(product);
            const variants = response?.data
            const formatedVariants = variants?.map((item) => {
                const variant = item?.variant;
                const vari = Object.entries(variant).map(([key, value]) => (`${value}`));
                const variantString = vari.length > 6
                    ? vari.slice(0, 6).join(", ") + "..."
                    : vari.join(" / ");
                return {
                    ...item,
                    variant: variantString,
                    variantValue: variant,
                }
            });
            setProductVariants(formatedVariants)
        } catch (error) {
            console.log("error while fetching attribute of product", error);
        }
    }


    function transformPriceArray(priceArray) {
        if (!Array.isArray(priceArray)) {
            throw new Error("Input must be an array");
        }
        return priceArray.map(item => {
            const { attributes, price } = item;

            if (typeof attributes !== 'object' || attributes === null) {
                throw new Error("Each item must have an 'attributes' object");
            }
            // Dynamically build the label from attributes
            const labelParts = Object.values(attributes);
            const label = `${labelParts.join(' / ')} = ${price}`;
            return {
                label,
                value: item?.id
            };
        });
    }

    // async function getPriceListByProduct(id) {
    //     try {
    //         const response = await priceService.getRateByProductId(id);
    //         console.log("responsedsfa", response);
    //         const filteredPriceOptions = response.data.priceOptions?.length > 0 ? response.data.priceOptions?.filter((item) => {
    //             if (item?.price && item?.active) {
    //                 return item
    //             }
    //         }) : [];
    //         const a = filteredPriceOptions?.map((item, index) => ({ ...item, id: index }));
    //         setRawPriceOptions(a)
    //         const result = transformPriceArray(a);
    //         setActivePriceOptions(result)
    //     } catch (error) {
    //         console.log("error while getting rate by product", error);
    //     }
    // }

    //---------- Adding & Editing the Organiser ----------

    const [baseAddress, setBaseAddress] = useState(null);

    useEffect(() => {

        if (baseAddress) {


            setFormData((prev) => ({
                ...prev,
                product: baseAddress?.product,
                businessUnit: baseAddress?.businessUnit,
                branch: baseAddress?.branch,
                warehouse: baseAddress?.warehouse,
                totalStock: baseAddress?.totalStock,
                onlineStock: baseAddress?.onlineStock,
                offlineStock: baseAddress?.offlineStock,
                lowStockThreshold: baseAddress?.lowStockThreshold,
                restockQuantity: baseAddress?.restockQuantity,
                // priceOptions: baseAddress?.priceOptions,
            }));

            setNormalStacks(baseAddress?.normalSaleStock)
            console.log("baseAddress?.priceOptions", baseAddress?.priceOptions);
            const filteredOptions = baseAddress?.priceOptions?.length > 0 ? baseAddress?.priceOptions?.map((item) => {
                return {
                    price: item?.price,
                    quantity: item?.quantity,
                    unit: item?.unit
                }
            }) : [];

            setSelectedPrices(filteredOptions)

        }

    }, [baseAddress])


    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (error) {
            setLoading(false);
            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");

                const variantValue = productVariants.find((item) => item?._id === variant);
                console.log("variantValue", variantValue);

                const payload = new FormData();
                payload.append("clientId", clientId);
                if (selectedFile && selectedFile) {
                    for (let i = 0; i < selectedFile?.length; i++) {
                        payload.append("file", selectedFile[i]);
                    }
                }
                payload.append("product", product);
                payload.append("businessUnit", businessUnit);
                payload.append("branch", branch);
                payload.append("warehouse", warehouse);
                payload.append("name", name);
                payload.append("description", description);
                payload.append("totalStock", totalStock);
                payload.append("onlineStock", onlineStock);
                payload.append("offlineStock", offlineStock);
                payload.append("lowStockThreshold", lowStockThreshold);
                payload.append("restockQuantity", restockQuantity);
                payload.append("variant", variantValue?._id)
                payload.append("varianValue", JSON.stringify(variantValue.variantValue));
                payload.append("specification", JSON.stringify(specifications));
                let response
                if (stockId) {
                    payload.append("stockId", stockId);
                    response = await stockService.update(payload)
                    toast.success(response?.data?.message);
                } else {
                    response = await stockService.create(payload);
                    toast.success(response?.data?.message);
                }

                setBaseAddress(response?.data?.data);

                setSpecifications([{ title: '', isSaved: false, items: [{ name: '', description: '' }] }])

                setFormData((prev) => ({
                    ...prev,
                    totalStock: "",
                    onlineStock: "",
                    offlineStock: "",
                    lowStockThreshold: "",
                    restockQuantity: "",
                    name: "",
                    description: "",
                    variant: ""
                }));
                setSelectedPrices("");
                setFormDataErr({
                    product: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    totalStock: "",
                    onlineStock: "",
                    offlineStock: "",
                    lowStockThreshold: "",
                    restockQuantity: "",
                    name: "",
                    description: "",
                    variant: ""
                })
                setLoading(false);
                setImgPreviwe(null)
                // navigate("/stock-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating", error?.response?.data?.message);
                toast.error(error?.response?.data?.message)
            }
        }
    };
    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            async function getBranch() {
                try {
                    setPageLoading(true)
                    const response = await stockService.getParticularStocks(id);
                    console.log('Response stock data', response?.data);
                    const baseAddress = response?.data;

                    setBaseAddress(response?.data)
                    // setFormData((prev) => ({
                    //     ...prev,
                    //     product: baseAddress?.product,
                    //     businessUnit: baseAddress?.businessUnit,
                    //     branch: baseAddress?.branch,
                    //     warehouse: baseAddress?.warehouse,
                    //     totalStock: baseAddress?.totalStock,
                    //     onlineStock: baseAddress?.onlineStock,
                    //     offlineStock: baseAddress?.offlineStock,
                    //     lowStockThreshold: baseAddress?.lowStockThreshold,
                    //     restockQuantity: baseAddress?.restockQuantity,
                    //     // priceOptions: baseAddress?.priceOptions,
                    // }));

                    // setNormalStacks(baseAddress?.normalSaleStock)
                    // console.log("baseAddress?.priceOptions", baseAddress?.priceOptions);
                    // const filteredOptions = baseAddress?.priceOptions?.length > 0 ? baseAddress?.priceOptions?.map((item) => {
                    //     return {
                    //         price: item?.price,
                    //         quantity: item?.quantity,
                    //         unit: item?.unit
                    //     }
                    // }) : [];

                    // setSelectedPrices(filteredOptions)
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching stock data");
                }
            }
            getBranch();
            setIsViewed(true);

        } else {
            setPageLoading(false);
            setIsViewed(false);

        }

    }, [id]);





    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                // console.log("respone active", response);
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }
        getActiveBusinessUnit()
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




    const handleFileChange1 = (e) => {
        const files = e.target.files;
        let errorCount = 0;
        let tempImgPreviews = [];
        let tempSelectedFiles = [];
        let errorMessage = "";
        if (files) {
            if (files.length + tempSelectedFiles.length > 5) {
                setIconImgErr("You can only upload up to 5 images.");
                return;
            }
            Array.from(files).forEach((file) => {
                const fileSize = file.size / (1024 * 1024); // Convert size to MB
                if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    errorMessage = "Only image files are allowed (jpg, jpeg, png, gif, WEBP)";
                    errorCount++;
                } else if (fileSize > 1) {
                    errorMessage = "File size must be less than 1MB";
                    errorCount++;
                } else {
                    const imageAsBase64 = URL.createObjectURL(file);
                    tempImgPreviews.push(imageAsBase64);
                    tempSelectedFiles.push(file);
                }
            });
            if (errorCount === 0) {
                setIconImgErr(""); // Clear any previous errors
                setselectedFile(tempSelectedFiles); // Save selected files
                setImgPreviwe(tempImgPreviews); // Save previews
            } else {
                setIconImgErr(errorMessage);
            }
        }
    };



    function onEditStock(data) {

        console.log("data", data);


        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsEditing(true);

        setStockId(data?._id);

        setSelectedPrices(data?.priceOptions?.id);
        setFormData((prev) => (
            {
                ...prev,
                name: data?.name,
                description: data?.description,
                totalStock: data?.totalStock,
                onlineStock: data?.onlineStock,
                offlineStock: data?.offlineStock,
                lowStockThreshold: data?.lowStockThreshold,
                restockQuantity: data?.restockQuantity,
                variant: data?.variant
            }));

        if (data?.specification) {
            setSpecifications(data?.specification)
        }

        if (data.images) {
            setImgPreviwe(data.images.map((image) => {
                return `${import.meta.env.VITE_BASE_URL}/productBluePrint/${image}`
            }))
        }
    }



    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                // setLevelList([
                //     {
                //         name: "Vendor",
                //         value: "vendor"
                //     },
                //     {
                //         name: "Business",
                //         value: "business"
                //     },
                //     {
                //         name: "Branch",
                //         value: "branch"
                //     },
                //     {
                //         name: "Warehouse",
                //         value: "warehouse"
                //     },
                // ])
            } else if (currentUser.isBuLevel) {
                // setLevelList([
                //     {
                //         name: "Business",
                //         value: "business"
                //     },
                //     {
                //         name: "Branch",
                //         value: "branch"
                //     },
                //     {
                //         name: "Warehouse",
                //         value: "warehouse"
                //     },
                // ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                // setLevelList([
                //     {
                //         name: "Branch",
                //         value: "branch"
                //     },
                //     {
                //         name: "Warehouse",
                //         value: "warehouse"
                //     },
                // ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                // setLevelList([
                //     {
                //         name: "Warehouse",
                //         value: "warehouse"
                //     },
                // ])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
            }

        } else {

        }

    }, [currentUser])


    const [isUserClicked, setIsUserClicked] = useState(true);

    return (

        <>
            {
                pageLoading ?
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

                    :
                    <div>
                        <Card>
                            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
                                {isUserClicked && (
                                    <div>
                                        <div className="grid lg:grid-cols-3 flex-col gap-3">

                                            <div
                                                className={`fromGroup   ${formDataErr?.businessUnit !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Business Unit <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="businessUnit"
                                                    value={businessUnit}
                                                    onChange={handleChange}
                                                    disabled={isViewed || normalStocks?.length > 0 || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeBusinessUnits &&
                                                        activeBusinessUnits?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.businessUnit}</p>}
                                            </div>

                                            <div
                                                className={`fromGroup   ${formDataErr?.branch !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Branch <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="branch"
                                                    value={branch}
                                                    onChange={handleChange}
                                                    disabled={isViewed || normalStocks?.length > 0 || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeBranches &&
                                                        activeBranches?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.branch}</p>}
                                            </div>

                                            <div
                                                className={`fromGroup   ${formDataErr?.warehouse !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Warehouse <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="warehouse"
                                                    value={warehouse}
                                                    onChange={handleChange}
                                                    disabled={isViewed || normalStocks?.length > 0 || currentUser.isWarehouseLevel}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeWarehouses &&
                                                        activeWarehouses?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
                                            </div>

                                            <div
                                                className={`fromGroup   ${formDataErr?.product !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Product <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="product"
                                                    value={product}
                                                    onChange={handleChange}
                                                    disabled={isViewed || normalStocks?.length > 0}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeProductBlueprint &&
                                                        activeProductBlueprint?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.product}</p>}
                                            </div>
                                        </div>

                                        <div className="mt-4 border-dashed border-2   p-2 rounded-md">
                                            <h5>Stock Fields</h5>
                                            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-3">
                                                <div className=''
                                                >
                                                    <label >
                                                        <p className="form-label">
                                                            Variant <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="variant"
                                                        value={variant}
                                                        onChange={handleChange}
                                                        // disabled={isViewed}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {productVariants &&
                                                            productVariants?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item && item?.variant}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-red-600  text-xs"> {formDataErr.variant}</p>}

                                                </div> 

                                                <div className="lg:col-span-3 md:col-span-2 bg-red">
                                                    {
                                                        seletedVariantData ? <div>
                                                            {
                                                                seletedVariantData?.priceId?.price && seletedVariantData?.priceId?.price.length > 0 ?
                                                                    <div className='overflow-x-auto my-4 '>
                                                                        <span>Price table</span>
                                                                        <table className="min-w-full ">
                                                                            <thead className="bg-[#C9FEFF] dark:bg-darkBtn dark:text-white sticky top-0">
                                                                                <tr className="border-b border-dashed border-lighttableBorderColor">
                                                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                        Quantity(+)
                                                                                    </th>
                                                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-semibold  tracking-wider">
                                                                                        Unit Price
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="bg-white dark:bg-darkAccent">
                                                                                {seletedVariantData?.priceId?.price && seletedVariantData?.priceId?.price?.length > 0 ? (
                                                                                    seletedVariantData?.priceId?.price?.map((item, ind) => {
                                                                                        return (
                                                                                            <tr key={ind} className="border-b border-dashed border-lighttableBorderColor">
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                                    {item.quantity}
                                                                                                </td>
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-start text-sm text-tableTextColor dark:text-white">
                                                                                                    {item.unitPrice}
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="4" className="px-6 py-4 text-center text-lg font-medium text-lightModalHeaderColor">
                                                                                            NO DATA FOUND
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    : ""
                                                            }

                                                        </div> :
                                                            <span>Variant not seleceted yet.</span>
                                                    }
                                                </div>


                                                <label
                                                    className={`fromGroup   ${formDataErr?.name !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Visible Name <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter product name"
                                                        value={name}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.name}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.description !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Description <span className="text-red-500">*</span>
                                                    </p>
                                                    <textarea
                                                        name="description"
                                                        placeholder="Enter total Stock"
                                                        value={description}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.description}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.totalStock !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Total Stock <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="totalStock"
                                                        type="number"
                                                        placeholder="Enter total Stock"
                                                        value={totalStock}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.totalStock}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.onlineStock !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Online Stock <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="onlineStock"
                                                        type="number"
                                                        placeholder="Enter online stock"
                                                        value={onlineStock}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.onlineStock}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.offlineStock !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Offline Stock <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="offlineStock"
                                                        type="number"
                                                        placeholder="Enter offline Stock"
                                                        value={offlineStock}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.offlineStock}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.lowStockThreshold !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Low Stock Threshold <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="lowStockThreshold"
                                                        type="number"
                                                        placeholder="Enter low stock threshold"
                                                        value={lowStockThreshold}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.lowStockThreshold}
                                                        </p>
                                                    }
                                                </label>

                                                <label
                                                    className={`fromGroup   ${formDataErr?.restockQuantity !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Restock Quantity <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="restockQuantity"
                                                        type="number"
                                                        placeholder="Enter restock quantity"
                                                        value={restockQuantity}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                    />
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.restockQuantity}
                                                        </p>
                                                    }
                                                </label>

                                            </div>

                                            {/* Specification Section */}
                                            <div className="col-span-3 mt-3">
                                                {specifications.length > 0 && (
                                                    <div className={` ${isDark ? "bg-darkSecondary text-white" : "bg-white"}  rounded-lg border-1 pb-4  my-4 `}>
                                                        <h6 className="p-4">Add Specifications</h6>
                                                        {specifications.map((spec, specIndex) => (
                                                            <div
                                                                key={specIndex}
                                                                className="border relative pt-4 mx-2 shadow-md border-1 p-3 rounded-md mb-2"
                                                            >
                                                                {
                                                                    specifications?.length == 1 ? "" :
                                                                        <button
                                                                            onClick={() => {
                                                                                const previousValues = [...specifications];
                                                                                if (previousValues?.length !== 1) {
                                                                                    previousValues.splice(specIndex, 1);
                                                                                    setSpecifications(previousValues);
                                                                                }
                                                                            }}
                                                                            className="absolute border-[1px] p-1 rounded-md right-2 top-[10px]"
                                                                        >
                                                                            <FaRegTrashAlt className="text-red-500" />
                                                                        </button>
                                                                }
                                                                <div className="grid lg:grid-cols-3 mb-3 flex-col gap-3">
                                                                    <div className="fromGroup">
                                                                        <label className="form-label">
                                                                            <p>
                                                                                Specification Title <span className="text-red-500">*</span>
                                                                            </p>
                                                                        </label>
                                                                        <input
                                                                            name="title"
                                                                            type="text"
                                                                            placeholder="Enter specification title"
                                                                            value={spec?.title}
                                                                            onChange={(e) => {
                                                                                const { name, value } = e.target;
                                                                                const previousValues = [...specifications];
                                                                                previousValues[specIndex].title = value;
                                                                                setSpecifications(previousValues);
                                                                            }}
                                                                            className="form-control py-2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="rounded-b-md">
                                                                    {spec.items.map((item, itemIndex) => (
                                                                        <div key={itemIndex} className="relative mb-3 pt-4 border-2 border-lightBtn dark:border-darkBtn border-dashed rounded-md p-2 divide-gray-200">
                                                                            {
                                                                                specifications[specIndex].items?.length == 1 ? "" :
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const previousValues = [...specifications];
                                                                                            previousValues[specIndex].items.splice(itemIndex, 1);
                                                                                            setSpecifications(previousValues);
                                                                                        }}
                                                                                        className="absolute border-[1px] p-1 rounded-md right-2 top-[10px]"
                                                                                    >
                                                                                        <FaRegTrashAlt className="text-red-500" />
                                                                                    </button>
                                                                            }
                                                                            <div className="grid lg:grid-cols-2  flex-col my-3 gap-3">
                                                                                <div className="fromGroup">
                                                                                    <label className="form-label">
                                                                                        <p>
                                                                                            Item Name <span className="text-red-500">*</span>
                                                                                        </p>
                                                                                    </label>
                                                                                    <input
                                                                                        name="name"
                                                                                        type="text"
                                                                                        placeholder="Enter item name"
                                                                                        value={item.name}
                                                                                        onChange={(e) => {
                                                                                            const { name, value } = e.target;
                                                                                            const previousValues = [...specifications];
                                                                                            previousValues[specIndex].items[itemIndex].name = value;
                                                                                            setSpecifications(previousValues);
                                                                                        }}
                                                                                        className="form-control py-2"
                                                                                    />
                                                                                </div>
                                                                                <div className="fromGroup">
                                                                                    <label className="form-label">
                                                                                        <p>
                                                                                            Item Description <span className="text-red-500">*</span>
                                                                                        </p>
                                                                                    </label>
                                                                                    <input
                                                                                        name="description"
                                                                                        type="text"
                                                                                        placeholder="Enter item description"
                                                                                        value={item.description}
                                                                                        className="form-control py-2"
                                                                                        onChange={(e) => {
                                                                                            const { name, value } = e.target;
                                                                                            const previousValues = [...specifications];
                                                                                            previousValues[specIndex].items[itemIndex].description = value;
                                                                                            setSpecifications(previousValues);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <button
                                                                        onClick={() => {
                                                                            const previousValues = [...specifications];
                                                                            previousValues[specIndex].items.push({ name: "", description: "" });
                                                                            console.log("previousValues", previousValues);
                                                                            setSpecifications(previousValues)
                                                                        }}
                                                                        className="bg-lightBtn dark:bg-darkBtn p-2 my-2 rounded-md text-white"
                                                                    >+ And More</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-end px-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSpecifications((prev) => {
                                                                        return ([...prev, { title: "", items: [{ name: "", description: "" }] }])
                                                                    })

                                                                }}
                                                                className="bg-lightBtn dark:bg-darkBtn p-2 my-2 rounded-md text-white"
                                                            >+ Add More Specification</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                <label
                                                    htmlFor="profileImage1"
                                                    className="block text-base  font-medium mb-2"
                                                >
                                                    <p className={`mb-1 dark:text-white text-black`}>Upload Files</p>
                                                </label>
                                                <label
                                                    htmlFor="profileImage1"
                                                    className="flex flex-col cursor-pointer  form-control relative border border-dashed border-lightHoverBgBtn dark:border-darkBtn  rounded-lg py-4 text-center"
                                                >
                                                    <label htmlFor="profileImage1" className="text-primary cursor-pointer">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                Click to upload.
                                                            </h3>
                                                            <label
                                                                htmlFor="profileImage1"
                                                                className="text-sm text-gray-500 cursor-pointer"
                                                            >
                                                                (Allowed .jpg, .png less than 1MB)
                                                            </label>
                                                        </div>
                                                    </label>
                                                    <input
                                                        id="profileImage1"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        multiple // Enable multiple file selection
                                                        // disabled={isViewed}
                                                        onChange={(e) => {
                                                            handleFileChange1(e);
                                                        }}
                                                    />
                                                    <span style={{ color: "red", fontSize: "0.7em" }}>
                                                        {<p className="text-red-600 text-xs pt-6 ">{iconImgErr}</p>}
                                                    </span>
                                                </label>
                                                {imgPreview && imgPreview.length > 0 && (
                                                    <div
                                                        onClick={() => setShowAttachmentModal(true)}
                                                        className="flex form-control flex-wrap gap-4 mt-3 px-2 py-2 justify-center border border-dashed border-lightHoverBgBtn dark:border-gray-600">
                                                        {imgPreview.map((preview, index) => (
                                                            <div key={index} className="flex justify-center items-center">
                                                                <img
                                                                    src={preview}
                                                                    className="w-20 h-20 object-cover border-[#ffffff]"
                                                                    alt={`Preview ${index + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        </div>

                                        <div className="lg:col-span-2 col-span-1">
                                            <div className="ltr:text-right rtl:text-left p-5">
                                                {showAddButton ? (
                                                    <button
                                                        onClick={onSubmit}
                                                        disabled={loading}
                                                        style={
                                                            loading
                                                                ? { opacity: "0.5", cursor: "not-allowed" }
                                                                : { opacity: "1" }
                                                        }
                                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                    >
                                                        {loading
                                                            ? ""
                                                            : isEditing
                                                                ? "Update"
                                                                : "Save & add more"}
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
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <hr />

                            {normalStocks && normalStocks.length > 0 ? (
                                <div className={`  px-4 sm:px-6 lg:px-8 py-6 ${isDark ? "bg-darkSecondary text-white" : "bg-white"} `}>
                                    <div className="dark:bg-black-500 bg-transparent shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Stock Inventory
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {normalStocks.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={`${import.meta.env.VITE_BASE_URL}/productBluePrint/${item?.defaultImage}`}
                                                            alt={item?.name}
                                                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white break-words">
                                                            {item?.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-200 line-clamp-2">
                                                            {item?.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                                            <div className="text-gray-700 dark:text-gray-200">
                                                                <span className="font-medium">Total:</span> {item?.totalStock}
                                                            </div>
                                                            <div className="text-gray-700 dark:text-gray-200">
                                                                <span className="font-medium">Online:</span> {item?.onlineStock}
                                                            </div>
                                                            <div className="text-gray-700 dark:text-gray-200">
                                                                <span className="font-medium">Offline:</span> {item?.offlineStock}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => onEditStock(item)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                                                        >
                                                            Edit Stock
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                                        <p className="text-gray-600 dark:text-gray-400">No stocks available</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateStock;
