
import axios from "axios";

const getList = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/requestShift/list/requestShift?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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

const action = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/requestShift/action/requestShift`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const activeInactive = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/requestShift/activeInactive/requestShift`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};



export default {
    getList,
    action,
    activeInactive,
}
