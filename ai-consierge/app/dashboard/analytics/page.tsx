"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { TrendingUp, MessageSquare, Users, Star, Globe, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/app/_components/AuthListener';


const StatCard = ({Icon,title,value,change,bgColor,color}:any) =>{
  return(
    <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl mb-2">{value}</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{change}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 bg-gradient-to-br ${color} bg-clip-text text-transparent`} style={{ 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
const conversationData = [
  { month: 'Jan', conversations: 245, bookings: 89 },
  { month: 'Feb', conversations: 312, bookings: 118 },
  { month: 'Mar', conversations: 389, bookings: 152 },
  { month: 'Apr', conversations: 421, bookings: 178 },
  { month: 'May', conversations: 498, bookings: 201 },
  { month: 'Jun', conversations: 556, bookings: 234 },
];

const languageData = [
  { name: 'English', value: 45, color: '#3b82f6' },
  { name: 'Spanish', value: 20, color: '#14b8a6' },
  { name: 'French', value: 15, color: '#f59e0b' },
  { name: 'German', value: 12, color: '#8b5cf6' },
  { name: 'Others', value: 8, color: '#6b7280' },
];


const revenueData = [
  { day: 'Mon', revenue: 1250 },
  { day: 'Tue', revenue: 1890 },
  { day: 'Wed', revenue: 2340 },
  { day: 'Thu', revenue: 1780 },
  { day: 'Fri', revenue: 2890 },
  { day: 'Sat', revenue: 3420 },
  { day: 'Sun', revenue: 2980 },
];

export default function AnalyticsDashboard() {
  const stats = [
    { 
      title: 'Total Conversations', 
      value: '2,421', 
      change: '+12.5%', 
      icon: MessageSquare,
      color: 'from-[#004E7C] to-[#0067A3]',
      bgColor: 'bg-[#004E7C]/10'
    },
    { 
      title: 'Active Users', 
      value: '1,834', 
      change: '+8.2%', 
      icon: Users,
      color: 'from-[#A0D6D3] to-[#B5E5E2]',
      bgColor: 'bg-[#A0D6D3]/10'
    },
    { 
      title: 'Satisfaction Rate', 
      value: '4.8/5', 
      change: '+0.3', 
      icon: Star,
      color: 'from-[#F5B700] to-[#FFC933]',
      bgColor: 'bg-[#F5B700]/10'
    },
    { 
      title: 'Revenue Impact', 
      value: '€18.2K', 
      change: '+23.1%', 
      icon: DollarSign,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50'
    },
  ];
  const {userState} = useAuth()
  return (
    <div className="p-6  bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className='mb-6'>
        <h2 className="text-3xl text-[#004E7C] mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600">Track your AI concierge performance and guest engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title='Total Conversations' value ={userState?.users?.length || 0} change={'+12.5%'} Icon= {MessageSquare} color= {'from-[#004E7C] to-[#0067A3]'} bgColor= {'bg-[#004E7C]/10'} />
        <StatCard title='Active Users' value ={userState?.users?.length || 0} change={'+8.2%'} Icon= {Users} color= {'from-[#A0D6D3] to-[#B5E5E2]'} bgColor= {'bg-[#A0D6D3]/10'} />
        <StatCard title='Satisfaction Rate' value ={'4.8/5'} change={'+0.3%'} Icon= {Star} color= {'from-[#F5B700] to-[#FFC933]'} bgColor= {'bg-[#F5B700]/10'} />
        <StatCard title='Revenue Impact' value ={'€18.2K'} change={'+23.1%'} Icon= {DollarSign} color= {'from-[#004E7C] to-[#0067A3]'} bgColor= {'bg-green-50'} />

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Conversations & Bookings</CardTitle>
            <CardDescription className='text-gray-500'>Monthly trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="conversations" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="bookings" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-600" />
              Language Distribution
            </CardTitle>
            <CardDescription className='text-gray-500'>Guest language preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle>Weekly Revenue Impact</CardTitle>
          <CardDescription className='text-gray-500'>Direct bookings attributed to AI Concierge interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}