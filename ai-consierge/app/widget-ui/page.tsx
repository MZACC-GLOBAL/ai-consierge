"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState,Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../_components/Card";
import { Globe2, AlertTriangle, User, Send, CheckCircle2, AlertCircle, MessageSquare, Badge, Clock } from "lucide-react";
import { Avatar } from "../_components/Avatar";
import { AvatarFallback } from "../_components/Avatar";
import { Button } from "../_components/Button";
import { Input } from "../_components/Input";
import { EscalationModal } from "../_components/EscalationModal";


function Message ({isCustomer,text,time,widgetSettings}:any){
    
    return(
        <div className={`flex ${isCustomer ? 'justify-end':'justify-start'}`}>
            <div className={`max-w-[70%] ${isCustomer ? 'order-1':'order-2'}`}>
                <div style={{backgroundColor:isCustomer?widgetSettings.widgetColor:'white'}} className={`p-4 rounded-2xl shadow-sm ${ isCustomer? 'text-white':' border border-gray-200'}`}>
                    <p className="text-sm">{text}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${isCustomer ? 'text-right':'text-left'}`}>
                    {time}
                </p>
            </div>
        </div>
    )
}


 function WidgetUIPage() {
  const [selectedChat, setSelectedChat] = useState('ai');
  const [showEscalation, setShowEscalation] = useState(false);
  const [isEscalation, setIsEscalation] = useState<any>(undefined);
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const email = searchParams.get("email");
  const checkIn = searchParams.get("checkInTime");
  const checkOut = searchParams.get("checkOutTime");
  const [message, setMessage] = useState("");
  const [width,setWidth] = useState(0)
  const [aiMessages,setAiMessages] = useState<any>([])
  const [hsMessages,setHsMessages] = useState<any>([])
  const [widgetSettings,setWidgetSettings] = useState({widgetColor:'#004E7C',welcomeMsg:''});
 
  
  async function getSettings(){
    await axios.get("/api/widget/widget-settings",{params:{siteId}})
    .then(data=>setWidgetSettings(data.data))
  }

  async function getEscalationStatus(){
    try {
        const usersdata = await axios.get("/api/widget/escalation",{params:{siteId}})
       
        if (usersdata.data.length>0) {
            const accUser = usersdata?.data?.find((user:any)=>user?.userId ===userId) 
            isEscalation === undefined && !accUser?.isEscalated && setIsEscalation(false);
            accUser?.isEscalated && setIsEscalation(accUser?.isEscalated);
        }
    } catch (error) {
        console.log('error fetching status',error);    
    }
  }

  async function escalateUser(){
    if (isEscalation === undefined) {
        
        alert('you cannot escalate without starting a conversation')
        return
    }
    const usersdata = await axios.post("/api/widget/escalation",{siteId,userId,email,userName})
    try {
       setIsEscalation(true)
        alert('escalated')
    } catch (error) {
        alert('error escalating'+error);
    }
  }

  useEffect(() => {
    
    getEscalationStatus()
    getSettings()
    getMessages()
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start logging every 10 seconds
          if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
              getMessages()

            }, 10000);
          }
        } else {
            
          // Stop logging when out of view
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
        
        
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  function formatTime(timestamp:any) {
    const date = new Date(timestamp); // convert milliseconds to Date
    const hours = date.getHours();    // get hours (0-23)
    const minutes = date.getMinutes(); // get minutes (0-59)

    // Add leading zero if needed
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    return `${hh}:${mm}`;
  }

  async function sendMessage(finalText: any) {
   
    if (!isEscalation) {
       alert('you are not allowed to do this') 
       return;
    }
    else if (!siteId) {
        alert("Message empty");
        return;
    }
    else if(!userId){
        alert('No user id');
        return
    }
    else if(!userName){
        alert('No user name provided')
        return
    }
    else if(!finalText.trim()){
        alert('empty message');
        return
    }
    let isAi = selectedChat ==='ai'?true:false
    
    try {

        const res = await axios.post("/api/widget/messages", {
        siteId,
        finalText,
        userId,
        userName,
        email,
        isAi
        }).then(()=>getMessages())
        setMessage("")
    } catch (error: any) {
        
        alert(error?.response?.data?.error || "Failed to send message");
    }
  }
 
  async function getMessages(){
    try {    
        const res = await axios.get("/api/widget/messages",{params:{siteId,userId}});
        const staffMessages= res.data.messages.filter((item:any)=>item.isAi ===false)
        const aiConsMessages= res.data.messages.filter((item:any)=>item.isAi ===true)
        setAiMessages(aiConsMessages);
        setHsMessages(staffMessages);
    } catch (error) {
        console.log('error getting messages',error);
    }
  }

  const sendAiMsg = async (finalText:any) =>{
    
    if (!siteId) {
        alert("Message empty");
        return;
    }
    else if(!userId){
        alert('No user id');
        return
    }
    else if(!userName){
        alert('No user name provided')
    }
    else if(!finalText.trim()){
        alert('empty message');
        return
    }

    try {
        const res = await axios.post("/api/widget/messages/ai", {prompt: finalText,siteId,userId,userName,email,checkIn,checkOut})
        .then(()=>getMessages())
        setMessage("")
    } catch (error) {
        console.log('error occured while generating response'+ error);
    }
   
  }
  

  return (
    
    <div ref={ref} className={`${width > 865? "flex":''}  hidde`} style={{}}>
        <div className={width > 865?"w-1/3":'w-full' }>
            <div className=" overflow-y-auto p-0">
              
                <button onClick={() => setSelectedChat('ai')} style={selectedChat==='ai'?{borderLeftColor:widgetSettings.widgetColor}:{}} className={`w-full p-4 border-b border-gray-200 hover:bg-[#004E7C]/5 transition-colors text-left ${selectedChat === 'ai' ? 'bg-[#004E7C]/10 border-l-4' : ''}`}>
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback style={{backgroundColor:widgetSettings.widgetColor}} className='text-white'>
                                {'AI Concierge'.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span style={{color:widgetSettings.widgetColor}} className=" truncate">AI Concierge(faster response)</span>
                            </div>   
                        </div>
                    </div>
                </button>
                <button onClick={() => setSelectedChat('hs')} style={selectedChat==='hs'?{borderLeftColor:widgetSettings.widgetColor}:{}} className={`w-full p-4 border-b border-gray-200 hover:bg-[#004E7C]/5 transition-colors text-left ${selectedChat === 'hs' ? `bg-[#004E7C]/10 border-l-4` : ''}`}>
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback style={{backgroundColor:widgetSettings.widgetColor}} className=" text-white">
                                {'Hotel Staff'.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span style={{color:widgetSettings.widgetColor}} className="truncate">Hotel Staff</span>
                            </div>   
                        </div>
                    </div>
                </button>
            </div>
        </div>

        
        <Card className={`border-0 ${width > 865?"w-2/3":'w-full'} h-screen shadow-lg flex-4 xl:col-span-6 flex flex-col bg-white`} >
            <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback style={{backgroundColor:widgetSettings.widgetColor}} className="text-white">
                            {selectedChat =='ai'?'AC':'HS' }
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle style={{color:widgetSettings.widgetColor}}>{selectedChat ==='ai'?'AI Concierge':'Hotel Staff'}</CardTitle>  
                        </div>
                    </div>
                    {selectedChat ==='ai' && <Button onClick={() => setShowEscalation(true)} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        <AlertTriangle className="w-4 h-4 mr-2" />Escalate
                    </Button>}
                </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]" >
                {aiMessages.length >0 && selectedChat==='ai'? aiMessages.map((message:any,index:number)=>{
                     
                     
                    return <Message key={index} widgetSettings={widgetSettings} isCustomer={message?.senderId === userId?true:false} text={message?.message} time={formatTime(message?.createdAt)}/>        
                }):<div style={{display:selectedChat==='hs'?'none':'block'}}>No messages</div>}

                {isEscalation?(hsMessages.length >0 && selectedChat==='hs'? hsMessages.map((message:any,index:number)=>{
                     
                     
                    return <Message key={index} widgetSettings={widgetSettings} isCustomer={message?.senderId === userId?true:false} text={message?.message} time={formatTime(message?.createdAt)}/>        
                }):<div style={{display:selectedChat==='ai'?'none':'block'}}>No messages</div>):<div style={{display:selectedChat==='ai'?'none':'block'}}><Button variant='outline' className="border-orange-600 text-orange-600 block mx-auto" onClick={escalateUser}>Escalate</Button></div>}

            </CardContent>
            
            <div className="p-4 border-t bg-white">
                <div className="flex gap-2 mb-2">
                    
                    <Input disabled={selectedChat==='hs'&& !isEscalation?true:false} placeholder={selectedChat==='hs'&& !isEscalation?'disabled':widgetSettings.welcomeMsg} className="flex-1" value={message} onChange={(e:any)=>setMessage(e.target.value)} />
                    <Button disabled={selectedChat==='hs'&& !isEscalation?true:false}   className="bg-[#A0D6D3] text-[#004E7C]" onClick={selectedChat=='hs'?()=>sendMessage(message):()=>sendAiMsg(message)}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                {selectedChat =='ai' && <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" /> AI Concierge is actively managing this conversation
                </p>}
            </div>
        <EscalationModal
            isOpen={showEscalation}
            onClose={() => {
                setShowEscalation(false)
            }}
            guestName={userName ||''}
            roomNumber={'null'}
            issue={'Human Staff required'}
            escalateUser={escalateUser}
            isEscalation={isEscalation}
        />
        </Card>

    </div>
  );
}

export default function WidgetUI(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <WidgetUIPage/>
        </Suspense>
    )
}