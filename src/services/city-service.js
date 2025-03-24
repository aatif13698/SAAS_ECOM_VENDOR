import axios from "axios";
import { authHeader } from "./auth-headers";

const getCityList = async (code) => {
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/getCities/${code}`
  );
};

export default { getCityList };
