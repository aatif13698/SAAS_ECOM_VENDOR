
import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/changeShift/create/changeShift`, data, {
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
            `${import.meta.env.VITE_BASE_URL}/api/vendor/changeShift/list/changeShift?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/changeShift/update/changeShift`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const activeInactive = async (data) => {

    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/changeShift/activeInactive/changeShift`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};






export default {
    create,
    getList,
    update,
    activeInactive,
}
