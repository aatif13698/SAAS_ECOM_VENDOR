import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import authLogin from "../../../services/authService";
import { json, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "@/store/api/auth/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Button } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import authService from "@/services/authService";

const schema = yup
  .object({
    otp: yup.string().required("OTP is Required"),
  })
  .required();

const ResetPasswordForm = () => {
  const param = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isPasswordVissible, setIsPasswordVissile] = useState(false);
  const [isConfirmPasswordVissible, setConfirmIsPasswordVissile] =
    useState(false);
  const [formData, setFormData] = useState({
    otp: "", password: "", confirmPassword: ""
  })
  const location = useLocation()
  const identifier = location?.state?.identifier
  const { otp, password, confirmPassword } = formData
  const [formDataErr, setFormDataErr] = useState({
    otp: "", password: "", confirmPassword: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name == "otp") {
      if (value == "") {

        setFormDataErr((prev) => ({
          ...prev,
          otp: "OTP is Required",
        }))
      } else {
        setFormDataErr((prev) => ({
          ...prev,
          otp: "",
        }))
      }
    }
    if (name == "password") {
      if (value == "") {
        setFormDataErr((prev) => ({
          ...prev,
          password: "Password is Required",
        }))
      } else {
        setFormDataErr((prev) => ({
          ...prev,
          password: "",
        }))
      }
    }
    if (name == "confirmPassword") {
      if (value == "") {
        setFormDataErr((prev) => ({
          ...prev,
          confirmPassword: "Confirm Password is Required",
        }))
      }
      if (value !== password) {
        setFormDataErr((prev) => ({
          ...prev,
          confirmPassword: "Password & Confirm Password Must Matches",
        }))
      }
      else {
        setFormDataErr((prev) => ({
          ...prev,
          confirmPassword: "",
        }))
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  console.log("formData",formData);
  

  function validationFunction() {
    if (!otp) {
      setFormDataErr((prev) => ({
        ...prev,
        otp: "OTP is Required",
      }))
    } else {
      setFormDataErr((prev) => ({
        ...prev,
        otp: "",
      }))
    }
    if (!password) {
      setFormDataErr((prev) => ({
        ...prev,
        password: "Password is Required",
      }))
    } else {
      setFormDataErr((prev) => ({
        ...prev,
        password: "",
      }))
    }
    if (!confirmPassword) {
      setFormDataErr((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password is Required",
      }))
    }else if (password != confirmPassword) {
      setFormDataErr((prev) => ({
        ...prev,
        confirmPassword: "Password & Confirm Password Must Matches",
      }))
    } else {
      setFormDataErr((prev) => ({
        ...prev,
        confirmPassword: "",
      }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    validationFunction()
    if (!otp || !password || !confirmPassword) {
      toast.warn("Please Fill All Data")

      return

    } if (password != confirmPassword) {
      toast.warn("Password And Confirm Password Must Matches")
      return

    }
    try {

      const response = await authService.resetPassword({
        identifier: identifier,
        password: formData?.password,
        otp: formData?.otp
      })
      console.log("response",response);
    
      if (response) {
        toast.success(response?.data?.message)
        navigate("/signIn")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const isNumber = (e) => {
    const inputValue = e.target.value;
    // Filter out non-numeric characters using regular expression
    const numericValue = inputValue.replace(/\D/g, "");

  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <div >
          <label

          >
            <p className="form-label">
              Email <span className="text-red-500">*</span>
            </p>
            <div className="relative">
              <input
                type='email'
                name="email"
                value={identifier}
                // onChange={handleChange}
                placeholder="Enter Your Email"
                className="form-control py-2"
                readOnly
              />

            </div>


          </label>
        </div>
        <div>
          <label
            className={`fromGroup   ${formDataErr?.otp !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              OTP <span className="text-red-500">*</span>
            </p>
            <div className="relative">
              <input
                type='text'
                name="otp"
                value={otp}
                onChange={handleChange}
                placeholder="Enter Your OTP"
                className="form-control py-2"
                // readOnly={isViewed}
                onInput={isNumber}
              />

            </div>

            {
              <p className="text-sm text-red-500">{formDataErr?.otp}</p>
            }
          </label>
        </div>
        <div>
          <label
            className={`fromGroup   ${formDataErr?.password !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Password <span className="text-red-500">*</span>
            </p>
            <div className="relative">
              <input
                type={isPasswordVissible ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="form-control py-2"
              // readOnly={isViewed}
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
                onClick={(e) =>
                  setIsPasswordVissile((prev) => !prev)
                }
              >
                {isPasswordVissible ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {
              <p className="text-sm text-red-500">{formDataErr?.password}</p>
            }
          </label>
        </div>
        <div>
          <label
            className={`fromGroup   ${formDataErr?.confirmPassword !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Confirm Password{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="relative">
              <input
                type={
                  isConfirmPasswordVissible ? "text" : "password"
                }
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Enter Your Confirm Password"
                className="form-control py-2"
              // readOnly={isViewed}
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
                onClick={(e) =>
                  setConfirmIsPasswordVissile((prev) => !prev)
                }
              >
                {isConfirmPasswordVissible ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>

            {
              <p className="text-sm text-red-500">
                {formDataErr?.confirmPassword}
              </p>
            }
          </label>
        </div>
      </div>
      <div className="flex justify-between">
        {/* <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link> */}
      </div>
      <button className="bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 p-3 block w-full text-center rounded-lg ">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
