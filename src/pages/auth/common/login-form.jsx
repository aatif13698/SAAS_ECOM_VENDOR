import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import authLogin from "../../../services/authService";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const schema = yup
  .object({
    // email: yup.string().email("Invalid email").required("Email is Required"),
    // password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  const dispatch = useDispatch();
  const [isViewed, setIsViewed] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isPasswordVissible, setIsPasswordVissile] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true)
  const [formData, setFormData] = useState({
    identifier: "", password: ""
  })
  const { identifier, password } = formData
  const [formDataErr, setFormDataErr] = useState({
    identifier: "", password: ""
  })



  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsViewed(false);
    setLoading(true)
    // validationFunction();
    if (!identifier || !password) {
      toast.warn("Please Fill All The Details");
      setLoading(false)

      return;
    }
    try {
      const data = formData

      const response = await authLogin.Login(data);
      console.log("response", response);

      if (response.status == 200) {
        // const string = email[0] + "A" + email[1];
        // navigate(`/otp/${email}`);
        navigate("/otp", { state: { identifier } });
        toast.success(response.data.message);
        setLoading(false)

      }
      // dispatch(setUser(data));
    } catch (error) {
      // Handle known axios error structure
      console.log("error.response 0", error);

      setLoading(false)
      if (error.response) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        // Network error or no response received
        toast.error("No response from server. Please check your network connection.");
      } else {
        // Generic error handling for unexpected cases
        toast.error("An unexpected error occurred. Please try again later.");
      }

      console.error("Error assigning group to admin:", error);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4 ">

      <label
        className={`fromGroup   ${formDataErr?.identifier !== "" ? "has-error" : ""
          } `}
      >
        <p className="form-label">
          Email or Phone No. <span className="text-red-500">*</span>
        </p>
        <input
          name="identifier"
          type="text"
          placeholder="Enter Your Email or phone No."
          value={identifier}
          onChange={handleChange}
          className="form-control py-2"
          readOnly={isViewed}
        />
        {
          <p className="text-sm text-red-500">
            {formDataErr.email}
          </p>
        }
      </label>
      <div>
        <label
          className={`fromGroup   ${formDataErr.password !== "" ? "has-error" : ""
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
              readOnly={isViewed}
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
            <p className="text-sm text-red-500">{formDataErr.password}</p>
          }
        </label>
      </div>
      {/* <Textinput
        name="password"
        label="password"
        type="password"
        // defaultValue="dashcode"
        placeholder="Enter password..."
        register={register}
        error={errors.password}
        className="h-[48px]"
      /> */}
      <div className="flex justify-end">
        {/* <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        /> */}
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      {/* <Button
        type="submit"
        text="Sign in"
        // className="btn btn-dark block w-full text-center "
        className="bg-orange-400 text-white block w-full text-center rounded-lg "
        isLoading={isLoading}
      /> */}
      <div className="lg:col-span-2 col-span-1">
        <div className="ltr:text-right rtl:text-left">
          {showAddButton ? (
            <button
              disabled={loading}
              style={
                loading
                  ? { opacity: "0.5", cursor: "not-allowed", borderColor: "#04DDC1" }
                  : { opacity: "1" }
              }
              // style={{background:"#04DDC1"}}
              className={` p-3  bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  inline-flex justify-center w-full text-center rounded-lg`}
            >
              {loading ? "" : "Login"}
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
          ) : (
            ""
          )}


          <button
            onClick={() => navigate("/staff/signIn")}
            className={` p-3 mt-4  bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  inline-flex justify-center  text-center rounded-lg`}
          >Staff Login</button>

        </div>
      </div>
    </form>
  );
};

export default LoginForm;
