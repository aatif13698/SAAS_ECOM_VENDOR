import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";
import FormLoader from "@/Common/formLoader/FormLoader";
const Loading = () => {
  const [isDark] = useDarkMode();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className=" mt-1 font-medium  text-sm flex justify-center items-center flex-col py-5">
        {" "}
        {/* <img src="" alt="" className="w-20 py-5" /> */}
        <FormLoader />
        <p className="text-bold text-xl">Loading ...</p>
      </span>
    </div>
  );
};

export default Loading;
