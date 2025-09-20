import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaExclamationCircle, FaGripVertical } from "react-icons/fa";
// import customFieldService from "../../services/customFieldService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ledgerGroupService from "@/services/ledgerGroup/ledgerGroup.service";
import useDarkmode from "@/hooks/useDarkMode";

// Reorder array utility
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.map((item, index) => ({
        ...item,
        gridConfig: { ...item.gridConfig, order: index + 1 },
    }));
};

function AdjustOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state;
    const [isDark] = useDarkmode();


    const [errors, setErrors] = useState([]);
    const [existingFields, setExistingFields] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true)

    // Fetch existing fields on mount
    useEffect(() => {
        const fetchFields = async () => {
            try {
                setIsDataLoading(true);
                const response = await ledgerGroupService.getAllField(data?.group?._id);

                setExistingFields(response?.data?.fields || []);
                setIsDataLoading(false);
            } catch (error) {
                setIsDataLoading(false);
                setErrors(["Failed to fetch existing fields"]);
                toast.error("Failed to load fields");
            }
        };
        fetchFields();
    }, [data]);

    // Render field preview
    const renderFieldPreview = useCallback((field) => {
        const baseStyles =
            "w-[100%] bg-transparent p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed";

        switch (field.type) {
            case "text":
            case "number":
            case "email":
            case "hyperlink":
                return (
                    <input
                        disabled
                        type={field?.type}
                        placeholder={field?.placeholder}
                        className={baseStyles}
                    />
                );
            case "textarea":
                return (
                    <textarea
                        disabled
                        placeholder={field?.placeholder}
                        className={`${baseStyles} min-h-[100px]`}
                    />
                );
            case "select":
            case "multiselect":
                return (
                    <select disabled className={baseStyles}>
                        <option value="">{field?.placeholder || "Select an option"}</option>
                        {field?.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case "checkbox":
                return (
                    <input
                        disabled
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400 disabled:cursor-not-allowed"
                    />
                );
            case "file":
                return (
                    <input
                        disabled
                        type="file"
                        accept={field?.validation?.fileTypes?.join(",")}
                        className={baseStyles}
                    />
                );
            case "date":
                return (
                    <input
                        disabled
                        type="date"
                        placeholder={field?.placeholder || "Select a date"}
                        className={baseStyles}
                    />
                );
            case "timepicker":
                return (
                    <input
                        disabled
                        type="time"
                        placeholder={field?.placeholder || "Select a time"}
                        className={baseStyles}
                    />
                );
            case "color":
                return (
                    <input
                        disabled
                        type="color"
                        className={`${baseStyles} h-10 cursor-not-allowed`}
                    />
                );
            default:
                return (
                    <div className={baseStyles}>
                        {field?.type} (Preview not available)
                    </div>
                );
        }
    }, []);

    // Handle drag end
    const onDragEnd = useCallback(
        (result) => {
            if (!result.destination) return; // Dropped outside the list

            const reorderedFields = reorder(
                existingFields,
                result.source.index,
                result.destination.index
            );
            setExistingFields(reorderedFields);
            toast.success("Field order updated locally. Click Save to confirm.");
        },
        [existingFields]
    );

    // Handle save order
    const handleSaveOrder = async () => {
        setIsSaving(true);
        try {
            const updatedFields = existingFields.map(({ _id, gridConfig }) => ({
                fieldId: _id,
                order: gridConfig.order,
            }));
            await ledgerGroupService.updateOrder(
                data?.group?._id,
                updatedFields
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Field order saved successfully!",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save field order",
            });
            // Optionally rollback: refetch fields
            //   const response = await customFieldService.getCustomForms(
            //     data?.organization?.userId,
            //     data?.session?._id
            //   );
            //   setExistingFields(response?.data?.data?.data || []);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col  mt-3 min-h-screen ">
            {
                isDataLoading ?
                    <>
                        <div className="w-[100%] h-60 flex justify-center items-center mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 ">
                            <svg
                                className={`animate-spin mr-2 h-10 w-10  text-black dark:text-white`}
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
                            <span>Loading</span>
                        </div>
                    </> :

                    <div
                        className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"}  shadow-lg  transition-transform duration-300 mb-3 p-6`}
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-formHeadingLight dark:text-formHeadingDark mb-2 sm:mb-0">
                                Adjust Order
                            </h3>
                        </div>
                        {existingFields.length > 0 ? (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="fields">
                                    {(provided) => (
                                        <div
                                            //  className="my-2"
                                            // className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {existingFields
                                                .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                                .map((field, index) => (
                                                    <Draggable
                                                        key={field._id}
                                                        draggableId={field._id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`relative my-2 p-2 bg-transparent rounded-md border border-gray-300 dark:border-gray-600  shadow-sm transition-all ${snapshot.isDragging
                                                                    ? "shadow-lg border-blue-500 dark:border-blue-400"
                                                                    : "hover:shadow-md"
                                                                    }`}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    order: field?.gridConfig?.order,
                                                                }}
                                                                aria-label={`Field ${field.label}, order ${field.gridConfig.order}`}
                                                            >
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="absolute left-2 top-2 text-gray-500 dark:text-gray-400 cursor-move"
                                                                    aria-label="Drag handle"
                                                                >
                                                                    <FaGripVertical />
                                                                </div>
                                                                <span className="absolute right-2 top-2 text-xs text-gray-600 dark:text-gray-400">
                                                                    Order: {field?.gridConfig?.order}
                                                                </span>
                                                                <label className="block text-xs sm:text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1 pl-6">
                                                                    {field?.label}
                                                                    {field?.isRequired && (
                                                                        <span className="text-red-500">*</span>
                                                                    )}
                                                                </label>
                                                                <div className="pl-6">{renderFieldPreview(field)}</div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        ) : (
                            <div className="flex flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                                <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                    No Fields Found
                                </p>
                            </div>
                        )}
                        <div className="flex flex-row items-center justify-between mt-4 gap-2">
                            <div>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 sm:px-4  sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    aria-label="Cancel and go back"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div>
                                {existingFields.length > 0 && (
                                    <button
                                        onClick={handleSaveOrder}
                                        disabled={isSaving}
                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                        aria-label="Save field order"
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg
                                                    className="animate-spin mr-2 h-4 sm:h-5 w-4 sm:w-5 text-white"
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
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Order"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}

export default AdjustOrder;