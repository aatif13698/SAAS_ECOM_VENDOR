import axios from "axios";




const getAllList = async (page, keyword, perPage, status, startDate, endDate) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/order/listOrder?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}`, {
    //     headers: {
    //         Authorization: `Bearer ${authToken}`,
    //     }

    // });


    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/order/listOrder`, {
        params: {
            clientId: clientId,
            page,
            perPage,
            keyword,
            status, // Comma-separated string (e.g., "PENDING,APPROVED")
            startDate,
            endDate,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    return response.data
}


const getOne = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/order/order/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
    return response.data
}



const updateStatus = async (orderId, selectedStatus) => {
    console.log("orderId", orderId);
    console.log("selectedStatus", selectedStatus);

    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/order/order/status/update`, { clientId, status: selectedStatus, orderId: orderId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};



const create = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/createStock`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const createOrder = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/order/createOrder`, { clientId : clientId, ...data}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const update = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/updateStock`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const deleteOne = async ({ id, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/softDeleteStock/`, { clientId, subCategoryId: id, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });

}

const activeInActive = async ({ id, status, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/activeInactiveStock/`, { clientId, id, status, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};



const getAllStock = async ( page, keyword, perPage ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/getAllStock?clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}








export default {

    create,
    createOrder,
    getAllList,
    deleteOne,
    activeInActive,
    update,
    getOne,
    updateStatus,


    getAllStock
}