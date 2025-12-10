import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import authLogin from "../../../services/authService";
import { json, useLocation, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
import { setUser } from "@/store/api/auth/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setCapability } from "@/store/slices/auth/capabilitySclice";
import { setProfile } from "@/store/api/auth/peofileSlice";

const schema = yup
  .object({
    // otp: yup.string().required("OTP is Required"),
  })
  .required();

const StaffOtp = () => {
  const param = useParams();
  // const { email } = useParams()
  const [otp, setOtp] = useState("")
  const [otpErr, setOtpErr] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const location = useLocation();
  // ----taking email from login form
  const identifier = location?.state?.identifier;

  const store = useSelector((state) => state)
  console.log("store123", store);

  const hadleChange = (e) => {

    setOtp(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!otp) {
      setLoading(false)
      toast.error("Plese Enter Otp")
      return
    } else {
      try {
        const dataObject = { identifier: identifier, otp: otp, rememberMe: checked };
        const response = await authLogin.staffOtpSignIn(dataObject);
        localStorage.setItem("saas_client_token", response.data.token);
        localStorage.setItem("saas_client_adminInfo", JSON.stringify(response.data.adminInfo));
        localStorage.setItem("saas_client_expiryTime", response.data.expiryTime);
        localStorage.setItem("saas_client_clientId", response.data.clientId);

        const { _id, businessUnit, branch, warehouse, isVendorLevel, isBuLevel, isBranchLevel, isWarehouseLevel, workingDepartment, shift, firstName, lastName, email, phone, gender, city, state, country, ZipCode, address, profileImage, } = response.data?.adminInfo;

        const profileInfo = {
          _id, businessUnit, branch, warehouse, isVendorLevel, isBuLevel, isBranchLevel, isWarehouseLevel, workingDepartment, shift, firstName, lastName, email, phone, gender, city, state, country, ZipCode, address, profileImage
        }

        dispatch(setProfile(profileInfo));
        dispatch(setUser(response.data?.adminInfo));
        dispatch(setCapability(response.data?.adminInfo?.role?.capability));

        toast.success(response.data.message);
        navigate("/dashboard");
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if (error) {
          toast.error(error);
        } else if (error.response) {
          const errorMessage = error.response?.data?.message || "Something went wrong!";
          toast.error(`Error: ${errorMessage}`);
        }
        else if (error.request) {
          toast.error("No response from server. Please check your network connection.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className={`fromGroup   ${otpErr !== "" ? "has-error" : ""
            } `}
        >
          <p className="form-label">
            OTP <span className="text-red-500">*</span>
          </p>
          <div className="relative">
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={hadleChange}
              placeholder="Enter OTP"
              className="form-control py-2"
            />

          </div>

          {
            <p className="text-sm text-red-500">{otpErr}</p>
          }
        </label>
      </div>
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>
      <div className="lg:col-span-2 col-span-1">
        <div className="ltr:text-right rtl:text-left">

          <button
            type="submit"
            disabled={loading}
            style={
              loading
                ? { opacity: "0.5", cursor: "not-allowed", background: "#04DDC1" }
                : { opacity: "1" }
            }
            className={` p-3  bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  inline-flex justify-center w-full text-center rounded-lg`}
          >
            {loading ? "" : "Submit OTP"}
            {loading && (
              <>
                <svg
                  className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 unset-classname`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading ...
              </>
            )}
          </button>

        </div>
      </div>
    </form>
  );
};

export default StaffOtp;
