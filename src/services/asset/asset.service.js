
import axios from "axios";

const create = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/create/asset`, data, {
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



const activeInactive = async (data) => {

    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/activeInactive/asset`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

const assignToEmployee = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/assign/asset`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const update = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/update/asset`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getOne = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/asset/get/${clinetId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data

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
    getList,
    update,
    activeInactive,
    assignToEmployee,

    getActiveBusinessUnit,
    updatewarehouse,
    deleteOne,
    getOne,
    getBranchByBusiness,
    getWarehouseByBranch,
    getActiveRoles
}
