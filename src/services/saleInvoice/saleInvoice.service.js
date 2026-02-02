import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/create/invoice`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const getAuditPurchaseInvoice = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/get/audit/purchaseInvoice/${clientId}/${id}`,
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


const auditItem = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/audit/item/purchaseInvoice`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const issueMail = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/issue/purchaseInvoice/mail`, data, {
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
            `${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/list/invoice?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/change/status/purchaseInvoice`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
}


const getUnpaidInvoices = async (currentLevel, levelId, supplier, supplierLedger) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/unpaid/purchaseInvoice?clientId=${clientId}&level=${currentLevel}&levelId=${levelId}&supplier=${supplier}&supplierLedger=${supplierLedger}`,
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


const getParticular = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/sale/si/get/${clientId}/${id}`,
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
    getAuditPurchaseInvoice,
    auditItem,

    issueMail,
    getList,
    changeStauts,
    getUnpaidInvoices,
    getParticular
}
