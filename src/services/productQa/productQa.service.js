
import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/product/qa/create/productQa`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/product/qa/update/productQa`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const deleteOne = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/product/qa/delete/productQa/${id}`,
            {
                data: { clientId }, // Send clientId in body (if backend expects it)
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        // Improve error handling
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete Q&A";
        throw new Error(message);
    }
}




const getByProductMainStockId = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/product/qa/get/productQa/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

}



const getList = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/list/asset?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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
    update,
    deleteOne,
    getByProductMainStockId,



    getList,
}
