import { useState, useCallback } from "react";

const validationRules = {
    name: (value) => (!value ? "Category name is required" : ""),
    slug: (value) => (!value ? "Slug is required" : ""),
    phone: (value) => {
        if (!value) return "Phone number is required";
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) return "Phone number should be 10 digits";
        return "";
    },
    description: (value) => (!value ? "Description is required" : ""),
};

const useFormHandler = () => {
    const [formData, setFormData] = useState({});
    const [formDataErr, setFormDataErr] = useState({});

    const validateField = useCallback((name, value) => {
        if (validationRules[name]) {
            const errorMessage = validationRules[name](value);
            setFormDataErr((prev) => ({
                ...prev,
                [name]: errorMessage,
            }));
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        // Update field value
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate field
        validateField(name, value);
    }, [validateField]);

    return { formData, formDataErr, handleChange };
};

export default useFormHandler;
