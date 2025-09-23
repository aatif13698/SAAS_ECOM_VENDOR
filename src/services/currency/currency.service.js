
import axios from "axios";


const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/cu/create/currency`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getList = async (page, keyWord, perPage) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/cu/list/currency?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}`,
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



const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/cu/update/currency`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const activeInactive = async (data) => {

    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/cu/activeInactive/currency`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};





export default {
    create,
    getList,
    update,
    activeInactive
}
