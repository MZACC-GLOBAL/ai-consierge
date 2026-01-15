"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Badge } from '../../_components/Badge';
import { Input } from '../../_components/Input';
import { Building2, TrendingUp, MessageSquare, Euro, Search,MoreVertical, Eye, Ban, RefreshCw, Download, Filter,CheckCircle, XCircle, AlertCircle} from 'lucide-react';
import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuSeparator,  DropdownMenuTrigger,} from '../../_components/DropDownMenu';
import { useAuth } from '@/app/_components/AuthListener';
import axios from 'axios'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';


const hotelData = [
  { 
    id: 1, 
    name: 'Villa Toscana B&B', 
    owner: 'Marco Rossi', 
    email: 'marco@villatoscana.it',
    plan: 'Pro', 
    mrr: 79, 
    messages: 1240, 
    status: 'active',
    joined: 'Jan 2024',
    lastActive: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Hotel Belvedere', 
    owner: 'Sofia Bianchi', 
    email: 'sofia@belvedere.com',
    plan: 'Premium', 
    mrr: 199, 
    messages: 3420, 
    status: 'active',
    joined: 'Feb 2024',
    lastActive: '1 hour ago'
  },
  { 
    id: 3, 
    name: 'Roma Guest House', 
    owner: 'Luigi Ferrari', 
    email: 'luigi@romaguesthouse.it',
    plan: 'Starter', 
    mrr: 29, 
    messages: 89, 
    status: 'trial',
    joined: 'Jun 2024',
    lastActive: '5 mins ago'
  },
  { 
    id: 4, 
    name: 'Palazzo Venezia', 
    owner: 'Isabella Romano', 
    email: 'isabella@palazzovenezia.it',
    plan: 'Premium', 
    mrr: 199, 
    messages: 2890, 
    status: 'active',
    joined: 'Mar 2024',
    lastActive: '30 mins ago'
  },
  { 
    id: 5, 
    name: 'Casa Del Mare', 
    owner: 'Antonio Costa', 
    email: 'antonio@casadelmare.it',
    plan: 'Pro', 
    mrr: 79, 
    messages: 1567, 
    status: 'suspended',
    joined: 'Apr 2024',
    lastActive: '2 days ago'
  },
  { 
    id: 6, 
    name: 'Boutique Hotel Firenze', 
    owner: 'Elena Ricci', 
    email: 'elena@boutiquefirenze.it',
    plan: 'Enterprise', 
    mrr: 449, 
    messages: 8920, 
    status: 'active',
    joined: 'Dec 2023',
    lastActive: '15 mins ago'
  },
];

const StatCard = ({title,value,change,Icon,color}:any) =>{
  return(
    <Card  className="border-0 bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl text-[#004E7C] mb-2">{value}</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{change}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'trial' | 'suspended'>('all');

  const filteredHotels = hotelData.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || hotel.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || hotel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const {userState} = useAuth();
  const[allUsers,setAllUsers] = useState([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white border-0"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500 text-white border-0"><AlertCircle className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 text-white border-0"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      'Starter': 'bg-[#A0D6D3] text-[#004E7C]',
      'Pro': 'bg-[#004E7C] text-white',
      'Premium': 'bg-[#F5B700] text-[#004E7C]',
      'Enterprise': 'bg-gradient-to-r from-purple-600 to-purple-400 text-white',
    };
    return <Badge className={`${colors[plan as keyof typeof colors] || 'bg-gray-500 text-white'} border-0`}>{plan}</Badge>;
  };
  const cancelSubscription = async(subId:string)=>{
    try {
      await axios.post("/api/subscription/cancel-subscription", {subscriptionId:subId,});
      alert("Subscription cancelled successfully");
    } catch (error: any) {
      alert(`Failed to update subscription: ${error?.response?.data?.error}`);
    }
  }

  const forgotPassword = async() => {
    try {
      await sendPasswordResetEmail(auth,userState.email).then(async ()=>{
        alert("Password reset email sent!");
      })
        
    } catch (error) {
      alert(`Error sending password reset email:, ${error}`); 
    }
  } 
  
  function formatDateToReadableString(timestamp:number): string {
    const date = new Date(timestamp);

    const month = date.getMonth();
    const year = date.getFullYear();

    // Array of shortened month names (three letters)
    const monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return `${monthNamesShort[month]} ${year}`;
  }
  const getAllUsers = async() =>{
    const userRef = collection(db,'users')
    try {
      const data = await getDocs(userRef)
      const documents:any = []
      data.forEach((doc)=>{
        documents.push(doc.data());
        
      })
      setAllUsers(documents)
    } 
    catch (error) {
      alert('err'+error);
    }
  }

  useEffect(()=>{
    getAllUsers()
  },[])

  const getTotalCount = (docs:any[]) =>{
    let total = 0;
    for (const doc of docs) {
      if (typeof doc.messageCount ==='number') {
        total+=doc.messageCount;
      }
    }
    return total;
  }

  let totalMsgCount = 0;
  let [filteredConversations,setFilteredConversations] =useState([]);

  if (allUsers.length > 0) {
    totalMsgCount = getTotalCount(allUsers);
    const finalFiltered = allUsers.filter((conv:any) =>conv.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    filteredConversations.length !== finalFiltered.length && setFilteredConversations(finalFiltered)
    
  }

  
  return (
    <div className="p-6  bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className='mb-6'>
        <h2 className="text-3xl text-[#004E7C] mb-2">
          Platform Admin
        </h2>
        <p className="text-gray-600">Manage all hotels, subscriptions, and platform performance</p>
      </div>
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={'Total Hotels'} value={allUsers?.length || 0} change={'+12'} Icon={Building2} color={'from-[#004E7C] to-[#0067A3]'}/>
        <StatCard title={'Monthly Revenue'} value={'€42,891'} change={'+18.5%'} Icon={Euro} color={'from-[#F5B700] to-[#FFC933]'}/>
        <StatCard title={'Total Messages'} value={totalMsgCount || 0} change={'+23.1%'} Icon={MessageSquare} color={'from-[#A0D6D3] to-[#B5E5E2]'}/>
        <StatCard title={'Avg Satisfaction'} value={'4.7/5'} change={'+0.2'} Icon={TrendingUp} color={'from-green-600 to-green-400'}/>
      </div>

      {/* Hotels Management */}
      <Card className="border-0 shadow-lg bg-white mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#004E7C]">Hotels & Subscriptions</CardTitle>
              <CardDescription>Manage all customer accounts and subscriptions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#004E7C] text-[#004E7C] hover:bg-[#F5B700]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3 ">

            <div className="relative  ">
              <Search className="absolute left-3 top-45/100 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search hotels or owners..."
                value={searchQuery}
                onChange={(e:any) => setSearchQuery(e.target.value)}
                   
                isSearch={true}
              />
            </div>
            <div className="flex gap-2 overflow-x-scroll">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? ' bg-[#004E7C] text-white hover:bg-[#004E7C]' : 'border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]'}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-green-600 text-white hover:bg-[#004E7C]' : 'border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]'}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'trial' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('trial')}
                className={filterStatus === 'trial' ? 'bg-blue-600 text-white hover:bg-[#004E7C]' : 'border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]'}
              >
                Trial
              </Button>
              <Button
                variant={filterStatus === 'suspended' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('suspended')}
                className={filterStatus === 'suspended' ? 'bg-red-600 text-white hover:bg-[#004E7C]' : 'border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]'}
              >
                Suspended
              </Button>
            </div>
          </div>

          {/* Hotels Table */}
          <div className=" rounded-lg overflow-x-scroll">
            <table className="w-full ">
              <thead className="bg-[#004E7C] text-white">
                <tr>
                  <th className="text-left p-4">Hotel</th>
                  <th className="text-left p-4">Owner</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">MRR</th>
                  <th className="text-left p-4">Messages</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Active</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.length >0 ?filteredConversations.map((user,index)=>{
                  return <tr key={index} className="border border-gray-200 hover:bg-[#A0D6D3]/10 transition-colors">
                    <td className="p-4">
                      
                      <div>
                        <p className="text-[#004E7C]">{user?.property?.propertyName }</p>
                        <p className="text-xs text-gray-500">Joined {formatDateToReadableString(user?.joined || 0) ||'Dec 2024'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-[#004E7C]">{user?.fullName ||'John doe'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'example@gmail.com'}</p>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {getPlanBadge(user?.plan || 'Unsubscribed')}
                    </td>
                    <td className="p-4">
                      <span className="text-[#F5B700]">€79</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700">{user?.messageCount?.toLocaleString() ||'2'}</span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user?.subscriptionStatus || 'inactive')}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{'null'}</span>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={forgotPassword} className="cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-orange-600">
                            <Ban className="w-4 h-4 mr-2" />
                            {user?.subscriptionStatus === 'suspended' ? 'Unsuspend' : 'Suspend'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>cancelSubscription(user?.subscriptionId)} className="cursor-pointer text-red-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Subscription
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                </tr>
                 }):<tr>
                  

                    <td className='w-80 ml-10 block mx-auto'>No hotels found matching your criteria</td>
                  
                  </tr>
                }
              </tbody>
            </table>
          </div>

         
        </CardContent>
      </Card>
    </div>
  );
}
