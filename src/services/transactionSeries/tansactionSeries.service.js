
import axios from "axios";



const getSeriesList = async (year = "2026-27") => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/settings/general/ts/get/all/${clientId}/${year}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in getting:", error);
        throw error;
    }
};


const getNextSerialNumber = async (year = "2026-27", type) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/settings/general/ts/get/series/next/value/${clientId}/${year}/${type}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in getting:", error);
        throw error;
    }
};




const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/settings/general/ts/update/serial`, {...data, clientId : clinetId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const createSeries = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/settings/general/ts/create/serial`, {...data, clientId : clinetId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};




export default {
    getSeriesList,
    getNextSerialNumber,
    update,
    createSeries
}
