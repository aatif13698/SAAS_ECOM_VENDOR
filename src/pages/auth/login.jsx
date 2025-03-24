import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

import IntroImage from "@/assets/images/loginIlustration.png";
const login = () => {
  const [isDark] = useDarkMode();
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
                width: "28em",
                paddingBottom: "8em",
              }}
            />
          </div>
        </div>
        <div className="right-column relative bg-white dark:bg-darkSecondary">
          <div className="inner-content h-full flex flex-col  ">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? "" : ""}
                    alt=""
                    className="mx-auto w-12 bg-red-600"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Vendor Login</h4>
                <div className="text-slate-500 text-base">
                  Sign in to your account to start using SAAS ECOM
                </div>
              </div>
              <LoginForm />
            </div>
            <div className="auth-footer text-center">
              Powered By
              <a href="" target="_blank">
                <span className="text-blue-500"> Aestree Webnet Pvt.Ltd &reg;</span>{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
