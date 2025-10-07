
import axios from "axios";


const submitFormData = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/l/create/ledger`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};




const getFormData = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/l/get/custom/data/ledger/${clientId}/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};







const getAll = async ( currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/l/all/ledger?clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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




const getList = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/l/list/ledger?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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

const getAllLedgerGroup = async (currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/all/ledgerGroup?clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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


const getAllParent = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/all/non/parent/ledgerGroup?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/create/ledgerGroup`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const activeInactive = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/activeInactive/ledgerGroup`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/update/ledgerGroup`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const getAllField = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/all/field/ledgerGroup?clientId=${clientId}&groupId=${id}`,
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

const createField = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");


    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/create/field`, { ...data, clientId: clientId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const deleteCustomField = async (groupId, fieldId) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/delete/field/${groupId}/${clientId}/${fieldId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const updateOrder = async (groupId, data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId"); try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/lg/update/order/field/${groupId}/${clientId}`, { fields: data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



















export default {
    submitFormData,
    getList,
    getFormData,
    getAll,



    create,
    getAllParent,
    activeInactive,
    update,
    getAllField,
    createField,
    deleteCustomField,
    updateOrder,
    getAllLedgerGroup,
}
