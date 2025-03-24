import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import authLogin from "../../../services/authService";
import { json, useNavigate, useParams } from "react-router-dom";
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

const ForgotPasswordForm = () => {
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
    identifier: ""
  })
  const { identifier } = formData
  const [formDataErr, setFormDataErr] = useState({
    identifier: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name == "identifier") {
      if (value == "") {

        setFormDataErr((prev) => ({
          ...prev,
          identifier: "Emai or Phone No. is Required",
        }))
      } else {
        setFormDataErr((prev) => ({
          ...prev,
          identifier: "",
        }))
      }
    }
   
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function validationFunction() {
    if (!identifier) {
      setFormDataErr((prev) => ({
        ...prev,
        identifier: "Emai or Phone No. is Required",
      }))
    } else {
      setFormDataErr((prev) => ({
        ...prev,
        identifier: "",
      }))
    }

  }
  

  const onSubmit = async (e) => {
    e.preventDefault()
    validationFunction()
    if (!identifier) {
      toast.warn("Please Enter a Valid Email or Phone")
      return

    } 
    try {

      const data = formData
      
      const response = await authService.forgotPassword(data)
      console.log("response",response);
      
     
      toast.success(response?.data?.message)
      if(response){
        navigate("/reset-password",{state:{identifier}})
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };

  const isNumber = () => {
    const inputValue = e.target.value;
    // Filter out non-numeric characters using regular expression
    const numericValue = inputValue.replace(/\D/g, "");

  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>



        <div>
          <label
            className={`fromGroup   ${formDataErr?.identifier !== "" ? "has-error" : ""
              } `}
          >
            <p className="form-label">
              Email Or Phone <span className="text-red-500">*</span>
            </p>
            <div className="relative">
              <input
                type='identifier'
                name="identifier"
                value={identifier}
                onChange={handleChange}
                placeholder="Enter Your Email or Phone"
                className="form-control py-2"
                // readOnly={isViewed}
                // onInput={isNumber}
              />

            </div>

            {
              <p className="text-sm text-red-500">{formDataErr?.identifier}</p>
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
      <button  className="  bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 p-3 block w-full text-center rounded-lg ">
        Forgot Password
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
