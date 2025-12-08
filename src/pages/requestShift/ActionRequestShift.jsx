import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss"
import { useSelector } from "react-redux";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import { IoClose } from "react-icons/io5";
import requestShiftService from "@/services/requestShift/requestShift.service";
import { formatDate } from "@fullcalendar/core";






const ActionRequestShift = ({ noFade, scrollContent }) => {
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [levelList, setLevelList] = useState([
        {
            name: "Business",
            value: "business"
        },
        {
            name: "Branch",
            value: "branch"
        },
        {
            name: "Warehouse",
            value: "warehouse"
        },
    ])

    const [isDark] = useDarkMode();
    const location = useLocation();
    const row = location?.state?.row;
    const name = location?.state?.name;
    const id = location?.state?.id;
    const [pageLoading, setPageLoading] = useState(true);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [levelResult, setLevelResult] = useState(0)
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [shifts, setShifts] = useState([]);

    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        chosenShift: "",
        reason: "",
        description: "",

    });

    console.log("formData", formData);


    useEffect(() => {
        if (currentUser && isAuthenticated) {
            let level = "";
            let levelId = "";
            if (currentUser.isVendorLevel) {
                setLevelList([
                    // {
                    //     name: "Vendor",
                    //     value: "vendor"
                    // },
                    {
                        name: "Business",
                        value: "business"
                    },
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    {
                        name: "Business",
                        value: "business"
                    },
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, level: "business" }));
                level = "business";
                levelId = currentUser.businessUnit;
            } else if (currentUser.isBranchLevel) {
                setLevelList([
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, level: "branch" }));
                level = "branch";
                levelId = currentUser.branch;
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse, level: "warehouse" }));
                level = "warehouse";
                levelId = currentUser.warehouse;
            }

            getDepartmentAndShift(level, levelId)

        }

    }, [currentUser])

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        chosenShift: "",
        reason: "",
        description: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        chosenShift,
        reason,
        description,
    } = formData;

    const [isAction, setIsAction] = useState(false);
    const [loading, setLoading] = useState(false);

    const [actionForm, setActionForm] = useState({
        status: 'pending',
        joinDate: '',
        remark: '',
        newShift: '',
    });

    console.log("actionForm", actionForm);

    const handleActionChange = (e) => {
        const { name, value } = e.target;
        setActionForm(prev => ({ ...prev, [name]: value }));
        if (name === 'status' && value !== 'approved') {
            setActionForm(prev => ({ ...prev, joinDate: '' }));
        }
    };

    const handleSubmit = async () => {
        if (actionForm.status === 'approved' && !actionForm.joinDate) {
            toast.error('New join date is required for approval.');
            return;
        }
         if (actionForm.status === 'approved' && !actionForm.newShift) {
            toast.error('New shift is required.');
            return;
        }
        if ((actionForm.status === 'approved' || actionForm.status === 'rejected') && !actionForm.remark) {
            toast.error('Remark is required.');
            return;
        }

        setLoading(true);
        try {
            const clientId = localStorage.getItem("saas_client_clientId");

            const dataObject = {
                clientId: clientId,
                shiftChangeId: id,
                status: actionForm.status,
                actionRemark: actionForm.remark,
                newJoinDate: actionForm.joinDate,
                newShift: actionForm.newShift
            }
            // TODO: Replace with actual service call, e.g.,
            await requestShiftService.action(dataObject);
            console.log('Submitting action:', actionForm);
            toast.success('Action taken successfully.');
            setIsAction(false);
            // setActionForm({ status: 'pending', joinDate: '', remark: '' });
        } catch (error) {
            console.error('Error submitting action:', error);
            toast.error('Failed to take action.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (level) {
            console.log("level", level);

            if (level === "vendor") {
                setLevelResult(1);
            } else if (level === "business") {
                setLevelResult(2)
            } else if (level === "branch") {
                setLevelResult(3)
            } else if (level === "warehouse") {
                setLevelResult(4)
            }
        } else {
            setLevelResult(0)
        }
    }, [level])


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
            setActiveWarehouse(response.data)
        } catch (error) {
            console.log("error while getting warehouse by branch");
        }
    }


    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            async function setData() {
                try {
                    setPageLoading(true)
                    const baseAddress = location?.state?.row;
                    console.log("baseAddress", baseAddress);
                    let level = "";
                    if (baseAddress.isBuLevel) {
                        level = "business"
                    } else if (baseAddress.isVendorLevel) {
                        level = "vendor"
                    } else if (baseAddress.isWarehouseLevel) {
                        level = "warehouse"
                    } else if (baseAddress.isBranchLevel) {
                        level = "branch"
                    }
                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit?._id,
                        branch: baseAddress.branch?._id,
                        warehouse: baseAddress.warehouse?._id,
                        chosenShift: baseAddress?.chosenShift?._id,
                        reason: baseAddress?.reason,
                        description: baseAddress?.description,
                    }));

                    if (baseAddress?.status !== "pending") {
                        setIsAction(true)
                    }

                    setActionForm((prev) => ({
                        joinDate: baseAddress?.status == "approved" ?  formatDate(baseAddress?.newJoinDate) : "",
                        newShift: baseAddress?.status == "approved" ?  baseAddress?.newShift : "",
                        status: baseAddress?.status,
                        remark: baseAddress?.actionRemark
                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in setting shift data", error);
                }
            }
            setData()
        } else {
            setPageLoading(false)
        }
    }, [id]);


    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                console.log("respone active", response);
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }
        getActiveBusinessUnit()
    }, []);

    async function getDepartmentAndShift(currentLevel, levelId) {
        try {
            const [shifts] = await Promise.all([
                employeeService.getShiftOfLevel(currentLevel, levelId)
            ]);
            setShifts(shifts?.data?.shifts);
        } catch (error) {
            console.log("error while getting the department and shift", error);
        }
    }

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

                                <div className="bg-gray-100 p-2 rounded-md w-fit mb-4">
                                    <h3 className="text-base">Requested By: {`${row?.createdBy?.firstName + " "+ row?.createdBy?.lastName} - ${row?.createdBy?.email}`} </h3>
                                </div> 

                                <div >
                                    <div className="grid grid-cols-1 md:grid-cols-3  gap-5 ">

                                        {/* select level */}
                                        <div
                                            className={`fromGroup   ${formDataErr?.level !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor="level" className="form-label ">
                                                <p className="form-label">
                                                    Level <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="level"
                                                value={level}
                                                disabled={true}

                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {levelList &&
                                                    levelList?.map((item) => (
                                                        <option value={item.value} key={item?.value}>
                                                            {item && item?.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.level}</p>}
                                        </div>


                                        {
                                            (levelResult == 0 || levelResult == 1) ? "" :

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
                                                        disabled={true}
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
                                        }


                                        {
                                            (levelResult == 0 || levelResult == 1 || levelResult == 2) ? "" :

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
                                                        disabled={true}
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

                                        }

                                        {
                                            (levelResult == 0 || levelResult == 1 || levelResult == 2 || levelResult == 3) ? "" :
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
                                                        disabled={true}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeWarehouse &&
                                                            activeWarehouse?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
                                                </div>
                                        }

                                        <div
                                            className={`fromGroup   ${formDataErr?.chosenShift !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                   Chosen Shift <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="chosenShift"
                                                value={chosenShift}
                                                disabled={true}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {shifts &&
                                                    shifts?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item?.shiftName}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.chosenShift}</p>}
                                        </div>

                                        <label
                                            className={`fromGroup   ${formDataErr?.reason !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Reason <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="reason"
                                                type="text"
                                                placeholder="Enter reason name"
                                                value={reason}
                                                className="form-control py-2"
                                                disabled={true}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.reason}
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
                                            <input
                                                name="description"
                                                type="text"
                                                placeholder="Enter description"
                                                value={description}
                                                className="form-control py-2"
                                                disabled={true}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.description}
                                                </p>
                                            }
                                        </label>
                                    </div>

                                    <div className="lg:col-span-2 col-span-1">
                                        {
                                            isAction ? "" :
                                                <div className="flex justify-end py-5 ">
                                                    <button
                                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                        onClick={() => setIsAction(!isAction)}
                                                        isLoading={loading}
                                                    >
                                                        Action
                                                    </button>
                                                </div>
                                        }


                                        {isAction && (
                                            <div className="mt-4 p-4 relative border rounded-md bg-gray-50 dark:bg-gray-700">

                                                <button
                                                    onClick={() => setIsAction(false)}
                                                    className="absolute z-[999999] right-4"><IoClose /></button>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                    {/* Status Radio Buttons */}
                                                    <div className="md:col-span-3 fromGroup">
                                                        <label className="form-label">
                                                            Status <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="flex gap-6 mt-2">
                                                            <label className="flex items-center cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="pending"
                                                                    checked={actionForm.status === 'pending'}
                                                                    onChange={handleActionChange}
                                                                    className="mr-2"
                                                                />
                                                                <span>Pending</span>
                                                            </label>
                                                            <label className="flex items-center cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="approved"
                                                                    checked={actionForm.status === 'approved'}
                                                                    onChange={handleActionChange}
                                                                    className="mr-2"
                                                                />
                                                                <span>Approved</span>
                                                            </label>
                                                            <label className="flex items-center cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="rejected"
                                                                    checked={actionForm.status === 'rejected'}
                                                                    onChange={handleActionChange}
                                                                    className="mr-2"
                                                                />
                                                                <span>Rejected</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* New Join Date - Conditional */}
                                                    {actionForm.status === 'approved' && (
                                                        <>
                                                            <div className="fromGroup">
                                                                <label htmlFor="joinDate" className="form-label">
                                                                    New Join Date <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="joinDate"
                                                                    name="joinDate"
                                                                    value={actionForm.joinDate}
                                                                    onChange={handleActionChange}
                                                                    className="form-control py-2"
                                                                />
                                                            </div>
                                                            <div
                                                                className={`fromGroup `}
                                                            >
                                                                <label htmlFor=" hh" className="form-label ">
                                                                    <p className="form-label">
                                                                      Assign Shift <span className="text-red-500">*</span>
                                                                    </p>
                                                                </label>
                                                                <select
                                                                    name="newShift"
                                                                    onChange={handleActionChange}
                                                                    value={actionForm?.newShift}
                                                                    className="form-control py-2  appearance-none relative flex-1"
                                                                >
                                                                    <option value="">None</option>

                                                                    {shifts &&
                                                                        shifts?.map((item) => (
                                                                            <option value={item?._id} key={item?._id}>{item?.shiftName}</option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </>

                                                    )}

                                                    {/* Remark - Conditional */}
                                                    {(actionForm.status === 'approved' || actionForm.status === 'rejected') && (
                                                        <div className="md:col-span-3 fromGroup">
                                                            <label htmlFor="remark" className="form-label">
                                                                Remark <span className="text-red-500">*</span>
                                                            </label>
                                                            <textarea
                                                                id="remark"
                                                                name="remark"
                                                                value={actionForm.remark}
                                                                onChange={handleActionChange}
                                                                placeholder="Enter remark"
                                                                className="form-control py-2"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-end py-5">
                                                    {
                                                        row?.status !== "pending" ? null :
                                                            <button
                                                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={handleSubmit}
                                                                disabled={loading}
                                                            >
                                                                {loading ? 'Submitting...' : 'Submit'}
                                                            </button>
                                                    }

                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default ActionRequestShift;