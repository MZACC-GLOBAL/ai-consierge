"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Badge } from '../../_components/Badge';
import { TrendingUp, MessageCircle, MessageSquare, Phone, Euro, Target, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const channelData = [
  { name: 'Web Chat', value: 1245, color: '#004E7C', revenue: 8920 },
  { name: 'WhatsApp', value: 892, color: '#25D366', revenue: 6340 },
  { name: 'Telegram', value: 456, color: '#0088cc', revenue: 3240 },
  { name: 'Email', value: 234, color: '#F5B700', revenue: 1680 },
];

const conversionData = [
  { channel: 'Web Chat', conversations: 1245, conversions: 437, revenue: 8920 },
  { channel: 'WhatsApp', conversations: 892, conversions: 312, revenue: 6340 },
  { channel: 'Telegram', conversations: 456, conversions: 128, revenue: 3240 },
  { channel: 'Email', conversations: 234, conversions: 56, revenue: 1680 },
];

const upsellBreakdown = [
  { category: 'Airport Transfer', bookings: 147, revenue: 5145, avgValue: 35 },
  { category: 'Restaurant Reservations', bookings: 234, revenue: 0, avgValue: 0, commission: 5850 },
  { category: 'City Tours', bookings: 89, revenue: 4005, avgValue: 45 },
  { category: 'Welcome Packages', bookings: 312, revenue: 7800, avgValue: 25 },
  { category: 'Late Checkout', bookings: 156, revenue: 3120, avgValue: 20 },
  { category: 'Spa Services', bookings: 78, revenue: 5460, avgValue: 70 },
];

export default function ConversionTracking() {
  const totalConversations = channelData.reduce((sum, ch) => sum + ch.value, 0);
  const totalRevenue = channelData.reduce((sum, ch) => sum + ch.revenue, 0);
  const totalConversions = conversionData.reduce((sum, ch) => sum + ch.conversions, 0);
  const avgConversionRate = ((totalConversions / totalConversations) * 100).toFixed(1);
  const avgRevenuePerConversion = (totalRevenue / totalConversions).toFixed(2);

  return (
    <div className="p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className='mb-6'>
        <h2 className="text-3xl text-[#004E7C] mb-2">
          Conversion Tracking & Attribution
        </h2>
        <p className="text-gray-600">Track upsell performance across all channels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#A0D6D3] text-sm">Total Upsell Value</p>
              <Euro className="w-5 h-5 text-[#F5B700]" />
            </div>
            <p className="text-3xl mb-1">€{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-[#A0D6D3]">This month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">ROI</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">1,247%</p>
            <p className="text-xs text-gray-500">Return on investment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Conversion Rate</p>
              <Target className="w-5 h-5 text-[#F5B700]" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">{avgConversionRate}%</p>
            <p className="text-xs text-gray-500">Avg across channels</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F5B700] to-[#FFC933]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#004E7C]/70 text-sm">Avg Order Value</p>
              <Users className="w-5 h-5 text-[#004E7C]" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">€{avgRevenuePerConversion}</p>
            <p className="text-xs text-[#004E7C]/70">Per conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6   my-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#004E7C]" />
              Channel Distribution
            </CardTitle>
            <CardDescription className='text-gray-500'>Conversation volume by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: channel.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{channel.name}</p>
                    <p className="text-xs text-gray-500">{channel.value} chats</p>
                  </div>
                  <Badge className="bg-[#F5B700] text-[#004E7C] border-0">
                    €{channel.revenue}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#004E7C]" />
              Conversion Rates by Channel
            </CardTitle>
            <CardDescription className='text-gray-500'>Performance comparison across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="channel" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="conversations" fill="#A0D6D3" name="Conversations" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill="#004E7C" name="Conversions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-[#A0D6D3]/10 rounded-lg">
              <p className="text-sm text-[#004E7C] mb-1">Best Performing Channel</p>
              <div className="flex items-center justify-between">
                <span className="text-lg text-[#004E7C]">Web Chat</span>
                <Badge className="bg-green-600 text-white border-0">35.1% conversion</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upsell Category Breakdown */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-[#F5B700]" />
            Upsell Performance by Category
          </CardTitle>
          <CardDescription className='text-gray-500'>Revenue and conversion breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upsellBreakdown.map((item, index) => {
              const totalValue = item.revenue + (item.commission || 0);
              return (
                <div 
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-[#004E7C] hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[#004E7C] mb-1">{item.category}</h4>
                      <p className="text-sm text-gray-600">{item.bookings} bookings this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-[#F5B700]">€{totalValue.toLocaleString()}</p>
                      {item.commission && item.commission > 0 ? (
                        <p className="text-xs text-gray-500">Commission revenue</p>
                      ) : (
                        <p className="text-xs text-gray-500">€{item.avgValue} avg</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#004E7C] to-[#0067A3] h-2 rounded-full"
                      style={{ width: `${(item.bookings / 312) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attribution Insights */}
      <Card className="border-0 mt-6 shadow-lg bg-gradient-to-r from-[#004E7C]/5 to-[#A0D6D3]/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F5B700] to-[#FFC933] rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#004E7C]" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg text-[#004E7C] mb-2">Key Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">🎯 Top Converting</p>
                  <p className="text-[#004E7C]">Web Chat (35.1%)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">💰 Highest Revenue</p>
                  <p className="text-[#004E7C]">Web Chat (€8,920)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">📈 Fastest Growing</p>
                  <p className="text-[#004E7C]">Telegram (+45%)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
