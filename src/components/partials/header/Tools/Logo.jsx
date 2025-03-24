import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";


const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          <img
            src={isDark ? "" : ""}
            alt=""
            className="w-12"
          />
        ) : (
          <img
            src={isDark ? "" : ""}
            alt=""
            className="w-12"
          />
        )}
      </Link>
    </div>
  );
};

export default Logo;
