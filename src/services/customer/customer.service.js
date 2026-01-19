
import axios from "axios";
import { authHeader } from "../auth-headers";


const getActiveBusinessUnit = async (page, keyWord, perPage) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/business/getActiveBusinessUnit?clientId=${clientId}`,
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
            `${import.meta.env.VITE_BASE_URL}/api/vendor/customer/listCustomer?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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


const getAll = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/customer/get/all/Customer?clientId=${clientId}`,
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


const getAllActive = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/customer/get/all/active/Customer?clientId=${clientId}`,
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
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/customer/createCustomer`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/customer/updateCustomer`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const updatewarehouse = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/warehouse/updateWarehouse`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const deleteOne = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/employee/softDeleteEmployee`, { ...data, clientId: clientId, softDelete: "0" }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getOne = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/customer/customer/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

}


const getCustomerAddress = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/customer/vendor/getAddresses/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}



const addAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/customer/vendor/addNewAddress`, { ...data, clientId: clinetId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const updateAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/customer/vendor/updateAddress`, { ...data, clientId: clinetId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const deleteAddress = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/customer/vendor/deleteAddress`, { ...data, clientId: clinetId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};


const activeInactive = async (data) => {

    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/customer/activeInactiveCustomer`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};



const getBranchByBusiness = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/branch/branchByBusinessUnit/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

}



const getWarehouseByBranch = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/warehouse/warehouseByBranch/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

}




const getActiveRoles = async () => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/getRolesList?clientId=${clinetId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}








export default {
    create,
    update,
    getList,
    activeInactive,
    getOne,
    getAll,
    getCustomerAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllActive,


    updatewarehouse,
    deleteOne,
    getBranchByBusiness,
    getWarehouseByBranch,
    getActiveRoles,
    getActiveBusinessUnit,

}
