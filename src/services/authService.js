import axios from "axios";
import { authHeader } from "./auth-headers";

const Login = async (data) => {

  return await axios
    .post(`${import.meta.env.VITE_BASE_URL}/api/vendor/auth/signIn`, data)
    .then((response) => {
      return response;
    });
};

const LoginStaff = async (data) => {

  return await axios
    .post(`${import.meta.env.VITE_BASE_URL}/api/vendor/staff/auth/signIn`, data)
    .then((response) => {
      return response;
    });
};


//forgot password
const forgotPassword = async (data) => {

  return await axios
    .post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/forgetpassword`, data)
    .then((response) => {
      return response;
    });
};

// reset password

const resetPassword = async (data) => {

  return await axios
    .post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/resetpassword`, data)
    .then((response) => {
      return response;
    });
};

const OtpSignIn = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/vendor/auth/signInByOtp`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // Show a warning toast with the error message
      return Promise.reject(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      // Show a warning toast indicating a network issue
      return Promise.reject("Network error. Please try again.");
    } else {
      // Something happened in setting up the request that triggered an Error
      // Show a warning toast with a generic error message
      return Promise.reject("An error occurred. Please try again later.");
    }
  }
};

const staffOtpSignIn = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/vendor/staff/auth/signInByOtp`,
      data
    );
    return response;
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // Show a warning toast with the error message
      return Promise.reject(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      // Show a warning toast indicating a network issue
      return Promise.reject("Network error. Please try again.");
    } else {
      // Something happened in setting up the request that triggered an Error
      // Show a warning toast with a generic error message
      return Promise.reject("An error occurred. Please try again later.");
    }
  }
};


const getProfile = async (id) => {
  const a = authHeader();
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/superAdmin/getSuperAdminProfile/${id}`,
    {
      headers: authHeader(),
    }
  );
};


// const getOrganiserProfile = async (id) => {
//   const a = authHeader();
//   return await axios.get(
//     `${import.meta.env.VITE_BASE_URL}/api/organiser/getProfile/${id}`,
//     {
//       headers: authHeader(),
//     }
//   );
// };


const updateProfile = async (data) => {
  console.log("data", data);

  const authToken = localStorage.getItem("saas_client_token");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/superAdmin/superAdminProfile`,
      data, // Pass the data as the second parameter
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      }
    );


    return response.data; // Assuming you want to return the response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Re-throw the error to be handled by the calling code
  }
};



const punch = async (type, data) => {
  console.log("data", data);
  const authToken = localStorage.getItem("saas_client_token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/attendance/punch-${type}/attendance`,
      data, // Pass the data as the second parameter
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      }
    );


    return response.data; // Assuming you want to return the response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Re-throw the error to be handled by the calling code
  }
};




const check = async (id) => {
  const authToken = localStorage.getItem("saas_client_token");
  const clinetId = localStorage.getItem("saas_client_clientId");
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/vendor/hr/attendance/can-punch-in/attendance/${clinetId}/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    }

  });
  return response.data

}



const getAttendanceData = async (id, start, end) => {
  const authToken = localStorage.getItem("saas_client_token");
  const clinetId = localStorage.getItem("saas_client_clientId");
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/vendor/hr/attendance/get/attendance/${clinetId}/${id}?startDate=${start}&&endDate=${end}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
  );
};




// const logout = () => {
//   localStorage.removeItem("_stl");
//   <Navigate to="/login" />;
// };

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  Login, LoginStaff, OtpSignIn, staffOtpSignIn, getProfile, updateProfile, forgotPassword, resetPassword, punch,
  check, getAttendanceData
};
