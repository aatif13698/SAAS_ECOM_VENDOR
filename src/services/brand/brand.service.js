import axios from "axios";







const create = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/brand/createBrand`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const update = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/brand/updateBrand`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


// for getting all business unit list
const getAllList = async ({ page, keyword, perPage }) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/brand/listBrand?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

const deleteOne = async ({ id, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/brand/softDeleteBrand/`, { clientId, brandId: id, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });

}

const activeInActive = async ({ id, status, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/brand/activeInactiveBrand/`, { clientId, id, status, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};







export default {
    create,
    getAllList,
    deleteOne,
    activeInActive,
    update,
}