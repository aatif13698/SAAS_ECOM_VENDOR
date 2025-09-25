
import axios from "axios";



const getList = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/list/document/requirement?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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


const getAllParent = async (page, keyWord, perPage, currentLevel, levelId) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/all/non/parent/document/requirement?keyword=${keyWord}&perPage=${perPage}&page=${page}&clientId=${clientId}&level=${currentLevel}&levelId=${levelId}`,
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
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/create/document/requirement`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const activeInactive = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/activeInactive/document/requirement`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/update/document/requirement`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};



const getAllField = async (id) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/all/field/document/requirement?clientId=${clientId}&documentRequirementId=${id}`,
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

const createField = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");


    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/create/field`, { ...data, clientId: clientId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const deleteCustomField = async (groupId, fieldId) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/delete/field/${groupId}/${clientId}/${fieldId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const updateOrder = async (groupId, data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId"); try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/doc/update/order/field/${groupId}/${clientId}`, { fields: data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}




























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
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/employee/employee/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

}




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
    getList,
    create,
    getAllParent,
    activeInactive,
    update,
    getAllField,
    createField,
    deleteCustomField,
    updateOrder,




    getActiveBusinessUnit,
    updatewarehouse,
    deleteOne,
    getOne,
    getBranchByBusiness,
    getWarehouseByBranch,
    getActiveRoles
}
