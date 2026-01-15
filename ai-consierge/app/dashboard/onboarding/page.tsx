"use client"
import { useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Input } from '../../_components/Input';
import { Label } from '../../_components/Label';
import { Progress } from '../../_components/ProgressBar';
import { TrendingUp, Euro, Home, BarChart3, Sparkles, ArrowRight, Play, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoGuideModal } from '../../_components/VideoGuideModal';
import { useRouter } from 'next/navigation';
import { Paddle } from '@paddle/paddle-js';
import { useAuth } from '@/app/_components/AuthListener';
import { paddleInit } from '@/paddleComponents/paddleInit';



interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [formData, setFormData] = useState({
    rooms: '12',
    avgRate: '150',
    occupancy: '75',
  });
  const [showVideoGuide, setShowVideoGuide] = useState(false);

  const rooms = parseInt(formData.rooms) || 0;
  const avgRate = parseInt(formData.avgRate) || 0;
  const occupancy = parseInt(formData.occupancy) || 0;

  // ROI Calculations
  const guestsPerMonth = rooms * 30 * (occupancy / 100);
  const upsellRate = 0.35; // 35% conversion rate
  const avgUpsellValue = 45; // €45 average upsell
  const monthlyUpsellRevenue = guestsPerMonth * upsellRate * avgUpsellValue;
  const planCost = 79; // Pro plan
  const netProfit = monthlyUpsellRevenue - planCost;
  const roi = planCost > 0 ? ((netProfit / planCost) * 100) : 0;

  const projectionData = [
    { month: 'Month 1', revenue: monthlyUpsellRevenue * 0.6 },
    { month: 'Month 2', revenue: monthlyUpsellRevenue * 0.75 },
    { month: 'Month 3', revenue: monthlyUpsellRevenue * 0.9 },
    { month: 'Month 4', revenue: monthlyUpsellRevenue },
    { month: 'Month 5', revenue: monthlyUpsellRevenue * 1.1 },
    { month: 'Month 6', revenue: monthlyUpsellRevenue * 1.15 },
  ];
  // inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4
  const router = useRouter();
  const[paddle,setPaddle] = useState<Paddle>()   
  const { userState} = useAuth();
  
  const activatePaddle = async () =>{
    await paddleInit().then((paddleObj:any)=>setPaddle(paddleObj)) 
    .catch((error: any)=>alert(error))
  }
  
  useEffect(() => {    
    activatePaddle()
  }, []);
    
    
  const checkOut = async () =>{
    if (paddle) { 
      paddle?.Checkout.open({
          
        items:[{quantity:1, priceId:'pri_01kestmfvpr9jxb4ftarqep3ds'}],
          
        settings:{
          displayMode:'overlay',
            
          theme:'light',
            
          successUrl:`${window.location.origin}/dashboard/billing`,    
        },
      })
      
    }
    
  }
  
  return (
    <div className="p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <Card className="w-full bg-white max-w-3xl border-0 mx-auto shadow-2xl">
        
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-[#004E7C] to-[#0067A3] text-white rounded-t-lg relative">
          {/* Video Guide Button */}
          <Button
            onClick={() => setShowVideoGuide(true)}
            className="  bg-[#F5B700] text-[#004E7C] hover:bg-[#FFC933]"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Video Guide
          </Button>

          <div className="mx-auto w-16 h-16 bg-[#F5B700] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-[#004E7C]" />
          </div>
          <CardTitle className="text-3xl text-white mb-2">
            Let's Calculate Your Potential Revenue
          </CardTitle>
          <CardDescription className="text-[#A0D6D3] text-base">
            See how AI Concierge can transform your guest experience into profit
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rooms" className="flex items-center gap-2 text-[#004E7C]">
                <Home className="w-4 h-4" />
                Number of Rooms
              </Label>
              <Input
                id="rooms"
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData(prev => ({ ...prev, rooms: e.target.value }))}
                className="h-12 text-lg border-[#A0D6D3] focus:ring-[#004E7C]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgRate" className="flex items-center gap-2 text-[#004E7C]">
                <Euro className="w-4 h-4" />
                Avg. Nightly Rate (€)
              </Label>
              <Input
                id="avgRate"
                type="number"
                value={formData.avgRate}
                onChange={(e) => setFormData(prev => ({ ...prev, avgRate: e.target.value }))}
                className="h-12 text-lg border-[#A0D6D3] focus:ring-[#004E7C]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupancy" className="flex items-center gap-2 text-[#004E7C]">
                <BarChart3 className="w-4 h-4" />
                Occupancy Rate (%)
              </Label>
              <Input
                id="occupancy"
                type="number"
                value={formData.occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, occupancy: e.target.value }))}
                className="h-12 text-lg border-[#A0D6D3] focus:ring-[#004E7C]"
              />
            </div>
          </div>

          {/* ROI Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white border-0">
              <CardContent className="p-6">
                <p className="text-[#A0D6D3] text-sm mb-2">Monthly Upsell Revenue</p>
                <p className="text-3xl mb-1">€{Math.round(monthlyUpsellRevenue).toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[#F5B700] text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Projected</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#F5B700] to-[#FFC933] text-[#004E7C] border-0">
              <CardContent className="p-6">
                <p className="text-[#004E7C]/70 text-sm mb-2">Net Profit</p>
                <p className="text-3xl mb-1">€{Math.round(netProfit).toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[#004E7C] text-sm">
                  <Euro className="w-4 h-4" />
                  <span>After costs</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#A0D6D3] to-[#B5E5E2] text-[#004E7C] border-0">
              <CardContent className="p-6">
                <p className="text-[#004E7C]/70 text-sm mb-2">Return on Investment</p>
                <p className="text-3xl mb-1">{Math.round(roi)}%</p>
                <Progress value={Math.min(roi, 100)} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Revenue Projection Chart */}
          <Card className="bg-[#FAFAFA] border border-[#A0D6D3]/30">
            <CardHeader>
              <CardTitle className="text-lg text-[#004E7C]">6-Month Revenue Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A0D6D3" />
                  <XAxis dataKey="month" stroke="#004E7C" />
                  <YAxis stroke="#004E7C" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #A0D6D3',
                      borderRadius: '8px'
                    }} 
                    formatter={(value: number) => [`€${Math.round(value)}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#F5B700" 
                    strokeWidth={3} 
                    dot={{ fill: '#F5B700', r: 5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#004E7C]/5 to-[#A0D6D3]/10 p-6 rounded-xl border border-[#A0D6D3]/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F5B700] rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#004E7C]" />
              </div>
              <div>
                <h4 className="text-lg text-[#004E7C] mb-1">Ready to boost your revenue?</h4>
                <p className="text-sm text-gray-600">
                  Start your 7-day free trial and see real results in your first week. No credit card required.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={checkOut}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white shadow-lg"
              >
                Activate Your 7-Day Free Trial Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={()=>router.push('/dashboard/analytics')}
                variant="outline"
                className="h-14 text-lg border-2 border-[#004E7C] text-[#004E7C] hover:bg-[#004E7C] hover:text-white px-8 font-semibold animate-pulse"
              >
                Skip for Now →
              </Button>
            </div>
            <p className="text-center text-sm text-[#004E7C] mt-3 font-medium">
              ⬆️ Click "Skip for Now" to explore the full dashboard immediately
            </p>
          </div>
        </CardContent>
      </Card>
      <VideoGuideModal
        isOpen={showVideoGuide}
        onClose={() => setShowVideoGuide(false)}
      />
    </div>
  );
}