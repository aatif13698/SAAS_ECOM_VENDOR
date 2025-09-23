import React from "react";
import useMonoChrome from "@/hooks/useMonoChrome";
import Icon from "@/components/ui/Icon";
import { IoColorPalette } from "react-icons/io5";

const MonoChrome = () => {
  const [isMonoChrome, setMonoChrome] = useMonoChrome();
  return (
    <span>
      <div
        className="lg:h-[32px] lg:w-[32px]  dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
        onClick={() => setMonoChrome(!isMonoChrome)}
      >
        {/* <Icon icon="mdi:palette-outline" /> */}
        <IoColorPalette/>
      </div>
    </span>
  );
};

export default MonoChrome;
