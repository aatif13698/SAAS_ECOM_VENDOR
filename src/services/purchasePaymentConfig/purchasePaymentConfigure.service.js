import axios from "axios";

const upsert = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/settings/pur/upsert/purhcase/payement/ledger/config`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const getConfigure = async (currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/settings/pur/get/purhcase/payement/ledger/config?clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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


const getPaymentFromLedgers = async (currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/accounts/settings/pur/get/purhcase/payement/from/ledger/config?clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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


const createPaymentOut = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/payment/out/create/payment/out`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const createPaymentOutForSaleReturn = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/payment/out/create/payment/out/saleReturn`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const createPaymentOutForCreditNote = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/payment/out/create/payment/out/creditNote`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getPaymentOut = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/payment/out/list/payment/out?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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



const getParticularPaymentOut = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/payment/out/get/payment/out/${id}/${clientId}`,
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


const applyCreditToInv = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/purhcase/dn/apply/credit/to/invoice`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};







export default {
    upsert,
    getConfigure,
    getPaymentFromLedgers,
    createPaymentOut,
    createPaymentOutForSaleReturn,
    createPaymentOutForCreditNote,
    getPaymentOut,
    getParticularPaymentOut,
    applyCreditToInv
}
