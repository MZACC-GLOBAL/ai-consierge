'use client'

import { ArrowRight, MessageSquare, TrendingUp,Menu } from "lucide-react"
import { Progress } from "./ProgressBar";
import Msidebar from "./Msidebar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthListener";







const NavBar = () => {
  const[width,setWidth] = useState<number>(100);
  const router = useRouter()
  useEffect(() => {
      setWidth(window.innerWidth);
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
   }, []);
   const {userState} = useAuth()
   const usagePercentage = 82;
   const mobileSideBarRef = useRef<HTMLDivElement>(null);

   const toggleMobileSideBar = () => {
   
    mobileSideBarRef.current?.classList.toggle("displayNone");
  };
  
  return (
    <>
    <Msidebar toggler={toggleMobileSideBar} mobileSideBarRef={mobileSideBarRef} />
    <header  className=" bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4  ">
            <div className="flex items-center justify-between gap-6  ">
                <div className="flex items-center gap-4 flex-1">
                  <button  onClick={toggleMobileSideBar} className="lg:hidden">
                    <Menu className=" h-8 text-[#004E7C]" />
                  </button>
                  {width > 700 && 
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#004E7C]" />
                      <span className="text-sm text-gray-600">Message Usage</span>
                    </div>
                  }
                        
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#004E7C]">
                            {userState?.messageCount || 0} / {1500} messages
                        </span>
                        <span className="text-xs text-gray-500">{12} days left</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" indicatorClassName={  usagePercentage > 90 ? "bg-red-500"  : usagePercentage > 75  ? "bg-[#F5B700]" : "bg-[#A0D6D3]"}/>
                  </div>
                  {width > 700 && <>
                  {usagePercentage > 80 && (
                      
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#F5B700]/10 rounded-full">
                            <TrendingUp className="w-4 h-4 text-[#F5B700]" />
                            <span className="text-xs text-[#F5B700]">
                            {usagePercentage > 90 ? 'Running low' : 'High usage'}
                            </span>
                    </div>
                  )}
                  </>}
                </div>

                {usagePercentage > 75 && (
                    <button  className="flex justify-center items-center px-3 py-1  rounded-lg bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white text-sm" onClick={()=>router.push('/dashboard/billing')}> Upgrade Plan<ArrowRight className="w-4 h-4 ml-2" /></button>
                )}
            </div>
        </div>
    </header> 
    </>
    
  )
}

export default NavBar