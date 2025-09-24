import React, { useEffect } from "react";
import Icon from "@/components/ui/Icon";

import useDarkMode from "@/hooks/useDarkMode";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";



const SwitchDark = () => {
  const [isDark, setDarkMode] = useDarkMode();

  return (
    <span>
      <div
        className="lg:h-[32px] lg:w-[32px] dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
        onClick={() => setDarkMode(!isDark)}
      >
        {isDark ? (
          // <Icon icon="heroicons-outline:sun" />
          <MdLightMode/>
        ) : (
          // <Icon icon="heroicons-outline:moon" />
          <MdDarkMode/>
        )}   
      </div>
    </span>
  );
};

export default SwitchDark;
