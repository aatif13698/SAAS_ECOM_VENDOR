
import axios from "axios";
import { authHeader } from "../auth-headers";


const getAllRole = async (keyWord) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/vendor/role/listRolesAndPermission?keyword=${keyWord}&clientId=${clientId}`,
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


const createRolesAndPermission = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/createRolesAndPermission`, {...data,clientId:clientId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

// for Updating roles and permission name only
const updateRolesAndPermissionName = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/updateRolesAndPermission`, {...data,clientId:clientId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

// for Delete roles and permission 
const deleteRolesAndPermissionName = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/softDeleteRolesAndPermission`, {roleId:id,clientId:clientId, softDelete : "0"}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


// get Particular roles and permisssion
const getParticularRolesAndPermissionList = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/rolesAndPermission/${data.clientId}/${data.roleId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}






//for getting list of roles and permission
const getRolesAndPermissionList = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clinetId = localStorage.getItem("saas_client_clientId");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/listRolesAndPermission?clientId=${clinetId}&keyword=${data.keyword}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}


// for Submitting  roles and permission list
const submitRolesAndPermission = async (data) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/vendor/role/updateRolesAndPermission`, {...data,clientId:clientId}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};




export default { 
    getAllRole,
    createRolesAndPermission,
    updateRolesAndPermissionName,
    deleteRolesAndPermissionName,
    getParticularRolesAndPermissionList,
    submitRolesAndPermission,
    getRolesAndPermissionList





 }
