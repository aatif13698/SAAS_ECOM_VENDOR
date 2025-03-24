import axios from "axios";
import { authHeader } from "./auth-headers";


const checkCouponAlreadyExists = async (data) => {
  const headers = authHeader();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/admin/checkCouponCodeAlreadyExists`,
      data, 
      {
        headers: headers,
      }
    );


    return response.data; 
  } catch (error) {
    console.error("Error in processing coupon:", error);
    throw error; 
  }
};



const generateCouponOtp = async (data) => {
    const headers = authHeader();
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/generateCouponOtp`,
        data, 
        {
          headers: headers,
        }
      );
  
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  const createCoupon = async (data) => {
    const headers = authHeader();
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/createCoupon`,
        data, 
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  
  const getAllCoupons = async (page, keyWord, perPage) => {
    const headers = authHeader();
  
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/getCouponsList?keyword=${keyWord}&perPage=${perPage}&page=${page}`,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  
  const activeInactiveCoupon = async (id, status) => {
    const headers = await authHeader();

    console.log("headers",headers);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/activeCoupon/${id}`,
        {status},
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };

  
  const hardDeleteCoupon = async (id, status="null") => {
    const headers = await authHeader();

    console.log("headers",headers);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/hardDeleteCoupon/${id}`,
        {status},
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };



  
  
  const getParticularCoupon = async (id) => {
    const headers = authHeader();
  
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/getParticularCoupon/${id}`,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };



  // clone any event
  
  const cloneEvent = async (id) => {
    const headers = await authHeader();

    console.log("headers",headers);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/cloneEvent`,
        {id : id},
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };



  // upload event csv
  const uploadCsv = async (data) => {
    const headers = await authHeader();

    console.log("headers",headers);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/uploadEvents`,
        data,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };

  // delete multiple events
  const deleteMultipleEvents = async (data) => {
    const headers = await authHeader();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/deleteMultipelEvents`,
        data,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  const getSampleCsv = async (data) => {
    const headers = await authHeader();

    console.log("headers",headers);
  
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/downloadSampleCSV`,
        data,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };



  // get All request of organisers
  const getAllRequests = async (page, keyWord, perPage) => {
    const headers = authHeader();
  
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/getRequestedOrganiserList?keyword=${keyWord}&perPage=${perPage}&page=${page}`,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  // Approve request

  const approveRequest = async (data) => {
    const headers = await authHeader();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/approveRequest`,
        data,
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };



  // delete request
  const deleteRequest = async (id) => {
    const headers = await authHeader();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/deleteRequestedOrganiser/${id}`,
        {},
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };


  // denied request

  const deniedRequest = async (id) => {
    const headers = await authHeader();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/deniedRequest/${id}`,
        {},
        {
          headers: headers,
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error("Error in processing coupon:", error);
      throw error; 
    }
  };










export default {cloneEvent,uploadCsv,getSampleCsv, checkCouponAlreadyExists, generateCouponOtp, createCoupon, getAllCoupons, activeInactiveCoupon, getParticularCoupon, hardDeleteCoupon, deleteMultipleEvents, getAllRequests, approveRequest, deleteRequest, deniedRequest };
