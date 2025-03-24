import axios from "axios";


// for creating business unit
const createBusinessUnit = async (data) => {
    const authToken = await localStorage.getItem("token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/bu/createBusinessUnit`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


// for updating business unit

const updateBusinessUnit = async (data,userId) => {
    const authToken = await localStorage.getItem("token");

    return await axios.put(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/bu/updateBusinessUnit/${userId}`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


// for getting all business unit list
const getAllBusinessUnitList = async ({ page, keyword, perPage }) => {
    const authToken = localStorage.getItem("token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/bu/listBusinessUnit?keyword=${keyword}&&page=${page}&&perPage=${perPage}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

// for deleting the business unit
const deleteBusinessUnit = async ({id, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/bu/softDeleteBusinessUnit/`, { id,page, keyword: keyWord, perPage } ,{
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });

}


// for active and inActive business unit
const activeInActiveBusinessUnit = async ({id, status ,page, keyword: keyWord, perPage}) => {
    const authToken = await localStorage.getItem("token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/bu/activeInactiveBusinessUnit/`, {id, status ,page, keyword: keyWord, perPage}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};





export default {
    createBusinessUnit,
    getAllBusinessUnitList,
    deleteBusinessUnit,
    activeInActiveBusinessUnit,
    updateBusinessUnit

}