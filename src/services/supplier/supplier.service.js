import axios from "axios";







const create = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/createSupplier`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const update = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/updateSupplier`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


// for getting all business unit list
const getAllList = async (page, keyword, perPage) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/listSupplier?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

const deleteOne = async (dataObject) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/softDeleteSupplier`, {...dataObject, clientId:clientId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });

}



const getOne = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/Supplier/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
    
}

const activeInActive = async ({ id, status, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/activeInactiveSupplier/`, { clientId, id, status, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};




const getAllActive = async () => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/get/active/supplier/${clinetId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
    
}

const getSupplierAddress = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/getAddresses/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}



const addAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/addNewAddress`, {...data, clientId : clinetId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const updateAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/updateAddress`, {...data, clientId : clinetId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const deleteAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/deleteAddress`, {...data, clientId : clinetId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};






const createTransporter = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/transporter/create/supplier/transport`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const updateTransporter = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/transporter/update/supplier/transport`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};




const getAllTransportersList = async (page, keyword, perPage) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/transporter/list/supplier/transport?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}




const activeInActiveTransport = async ({ id, status, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/transporter/activeInactive/transport`, { clientId, id, status, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};









export default {
    create,
    getAllList,
    getOne,
    deleteOne,
    activeInActive,
    update,
    getAllActive,
    getSupplierAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    createTransporter,
    updateTransporter,
    getAllTransportersList,
    activeInActiveTransport

}