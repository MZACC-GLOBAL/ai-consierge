import { BarChart3, Code, CreditCard, Hotel, LogOut, MessagesSquare, Settings, Shield, Sparkles, Target, TrendingUp, X, XIcon } from 'lucide-react';
import  { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from './Avatar';
import { useRouter } from 'next/navigation';
import {  signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useAuth } from './AuthListener';




const Msidebar = ({mobileSideBarRef,toggler}:any) => {
  const [page, setPage] = useState('');
  const {userState} = useAuth();
  const userName = userState?.fullName?.split(' ').map((n:any) => n[0]).join('').toUpperCase().slice(0, 2) || 'John Doe';
  const redirect = useRouter();
  
  
  const redirectUser = (page: string) => {
    setPage(page);
    redirect.push(`./${page}`);
    toggler();
  };
  const logOut = async() =>{
    
    await signOut(auth).then(()=>{
      alert('logged out')
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    })
    .catch(err=>alert(err))
  }
  
  useEffect(() => {
    const current:any = window.location.pathname.split("/").pop();
    setPage(current);
  }, []);
 


  return (
    <aside ref={mobileSideBarRef} className="displayNone bg-[#004E7C] w-full h-full  border-r border-[#003D5F] flex flex-col shadow-lg absolute z-40">
        {/* header */}
        <div className="p-6 border-b border-[#003D5F]">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                  <img src="/logo.jpg"/>
                </div>
                <div>
                    <h1 className="text-white">AI Concierge</h1>
                    <p className="text-xs text-[#A0D6D3]">Hospitality Platform</p>
                </div>
                <button onClick={toggler}>
                  <X size={30} className=" text-red-500 cursor-pointer"/>
                </button>
            </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

            <button onClick={() => redirectUser('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'analytics'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <BarChart3 className="w-5 h-5" />
              <span className='text-sm'>Analytics</span>
              {page === 'analytics' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>

            <button onClick={() => redirectUser('chat-management')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'chat-management'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <MessagesSquare className="w-5 h-5" />
              <span className='text-sm'>Chat Management</span>
              {page === 'chat-management' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>

            <button onClick={() => redirectUser('upsell-campaigns')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'upsell-campaigns'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <Target className="w-5 h-5" />
              <span className='text-sm'>Upsell Campaigns</span>
              {page === 'upsell-campaigns' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>

            <button onClick={() => redirectUser('conversion-tracking')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'conversion-tracking'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <TrendingUp className="w-5 h-5" />
              <span className='text-sm'>Conversion Tracking</span>
              {page === 'conversion-tracking' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>

            <button onClick={() => redirectUser('chat-widget')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'chat-widget'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <Code className="w-5 h-5" />
              <span className='text-sm'>Chat Widget</span>
              {page === 'chat-widget' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>
            <button onClick={() => redirectUser('billing')} className={`w-full  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'billing'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <CreditCard className="w-5 h-5" />
              <span className='text-sm'>Billing</span>
              {page === 'billing' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>
            <button onClick={() => redirectUser('admin-panel')} className={`w-full ${!userState?.isAdmin && 'hidden'} flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'admin-panel'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <Shield className="w-5 h-5" />
              <span className='text-sm'>Admin Panel</span>
              {page === 'admin-panel' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>
            <button onClick={() => redirectUser('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ page === 'settings'? 'bg-[#F5B700] text-[#004E7C] shadow-md': 'text-[#A0D6D3] hover:bg-[#0067A3]'}`}>
              <Settings className="w-5 h-5" />
              <span className='text-sm'>Settings</span>
              {page === 'settings' && <Sparkles className="w-4 h-4 ml-auto" />}
            </button>
          
    
        </nav>

        <div className="p-4 border-t border-[#003D5F]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0067A3] mb-3">
                <Avatar className="h-10 w-10 border-2 border-[#F5B700] shadow-sm">
                    <AvatarFallback className="bg-[#F5B700] text-[#004E7C]">
                      {userName}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm truncate text-white">{userName}</p>
                    <p className="text-xs text-[#A0D6D3]">{userState?.plan || 'No'} Plan</p>
                </div>
            </div>
            <button onClick={logOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[#A0D6D3] hover:bg-[#0067A3] hover:text-red-400">
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
            </button>
        </div>
        
    </aside>
  )
}

export default Msidebar