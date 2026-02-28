import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pr/create/purchaseReturn`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const issueMail = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pi/issue/purchaseInvoice/mail`, data, {
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
            `${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pr/list/purchaseReturn?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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

const getAll = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pi/all/bySupplier/purchaseInvoice?clientId=${clientId}&id=${id}`,
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



const changeStauts = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pi/change/status/purchaseInvoice`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
}



const getParticular = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/pr/get/${clientId}/${id}`,
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




export default {
    create,
    issueMail,
    getList,
    getAll,
    changeStauts,
    getParticular
}
