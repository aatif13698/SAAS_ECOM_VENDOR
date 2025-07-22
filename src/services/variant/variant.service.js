import axios from "axios";




const create = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/variant/createVariant`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const update = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/variant/updateVariant`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getAllList = async ({ page, keyword, perPage }) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/variant/listVariant?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}




const getVariantByProductId = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/variant/productVariantByProduct/${clientId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}





export default {
    create,
    getAllList,
    update,
    getVariantByProductId
}