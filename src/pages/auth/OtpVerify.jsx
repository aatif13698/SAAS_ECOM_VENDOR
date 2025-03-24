import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";


import IntroImage from "@/assets/images/verifyOtp.png";
const OtpVerify = () => {
  const [isDark] = useDarkMode();
  const param = useParams();
  console.log(param, "param")

  const location = useLocation();
  // ----taking email from login form
  const identifier = location?.state?.identifier;
  const style = {
    backgroundColor: "#f1f5f9",
  };
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          <div className="max-w-full pt-20 ltr:pl-20 rtl:pr-20 " style={style}>
            <div className="flex gap-3">
              <Link to="/">
                <img
                  src={isDark ? "" : ""}
                  alt=""
                  className="mb-10 w-[200px]"
                />
              </Link>
            </div>
          </div>
          <div
            className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]  text-center items-center"
            style={style}
          >
            <img
              src={IntroImage}
              alt=""
              className="h-full w-[300px] object-contain text-center justify-center items-center"
              style={{
                marginLeft: "8em",
                width: "25em",
                paddingBottom: "5em",
              }}
            />
          </div>
        </div>
        <div className="right-column relative  bg-white dark:bg-darkSecondary">
          <div className="inner-content h-full flex flex-col ">
            <div className="auth-box2 flex flex-col justify-center h-full">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? "" : ""}
                    alt=""
                    className="mx-auto w-10"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium mb-4">Verify OTP</h4>
              </div>
              <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-darkInput rounded py-3 mb-4 mt-10">
                {identifier}
              </div>
              <ForgotPass />
              <div className="md:max-w-[full] font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                <div className="flex justify-between">
                  <div>
                    <Link
                      to="/"
                      className="text-slate-900 dark:text-white font-medium hover:underline"
                    >
                      Home
                    </Link>
                  </div>
                  <div>
                    <Link
                      to="/"
                      className="text-slate-900 dark:text-white font-medium hover:underline"
                    >
                      Back To Login
                    </Link>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            <div className="auth-footer text-center">
              Powered By
              <a href="" target="_blank">
                <span className="text-blue-500"> SPK Technosoft &reg;</span>{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
