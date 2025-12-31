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






export default {
    upsert,
    getConfigure
}
