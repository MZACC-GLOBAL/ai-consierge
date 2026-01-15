import * as React from "react";

import { cn } from "./utils";

function Input({ isSearch, ...props }: any) {

  return (
    <input {...props} className={`${isSearch && 'pl-10 border border-[#A0D6D3]'} inputStyle h-11 p-2 w-full rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60`} />
  );
}

export { Input };
