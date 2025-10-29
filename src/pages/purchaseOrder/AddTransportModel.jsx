import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import useDarkmode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import supplierService from "@/services/supplier/supplier.service";

const DEFAULT_FORM = {
    supplierId: "",
    // E-Way Bill
    ewayBillNo: "",
    ewayBillDate: "",
    ewayBillValidUpto: "",
    ewayBillStatus: "",
    // LR Details
    lrDetails: {
        lrNo: "",
        lrDate: "",
        transporterId: "",
        vehicleNo: "",
        vehicleType: "",
        driverName: "",
        driverLicenseNo: "",
        driverPhone: "",
        freightCharges: 0,
        freightPaidBy: "",
        hamaliCharges: 0,
        doorDeliveryCharges: 0,
        otherCharges: 0,
        totalFreightAmount: 0,
        noOfPackages: 0,
        packageType: "",
        actualWeight: 0,
        chargedWeight: 0,
        weightUnit: "KG",
        fromPlace: "",
        toPlace: "",
        distanceKm: 0,
        privateMarks: "",
        remarks: "",
    },
    shippingMethod: "",
    incoterm: "",
    containerDetails: {
        containerNo: "",
        sealNo: "",
        containerType: "",
        grossWeight: 0,
        volumeCBM: 0,
    },
    airwayBillNo: "",
    courierName: "",
    courierTrackingNo: "",
    courierTrackingUrl: "",
    trackingUrl: "",
    documents: {
        lrCopy: "",
        ewayBillPdf: "",
        invoiceCopy: "",
        packingList: "",
        insuranceCopy: "",
        otherDocs: [],
    },
    isDefault: false,
    isActive: true,
};


const isValidFile = (file) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
};


function FileUpload({ label, onFileSelect, file, error }) {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;

        if (!isValidFile(f)) {
            toast.error("Only PDF and images allowed (max 5MB)");
            return;
        }

        setFileName(f.name);
        onFileSelect(f);

        const url = URL.createObjectURL(f);
        setPreview({ url, type: f.type, name: f.name });
    };

    const clear = () => {
        if (preview?.url) URL.revokeObjectURL(preview.url);
        setPreview(null);
        setFileName("");
        onFileSelect(null);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>

            {/* Upload Area */}
            {!preview ? (
                <label className="flex cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center w-full hover:border-primary transition-colors">
                        <p className="text-sm text-gray-600">Click to upload</p>
                        <p className="text-xs text-gray-500">(PDF, JPG, PNG – max 5MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleFile}
                    />
                </label>
            ) : (
                <div className="relative border rounded-md overflow-hidden bg-gray-50 dark:bg-darkInput">
                    <button
                        onClick={clear}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors z-10"
                    >
                        <Icon icon="heroicons-outline:x" className="w-4 h-4 text-red-600" />
                    </button>

                    {/* IMAGE PREVIEW */}
                    {preview.type.startsWith("image/") ? (
                        <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-48 object-contain bg-white"
                        />
                    ) : (
                        /* PDF PREVIEW – USING <embed> (Chrome-safe) */
                        <div className="h-64 bg-white dark:bg-gray-900 flex items-center justify-center">
                            <embed
                                src={`${preview.url}#toolbar=0&navpanes=0&scrollbar=0`}
                                type="application/pdf"
                                className="w-full h-full"
                                title={preview.name}
                            />
                        </div>
                    )}

                    <div className="p-2 text-xs text-gray-600 truncate bg-white dark:bg-gray-800 border-t">
                        {preview.name}
                    </div>
                </div>
            )}

            {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
    );
}

function MultiFileUpload({ files = [], onChange }) {
    const [previews, setPreviews] = useState([]);

    const handleFiles = (e) => {
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(isValidFile);

        if (validFiles.length < newFiles.length) {
            toast.error("Some files skipped (PDF/images only, max 5MB)");
        }

        const updated = [...files, ...validFiles];
        onChange(updated);
        updatePreviews(updated);
    };

    const removeFile = (index) => {
        if (previews[index]?.url) URL.revokeObjectURL(previews[index].url);
        const updated = files.filter((_, i) => i !== index);
        onChange(updated);
        updatePreviews(updated);
    };

    const updatePreviews = (fileList) => {
        previews.forEach((p) => p?.url && URL.revokeObjectURL(p.url));
        const newPreviews = fileList.map((f) => ({
            url: URL.createObjectURL(f),
            type: f.type,
            name: f.name,
        }));
        setPreviews(newPreviews);
    };

    useEffect(() => {
        return () => {
            previews.forEach((p) => p?.url && URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    return (
        <div className="space-y-3">
            <label className="flex cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center w-full hover:border-primary transition-colors">
                    <p className="text-sm text-gray-600">Drop files or click</p>
                    <p className="text-xs text-gray-500">(PDF, JPG, PNG – max 5MB each)</p>
                </div>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFiles}
                />
            </label>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previews.map((preview, i) => (
                        <div
                            key={i}
                            className="relative group border rounded-md overflow-hidden bg-gray-50 dark:bg-darkInput shadow-sm"
                        >
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                            >
                                <Icon icon="heroicons-outline:x" className="w-3 h-3 text-red-600" />
                            </button>

                            {preview.type.startsWith("image/") ? (
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-full h-32 object-cover"
                                />
                            ) : (
                                <div className="h-32 bg-white dark:bg-gray-900 flex items-center justify-center p-1">
                                    <embed
                                        src={`${preview.url}#toolbar=0&navpanes=0&scrollbar=0`}
                                        type="application/pdf"
                                        className="w-full h-full"
                                        title={preview.name}
                                    />
                                </div>
                            )}

                            <div className="p-1 text-xs truncate bg-white dark:bg-gray-800">
                                {preview.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Input({ label, name, value, onChange, type = "text", placeholder, required, error }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control py-2 w-full"
            />
            {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
    );
}

function Select({ label, name, value, onChange, options, required, error, placeholder = "-- select --" }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <select
                name={name}
                value={value ?? ""}
                onChange={onChange}
                className="form-control py-2 w-full"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
    );
}

function Collapsible({ title, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border rounded-md">
            <button
                type="button"
                className="w-full px-4 py-2 text-left font-medium bg-gray-100 hover:bg-gray-200 dark:bg-darkSecondary dark:hover:bg-darkInput flex justify-between transition-all duration-200 items-center"
                onClick={() => setOpen((o) => !o)}
            >
                {title}
                <Icon
                    icon={open ? "heroicons-outline:chevron-up" : "heroicons-outline:chevron-down"}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && <div className="p-4 border-t duration-300 ease-in-out">{children}</div>}
        </div>
    );
}

function AddTransportModel({ noFade, openModal3, setOpenModal3 }) {
    const [isDark] = useDarkmode();
    const [form, setForm] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [transporters, setTransporters] = useState([]);

    // Fetch suppliers & transporters
    const fetchLookups = useCallback(async () => {
        try {
            const [sup, trans] = await Promise.all([
                supplierService.getSuppliers(),
                supplierService.getTransporters(),
            ]);
            setSuppliers(sup.data || []);
            setTransporters(trans.data || []);
        } catch (e) {
            toast.error("Failed to load suppliers/transporters");
        }
    }, []);

    useEffect(() => {
        if (openModal3) fetchLookups();
    }, [openModal3, fetchLookups]);

    // Country/State/City
    const countryList = useMemo(() => Country.getAllCountries(), []);
    const stateList = useMemo(
        () => (form.countryISO ? State.getStatesOfCountry(form.countryISO) : []),
        [form.countryISO]
    );
    const cityList = useMemo(
        () =>
            form.countryISO && form.stateISO
                ? City.getCitiesOfState(form.countryISO, form.stateISO)
                : [],
        [form.countryISO, form.stateISO]
    );

    const handleCountryChange = (e) => {
        const iso = e.target.value;
        const c = countryList.find((c) => c.isoCode === iso);
        setForm((p) => ({
            ...p,
            countryISO: iso,
            countryName: c?.name || "",
            stateISO: "",
            cityName: "",
        }));
    };

    const handleStateChange = (e) => {
        const iso = e.target.value;
        const s = stateList.find((s) => s.isoCode === iso);
        setForm((p) => ({
            ...p,
            stateISO: iso,
            stateName: s?.name || "",
            cityName: "",
        }));
    };

    const handleCityChange = (e) => {
        setForm((p) => ({ ...p, cityName: e.target.value }));
    };

    // Generic change handler (supports nested paths: lrDetails.freightCharges)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setForm((prev) => {
            const keys = name.split(".");
            if (keys.length === 1) {
                return { ...prev, [name]: val };
            }

            let obj = { ...prev };
            let pointer = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                pointer[keys[i]] = { ...pointer[keys[i]] };
                pointer = pointer[keys[i]];
            }
            pointer[keys[keys.length - 1]] = val;
            return obj;
        });

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Validation
    const validate = () => {
        const err = {};

        if (!form.supplierId) err.supplierId = "Supplier is required";
        if (!form.lrDetails.transporterId) err["lrDetails.transporterId"] = "Transporter is required";

        if (form.lrDetails.driverPhone && !/^\d{10}$/.test(form.lrDetails.driverPhone)) {
            err["lrDetails.driverPhone"] = "Driver phone must be 10 digits";
        }

        const numericFields = [
            "lrDetails.freightCharges",
            "lrDetails.hamaliCharges",
            "lrDetails.doorDeliveryCharges",
            "lrDetails.otherCharges",
            "lrDetails.totalFreightAmount",
            "lrDetails.noOfPackages",
            "lrDetails.actualWeight",
            "lrDetails.chargedWeight",
            "lrDetails.distanceKm",
            "containerDetails.grossWeight",
            "containerDetails.volumeCBM",
        ];

        numericFields.forEach((path) => {
            const val = getNested(form, path);
            if (val !== undefined && (isNaN(val) || Number(val) < 0)) {
                err[path] = "Must be ≥ 0";
            }
        });

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const getNested = (obj, path) => {
        return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
    };

    // Submit
    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        const formData = new FormData();

        // JSON data (exclude files)
        const { documents, ...rest } = form;
        formData.append("data", JSON.stringify(rest));

        // Single files
        ["lrCopy", "ewayBillPdf", "invoiceCopy", "packingList", "insuranceCopy"].forEach((key) => {
            const file = documents[key];
            if (file instanceof File) formData.append(key, file);
        });

        // Multiple files
        documents.otherDocs.forEach((file, i) => {
            if (file instanceof File) formData.append("otherDocs", file);
        });

        try {
            const res = await fetch("/api/purchase-invoice/transport", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            toast.success("Transport saved!");
            handleCancel();
        } catch (e) {
            toast.error(e.message || "Save failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setForm(DEFAULT_FORM);
        setErrors({});
        setOpenModal3(false);
    };

    return (
        <Transition appear show={openModal3} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter={noFade ? "" : "duration-300 ease-out"}
                    enterFrom={noFade ? "" : "opacity-0"}
                    enterTo={noFade ? "" : "opacity-100"}
                    leave={noFade ? "" : "duration-200 ease-in"}
                    leaveFrom={noFade ? "" : "opacity-100"}
                    leaveTo={noFade ? "" : "opacity-0"}
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
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
                                className={`w-full max-w-5xl rounded-lg shadow-xl p-0 ${isDark ? "bg-darkSecondary text-white" : "bg-white"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-darkSecondary px-5 py-3">
                                    <h2 className="text-xl font-semibold">Add Transport</h2>
                                    <button onClick={handleCancel} className="text-2xl hover:text-red-600">
                                        <Icon icon="heroicons-outline:x" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Supplier */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Select
                                            label="Supplier"
                                            name="supplierId"
                                            value={form.supplierId}
                                            onChange={handleChange}
                                            required
                                            error={errors.supplierId}
                                            options={suppliers.map((s) => ({ value: s._id, label: s.name }))}
                                        />
                                    </div>
                                    {/* Shipping & Incoterm */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Select
                                            label="Shipping Method"
                                            name="shippingMethod"
                                            value={form.shippingMethod}
                                            onChange={handleChange}
                                            options={[
                                                "road",
                                                "rail",
                                                "air",
                                                "sea",
                                                "courier",
                                                "pipeline",
                                                "multimodal",
                                                "self",
                                            ].map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))}
                                        />
                                        <Select
                                            label="Incoterm"
                                            name="incoterm"
                                            value={form.incoterm}
                                            onChange={handleChange}
                                            options={[
                                                "EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP",
                                                "FAS", "FOB", "CFR", "CIF",
                                            ].map((v) => ({ value: v, label: v }))}
                                        />
                                    </div>

                                    <Input label="External Tracking URL" name="trackingUrl" value={form.trackingUrl} onChange={handleChange} />


                                    {/* E-Way Bill */}
                                    <Collapsible title="E-Way Bill (optional)">
                                        <div className="grid sm:grid-cols-3 gap-3">
                                            <Input label="E-Way Bill No" name="ewayBillNo" value={form.ewayBillNo} onChange={handleChange} />
                                            <Input label="Bill Date" name="ewayBillDate" type="date" value={form.ewayBillDate} onChange={handleChange} />
                                            <Input label="Valid Upto" name="ewayBillValidUpto" type="date" value={form.ewayBillValidUpto} onChange={handleChange} />
                                            <Select
                                                label="Status"
                                                name="ewayBillStatus"
                                                value={form.ewayBillStatus}
                                                onChange={handleChange}
                                                options={[
                                                    { value: "generated", label: "Generated" },
                                                    { value: "cancelled", label: "Cancelled" },
                                                    { value: "expired", label: "Expired" },
                                                    { value: "active", label: "Active" },
                                                ]}
                                            />
                                        </div>
                                    </Collapsible>

                                    {/* LR Details */}
                                    <Collapsible title="Lorry Receipt (LR) Details">
                                        <div className="space-y-4">
                                            <div className="grid sm:grid-cols-3 gap-3">
                                                <Input label="LR No" name="lrDetails.lrNo" value={form.lrDetails.lrNo} onChange={handleChange} />
                                                <Input label="LR Date" name="lrDetails.lrDate" type="date" value={form.lrDetails.lrDate} onChange={handleChange} />
                                                <Select
                                                    label="Transporter"
                                                    name="lrDetails.transporterId"
                                                    value={form.lrDetails.transporterId}
                                                    onChange={handleChange}
                                                    required
                                                    error={errors["lrDetails.transporterId"]}
                                                    options={transporters.map((t) => ({ value: t._id, label: t.name }))}
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-3 gap-3">
                                                <Input label="Vehicle No" name="lrDetails.vehicleNo" value={form.lrDetails.vehicleNo} onChange={handleChange} />
                                                <Select
                                                    label="Vehicle Type"
                                                    name="lrDetails.vehicleType"
                                                    value={form.lrDetails.vehicleType}
                                                    onChange={handleChange}
                                                    options={[
                                                        "truck",
                                                        "trailer",
                                                        "container",
                                                        "tempo",
                                                        "pickup",
                                                        "lcv",
                                                        "hcv",
                                                        "other",
                                                    ].map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))}
                                                />
                                                <Input label="Driver Name" name="lrDetails.driverName" value={form.lrDetails.driverName} onChange={handleChange} />
                                                <Input label="Driver License" name="lrDetails.driverLicenseNo" value={form.lrDetails.driverLicenseNo} onChange={handleChange} />
                                                <Input
                                                    label="Driver Phone"
                                                    name="lrDetails.driverPhone"
                                                    value={form.lrDetails.driverPhone}
                                                    onChange={handleChange}
                                                    error={errors["lrDetails.driverPhone"]}
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-4 gap-3">
                                                <Input label="Freight" name="lrDetails.freightCharges" type="number" value={form.lrDetails.freightCharges} onChange={handleChange} />
                                                <Select
                                                    label="Paid By"
                                                    name="lrDetails.freightPaidBy"
                                                    value={form.lrDetails.freightPaidBy}
                                                    onChange={handleChange}
                                                    options={[
                                                        { value: "consignor", label: "Consignor" },
                                                        { value: "consignee", label: "Consignee" },
                                                        { value: "transporter", label: "Transporter" },
                                                    ]}
                                                />
                                                <Input label="Hamali" name="lrDetails.hamaliCharges" type="number" value={form.lrDetails.hamaliCharges} onChange={handleChange} />
                                                <Input label="Door Delivery" name="lrDetails.doorDeliveryCharges" type="number" value={form.lrDetails.doorDeliveryCharges} onChange={handleChange} />
                                                <Input label="Other" name="lrDetails.otherCharges" type="number" value={form.lrDetails.otherCharges} onChange={handleChange} />
                                                <Input label="Total Freight" name="lrDetails.totalFreightAmount" type="number" value={form.lrDetails.totalFreightAmount} onChange={handleChange} />
                                            </div>

                                            <div className="grid sm:grid-cols-4 gap-3">
                                                <Input label="# Packages" name="lrDetails.noOfPackages" type="number" value={form.lrDetails.noOfPackages} onChange={handleChange} />
                                                <Input label="Package Type" name="lrDetails.packageType" value={form.lrDetails.packageType} onChange={handleChange} />
                                                <Input label="Actual Wt" name="lrDetails.actualWeight" type="number" value={form.lrDetails.actualWeight} onChange={handleChange} />
                                                <Input label="Charged Wt" name="lrDetails.chargedWeight" type="number" value={form.lrDetails.chargedWeight} onChange={handleChange} />
                                            </div>

                                            <div className="grid sm:grid-cols-3 gap-3">
                                                <Input label="From" name="lrDetails.fromPlace" value={form.lrDetails.fromPlace} onChange={handleChange} />
                                                <Input label="To" name="lrDetails.toPlace" value={form.lrDetails.toPlace} onChange={handleChange} />
                                                <Input label="Distance (KM)" name="lrDetails.distanceKm" type="number" value={form.lrDetails.distanceKm} onChange={handleChange} />
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <Input label="Private Marks" name="lrDetails.privateMarks" value={form.lrDetails.privateMarks} onChange={handleChange} />
                                                <Input label="Remarks" name="lrDetails.remarks" value={form.lrDetails.remarks} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </Collapsible>



                                    {/* Container */}
                                    <Collapsible title="Container Details (optional)">
                                        <div className="grid sm:grid-cols-3 gap-3">
                                            <Input label="Container No" name="containerDetails.containerNo" value={form.containerDetails.containerNo} onChange={handleChange} />
                                            <Input label="Seal No" name="containerDetails.sealNo" value={form.containerDetails.sealNo} onChange={handleChange} />
                                            <Input label="Type" name="containerDetails.containerType" value={form.containerDetails.containerType} onChange={handleChange} />
                                            <Input label="Gross Wt" name="containerDetails.grossWeight" type="number" value={form.containerDetails.grossWeight} onChange={handleChange} />
                                            <Input label="Volume CBM" name="containerDetails.volumeCBM" type="number" value={form.containerDetails.volumeCBM} onChange={handleChange} />
                                        </div>
                                    </Collapsible>

                                    {/* Air / Courier */}
                                    <Collapsible title="Air / Courier (optional)">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <Input label="Airway Bill No" name="airwayBillNo" value={form.airwayBillNo} onChange={handleChange} />
                                            <Input label="Courier Name" name="courierName" value={form.courierName} onChange={handleChange} />
                                            <Input label="Tracking No" name="courierTrackingNo" value={form.courierTrackingNo} onChange={handleChange} />
                                            <Input label="Tracking URL" name="courierTrackingUrl" value={form.courierTrackingUrl} onChange={handleChange} />
                                        </div>
                                    </Collapsible>


                                    {/* Documents */}
                                    {/* <Collapsible title="Documents (optional)">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <Input label="LR Copy URL" name="documents.lrCopy" value={form.documents.lrCopy} onChange={handleChange} />
                                            <Input label="E-Way PDF" name="documents.ewayBillPdf" value={form.documents.ewayBillPdf} onChange={handleChange} />
                                            <Input label="Invoice Copy" name="documents.invoiceCopy" value={form.documents.invoiceCopy} onChange={handleChange} />
                                            <Input label="Packing List" name="documents.packingList" value={form.documents.packingList} onChange={handleChange} />
                                            <Input label="Insurance Copy" name="documents.insuranceCopy" value={form.documents.insuranceCopy} onChange={handleChange} />
                                        </div>
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium">Other Docs (JSON)</label>
                                            <textarea
                                                className="form-control w-full"
                                                rows={3}
                                                placeholder='[{"name":"doc1","url":"https://..."}]'
                                                onChange={(e) => {
                                                    try {
                                                        const parsed = JSON.parse(e.target.value);
                                                        setForm((p) => ({
                                                            ...p,
                                                            documents: { ...p.documents, otherDocs: parsed },
                                                        }));
                                                    } catch { }
                                                }}
                                            />
                                        </div>
                                    </Collapsible> */}

                                    <Collapsible title="Documents (optional)">
                                        <div className="space-y-4">
                                            {/* Individual File Uploads */}
                                            {[
                                                { label: "LR Copy", name: "lrCopy" },
                                                { label: "E-Way Bill PDF", name: "ewayBillPdf" },
                                                { label: "Invoice Copy", name: "invoiceCopy" },
                                                { label: "Packing List", name: "packingList" },
                                                { label: "Insurance Copy", name: "insuranceCopy" },
                                            ].map((doc) => (
                                                <FileUpload
                                                    key={doc.name}
                                                    label={doc.label}
                                                    onFileSelect={(file) => {
                                                        setForm((p) => ({
                                                            ...p,
                                                            documents: { ...p.documents, [doc.name]: file },
                                                        }));
                                                        setErrors((p) => ({ ...p, [`documents.${doc.name}`]: "" }));
                                                    }}
                                                    file={form.documents[doc.name]}
                                                    error={errors[`documents.${doc.name}`]}
                                                />
                                            ))}

                                            {/* Other Documents - Multiple */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Other Documents (PDF / Images)</label>
                                                <MultiFileUpload
                                                    files={form.documents.otherDocs}
                                                    onChange={(files) => {
                                                        setForm((p) => ({
                                                            ...p,
                                                            documents: { ...p.documents, otherDocs: files },
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Collapsible>

                                    {/* Meta */}
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="rounded" />
                                            <span>Default</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="rounded" />
                                            <span>Active</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end space-x-3 border-t border-slate-200 dark:border-darkSecondary px-5 py-3">
                                    <Button text="Cancel"
                                        className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                                        onClick={handleCancel} />
                                    <Button
                                        text="Save"
                                        className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded `} onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default React.memo(AddTransportModel);