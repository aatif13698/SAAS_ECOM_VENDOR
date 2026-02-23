import axios from "axios";





const create = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/createStock`, data, {
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



const addItem = async (data) => {
    const authToken = await localStorage.getItem("saas_client_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/add/items`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};

const removeItem = async (data) => {
  const authToken = localStorage.getItem("saas_client_token");
  
  if (!authToken) {
    throw new Error("Authentication token not found");
  }

  return await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/api/vendor/supplier/remove/items`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data, // axios puts payload here for DELETE
    }
  );
};



// for getting all business unit list
const getAllList = async ( page, keyword, perPage, currentLevel, levelId ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}&&level=${currentLevel}&&levelId=${levelId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

const getStockList = async ( page, keyword, perPage, currentLevel, levelId, categoryFilter, subCategoryFilter ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock/all?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}&&level=${currentLevel}&&levelId=${levelId}&&categoryId=${categoryFilter}&&subCategoryId=${subCategoryFilter}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

const getStockListOfSupplier = async ( page, keyword, perPage, currentLevel, levelId, categoryFilter, subCategoryFilter, supplier ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock/all/of/supplier?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}&&level=${currentLevel}&&levelId=${levelId}&&categoryId=${categoryFilter}&&subCategoryId=${subCategoryFilter}&&supplierId=${supplier}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}


const getStockListOfSupplierByPurchaseId = async ( supplier , id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock/all/of/supplier/by/purchaseInv?supplierId=${supplier}&&purchaseInvId=${id}&&clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

const getStockListForCustomer = async ( page, keyword, perPage, currentLevel, levelId, categoryFilter, subCategoryFilter, supplier ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock/all/for/customer?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}&&level=${currentLevel}&&levelId=${levelId}&&categoryId=${categoryFilter}&&subCategoryId=${subCategoryFilter}&&supplierId=${supplier}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}

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

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/activeInactiveStock`, { clientId, id, status, page, keyword: keyWord, perPage }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};


const getAllStocks = async ( ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/listStock?clientId=${clientId}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}



const getStockByProduct = async (id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/stockbyproduct/${clientId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}



const getParticularStocks = async ( id) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/Stock/${clientId}/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}



const getProductListForCms = async ( page, keyword, perPage, currentLevel, levelId, categoryFilter, subCategoryFilter ) => {
    const authToken = localStorage.getItem("saas_client_token");
    const clientId = localStorage.getItem("saas_client_clientId");

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/stock/list/all/blueprints/for/cms?keyword=${keyword}&&page=${page}&&perPage=${perPage}&&clientId=${clientId}&&level=${currentLevel}&&levelId=${levelId}&&categoryId=${categoryFilter}&&subCategoryId=${subCategoryFilter}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}





export default {

    create,
    getAllList,
    deleteOne,
    activeInActive,
    update,
    getAllStocks,
    getParticularStocks,
    getStockList,
    getStockListOfSupplier,
    getStockListOfSupplierByPurchaseId,
    getStockListForCustomer,
    getStockByProduct,
    addItem,
    removeItem,
    getProductListForCms
}