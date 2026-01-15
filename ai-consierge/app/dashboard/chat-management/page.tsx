"use client"

import { useEffect, useState,useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Badge } from '../../_components/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../_components/Tabs';
import { Input } from '../../_components/Input';
import { MessageSquare,XCircle, Search, Clock, CheckCircle2, AlertCircle, Globe2, User, Send, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../_components/Avatar';
import { GuestCRMCard } from '../../_components/GuestCRMCard';
import { DropdownMenu,DropdownMenuContent,DropdownMenuTrigger,DropdownMenuItem } from '../../_components/DropDownMenu';
import { useAuth } from '@/app/_components/AuthListener';
import {collection,getDocs,query,orderBy,limit,addDoc,where,collectionGroup,doc,getDoc,updateDoc, increment} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const mockConversations = [
  {
    id: 1,
    name: 'Sophie Laurent',
    room: '204',
    language: 'French',
    languageFlag: '🇫🇷',
    status: 'active',
    lastMessage: 'Can I extend my checkout time?',
    time: '2 min ago',
    unread: 2,
    checkIn: 'Jun 8, 2024',
    checkOut: 'Jun 12, 2024',
    lastRequest: 'Late checkout extension request',
    satisfactionScore: 5,
    totalSpent: 165,
    isVIP: false,
    upsellHistory: [
      { item: 'Airport Transfer', amount: 35, date: 'Jun 8' },
      { item: 'Wine Tasting', amount: 85, date: 'Jun 9' },
      { item: 'City Tour', amount: 45, date: 'Jun 10' },
    ],
    notes: 'Celebrating anniversary. Prefers late breakfast.',
  },
  {
    id: 2,
    name: 'James Wilson',
    room: '305',
    language: 'English',
    languageFlag: '🇬🇧',
    status: 'resolved',
    lastMessage: 'Thank you for the restaurant recommendation!',
    time: '15 min ago',
    unread: 0,
    checkIn: 'Jun 7, 2024',
    checkOut: 'Jun 14, 2024',
    lastRequest: 'Restaurant recommendation for authentic Italian',
    satisfactionScore: 5,
    totalSpent: 245,
    isVIP: true,
    upsellHistory: [
      { item: 'Welcome Package', amount: 25, date: 'Jun 7' },
      { item: 'Spa Treatment', amount: 120, date: 'Jun 8' },
      { item: 'Private Tour', amount: 100, date: 'Jun 9' },
    ],
    notes: 'VIP guest. Regular visitor - 3rd stay this year. Vegetarian.',
  },
  {
    id: 3,
    name: 'Carlos Rodriguez',
    room: '102',
    language: 'Spanish',
    languageFlag: '🇪🇸',
    status: 'active',
    lastMessage: '¿Dónde está el desayuno?',
    time: '23 min ago',
    unread: 1,
    checkIn: 'Jun 10, 2024',
    checkOut: 'Jun 11, 2024',
    lastRequest: 'Breakfast location inquiry',
    satisfactionScore: 4,
    totalSpent: 0,
    isVIP: false,
    upsellHistory: [],
    notes: '',
  },
];

function Message ({isCustomer,text,time,isAi}:any){
  return(
    <div className={`flex ${isCustomer ? 'justify-end':'justify-start'}`}>
      <div className={`max-w-[70%] ${isCustomer ? 'order-1':'order-2'}`}>
        {isAi && <p className='text-xs text-gray-500 mb-1 flex items-center'>AI Enabled<CheckCircle2 className="w-3 h-3 ml-2 text-green-600" /></p>}
        <div style={{backgroundColor:isCustomer?'#004E7C':'white'}} className={`p-4 rounded-2xl shadow-sm ${ isCustomer? 'text-white':' border border-gray-200'}`}>
          <p className="text-sm">{text}</p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isCustomer ? 'text-right':'text-left'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}


export default function ChatManagement() {
  const [selectedChat, setSelectedChat] = useState({});
  const [crmSelected,setCrmSelected] = useState(mockConversations[0])
  const [searchQuery, setSearchQuery] = useState('');
  const [manualReply,setManualReply] = useState(false)
  //const [showEscalation, setShowEscalation] = useState(false);
  const {userState} = useAuth();
  const [text,setText] = useState("");
  const [messages,setMessages] = useState<any>([])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredConversations = userState?.users?.filter((conv:any) =>conv.userName.toLowerCase().includes(searchQuery.toLowerCase()));
  
  async function getMessages(userId:string) {
    if (!userState.id) {
      return
    } 
    try {
      const externalUsersRef = collection(db, "users", userState.id, "externalUsers",userId+userState.id,"messages");
      const senderQuery = query(
        externalUsersRef,
        where('senderId', '==', userId),
        orderBy('createdAt', 'desc') // Order by createdAt descending
      );
      const senderQuerySnapshot = await getDocs(senderQuery);
      const receiverQuery = query(
        externalUsersRef,
        where('receiverId', '==', userId),
        orderBy('createdAt', 'desc') // Order by createdAt descending
      );
      const receiverQuerySnapshot = await getDocs(receiverQuery);
      const allMessages: any[] = [];
      const messageIds = new Set<string>(); // To store unique document IDs and avoid duplicates
  
      senderQuerySnapshot.forEach((docSnap: any) => {
        if (!messageIds.has(docSnap.id)) {
         
          allMessages.push({ id: docSnap.id, ...docSnap.data() });
          messageIds.add(docSnap.id);
        }
      });
  
      receiverQuerySnapshot.forEach((docSnap:any) => {
        if (!messageIds.has(docSnap.id)) { // Check if this message has already been added
          allMessages.push({ id: docSnap.id, ...docSnap.data() });
          messageIds.add(docSnap.id);
        }
      });
      allMessages.sort((a, b) => {
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeA - timeB;
      });
      
      setMessages(allMessages);
      
    } catch (error) {
      console.log('error getting messages',error);
    }
  
  }

  async function sendMessage() {
    
    if (!userState.id) {
      return 
    }
    else if(!text.trim()){
      alert('empty message');
      return
    }
    try {
      
      const messagesRef = collection(
        db,
        "users",
        userState.id,
        "externalUsers",
        selectedChat?.userId +userState.id,
        "messages"
      );
  
      const date = new Date().getTime()
      const userRef = doc(db,'users',userState.id);
      await addDoc(messagesRef, {
        message:text,
        isAi:!manualReply,
        receiverId:selectedChat?.userId,
        senderId: userState.id,
        createdAt: date,
        customerName:'Concierge Ai'
      }).then(async()=>{
        await updateDoc(userRef,{messageCount:increment(1)})
      })
      setText("")
      getMessages(selectedChat?.userId)
    } catch (error) {
      alert('error occured while sending messages')
    }
  }
  
  function formatTime(timestamp:any) {
    const date = new Date(timestamp); // convert milliseconds to Date
    const hours = date.getHours();    // get hours (0-23)
    const minutes = date.getMinutes(); // get minutes (0-59)

    // Add leading zero if needed
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    return `${hh}:${mm}`;
  }

  async function resolveUser(){
    try {
      const userRef = doc(db,"users",userState.id)
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        const rcuserData = userDocSnap.data();
        const currentArray = rcuserData['users'];
        if (Array.isArray(currentArray)) {
          const updatedArray = currentArray.map((item) => {
            if (item['userId'] === selectedChat.userId) {
              // Found the specific map, now update its field
              return { ...item, ['isEscalated']: false,['isResolved']:true };
            }
            return item;
          });
          // Write the entire modified array back to the document
          await updateDoc(userRef, {
            'users': updatedArray,
            
          });
          setManualReply(false)
          alert(`Chat is now resolved`);
        } else {
          console.log(`Field '${'arrayFieldName'}' is not an array or does not exist.`);
        }
      }
      else {
        alert("No user to resolvee");
      }
    } 
    catch (error) {
    console.error("Error escalating user", error);
    }
  }
  async function escalateUser() {
    try {
      const userRef = doc(db,"users",userState.id)
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        const rcuserData = userDocSnap.data();
        const currentArray = rcuserData['users'];
        if (Array.isArray(currentArray)) {
          const updatedArray = currentArray.map((item) => {
            if (item['userId'] === selectedChat.userId) {
              // Found the specific map, now update its field
              return { ...item, ['isEscalated']: true,['isResolved']: false };
            }
            return item;
          });
          await updateDoc(userRef, {
            'users': updatedArray,
          });
          setManualReply(true)
          alert(`Chat is now escalated`);
        } else {
          alert(`Field is not an array or does not exist.`);
        }
      }else {
        alert("No user to escalate");
      }
        
    } 
    catch (error) {
    alert("Error escalating user" +error);
    }
  }


  useEffect(() => {
    if (userState.id) {  

      !selectedChat?.userId && setSelectedChat(userState.users[0])
      
    }
    const interval= setInterval(() => {
      if (!userState.id) {
        return
      }
      selectedChat?.userId &&  getMessages(selectedChat?.userId)
    }, 4500);
    return () => {
      clearInterval(interval);
      
    };
  }, [userState,selectedChat]);
  
  return (
    <>
      <div className="p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
        <div className='mb-6'>
          <h2 className="text-3xl text-[#004E7C] mb-2">
            Chat Management
          </h2>
          <p className="text-gray-600">Monitor and manage multilingual guest conversations</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white  shadow-sm">
            <TabsTrigger value="all">All Chats</TabsTrigger>
            <TabsTrigger  value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger disabled value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 bg-[FAFAFA]">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[750px]">
              {/* Conversations List */}
              <Card className="border-0 shadow-lg xl:col-span-3 flex flex-col bg-white">
                <CardHeader className="border-b border-gray-200 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e:any) => setSearchQuery(e.target.value)}
                      isSearch={true}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  {filteredConversations?.length >0?filteredConversations.map((user:any,index:number)=>{
                    return(<button
                      key={index}
                      onClick={() => {
                        setSelectedChat(user)
                        getMessages(user.userId)
                      }}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-[#004E7C]/5 transition-colors text-left ${
                        user.userId ===selectedChat?.userId ? 'bg-[#004E7C]/10 border-l-4 border-l-[#004E7C]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white">
                            {user.userName.split(' ').map((n:any) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#004E7C] truncate">{user.userName}</span>
                            {/* {conv.unread > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-2 border-0">
                                hi
                              </Badge>
                            )} */}
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-2">{user.mostRecent}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{user.gb}</span>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(user.isEscalated?'pending':'active')}`}>
                                {user.isEscalated?'pending':user.isResolved?'resolved':'active'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTime(user.sendTime) ||0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>) 
                  }):<div className='text-center'>No users</div>
                 }
                
                  
                </CardContent>
              </Card>

              {/* Chat Window */}
              <Card className="border-0 max-h-300 shadow-lg xl:col-span-6 flex flex-col bg-white ">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white">
                          {selectedChat?.userName?.split(' ').map((n:any) => n[0]).join('') || 'John Doe'.split(' ').map((n:any) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-[#004E7C]">{selectedChat?.userName || 'John Doe'}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe2 className="w-4 h-4 text-gray-500" />
                          <CardDescription>Gb English • Room: Not available</CardDescription>
                        </div>
                      </div>
                    </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild> 
                      <Button variant="outline" disabled={selectedChat?.userId?false:true} className="border-orange-600 text-orange-600 hover:bg-orange-50">Manual Reply</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                      {selectedChat?.isEscalated?<DropdownMenuItem onClick={resolveUser} className="cursor-pointer text-black">
                         Mark resolved
                       </DropdownMenuItem>:
                       <DropdownMenuItem onClick={escalateUser} className="cursor-pointer text-black">
                         Escalate
                      </DropdownMenuItem>
                      }
                      {manualReply?<DropdownMenuItem onClick={()=>setManualReply(false)} className="cursor-pointer text-black">
                         Disable manual reply
                      </DropdownMenuItem>
                      :<DropdownMenuItem onClick={()=>setManualReply(true)} className="cursor-pointer text-black">
                         Activate manual reply
                      </DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu> 
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]">
                  {messages.length >0? messages.map((message:any,index:number)=>{
                     
                     
                    return <Message key={index}isCustomer={message?.senderId === selectedChat.userId?false:true} text={message?.message} time={formatTime(message?.createdAt)} isAi={message?.isAi}/>        
                }):<div>No messages</div>}

                </CardContent>

                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder={!manualReply?"AI is handling this conversation...":''}
                      disabled={manualReply?false:true}
                      value={text}
                      className="flex-1"
                      onChange={(e:any)=>setText(e.target.value)}
                    />
                    <Button onClick={sendMessage} className="bg-[#A0D6D3] text-[#004E7C]">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {!manualReply &&<p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    AI Concierge is actively managing this conversation
                  </p>}
                </div>
              </Card>

              {/* Guest CRM Card */}
              <div className="xl:col-span-3">
                <GuestCRMCard guest={crmSelected} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
