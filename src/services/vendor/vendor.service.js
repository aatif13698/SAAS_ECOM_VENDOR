


import axios from "axios";
import { authHeader } from "../auth-headers";


const getAllVendors = async (page, keyWord, perPage) => {
    const headers = authHeader();
    const authToken = await localStorage.getItem("saas_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/superAdmin/vendor/listVendor?keyword=${keyWord}&perPage=${perPage}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in processing coupon:", error);
        throw error;
    }
};




const createVendor = async (data) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/vendor/createVendor`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};





const getParticularVendor = async (id) => {
    const headers = authHeader();
    const authToken = await localStorage.getItem("saas_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/superAdmin/vendor/vendor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in getting vendor data:", error);
        throw error;
    }
};




const activeInactiveVendor = async (data) => {

    const authToken = await localStorage.getItem("saas_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/vendortInActive`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};



const deleteVendor = async (data) => {

    const authToken = await localStorage.getItem("saas_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/deletevendorendor`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};




export default { getAllVendors, createVendor, getParticularVendor, deleteVendor, activeInactiveVendor }

