
import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/leavecategory/create/leave/category`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/leavecategory/update/leave/category`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};






const getList = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/leavecategory/list/leave/category?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in getting role list:", error);
        throw error;
    }
};



const activeInactive = async (data) => {

    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/leavecategory/activeInactive/leave/category`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};
































export default {
    create,
    update,

    getList,
    activeInactive,


}
