'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Badge } from '../../_components/Badge';
import { Check, CreditCard, Download, Zap, Star, Crown, Rocket, MessageCircle, MoreVertical, Eye, RefreshCw, Ban, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { paddleInit } from '@/paddleComponents/paddleInit';
import { Paddle } from '@paddle/paddle-js';
import { useAuth } from '@/app/_components/AuthListener';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/app/_components/DropDownMenu';
import axios from 'axios';


const plans = [
  {
    name: 'Starter',
    price: '€29',
    priceId:"pri_01kestvw1p0vbxmajxtk18083g",
    period: '/month',
    description: 'Small B&Bs and 1-5 room guesthouses',
    icon: MessageCircle,
    color: 'from-[#A0D6D3] to-[#B5E5E2]',
    trial: '7-Day Free Trial',
    features: [
      'Up to 100 guest chats/month',
      '1 WhatsApp + 1 Web Chat connection',
      '2 languages (English + Italian)',
      'FAQ bot + basic analytics',
      'Email notifications for new messages',
    ],
  },
  {
    name: 'Pro',
    price: '€79',
    priceId:"pri_01kesv6jrqbc4h40z1335nhkbd",
    period: '/month',
    description: 'Mid-sized hotels (6-20 rooms)',
    icon: Star,
    color: 'from-[#004E7C] to-[#0067A3]',
    popular: true,
    features: [
      'Unlimited guest chats',
      'WhatsApp + Telegram + Web Chat',
      '4 languages (EN, IT, FR, ES)',
      'Smart upsells (tours, spa, wine)',
      'Human escalation system',
      'Advanced analytics (chat volume, upsell value)',
      'Hotel branding (logo, color theme)',
      'Priority AI response speed',
    ],
  },
  {
    name: 'Premium',
    price: '€199',
    priceId:"pri_01kesv48dd57pqde13yzrq8391",
    period: '/month',
    description: 'Boutique hotels & premium brands',
    icon: Crown,
    color: 'from-[#F5B700] to-[#FFC933]',
    features: [
      'Everything in Pro',
      'Multi-staff login + access roles',
      'AI tone customization (Luxury, Friendly, Formal)',
      'Booking.com & Airbnb integration',
      'AI Upsell Optimization (behavioral learning)',
      'Dedicated account manager',
      'Monthly performance reports',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceId:"",
    period: '',
    description: 'Hotel chains, groups, agencies',
    icon: Rocket,
    color: 'from-[#769B9C] to-[#8BACAD]',
    enterprise: true,
    features: [
      'White-label branding',
      'Unlimited hotels under one account',
      'Dedicated infrastructure + SLA',
      'Integration with CRMs, Google Calendar, Expedia',
      'Custom AI Concierge model',
      'Affiliate marketplace access',
      'Priority support 24/7',
    ],
  },
];

function formatDateToReadableString(isoDateString: string): string {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  });
}

export default function BillingPage() {
  const[width,setWidth] = useState<number>(100);
  const[paddle,setPaddle] = useState<Paddle>()
  const[nextBilling,setNextBilling] = useState('unsubscribed')
 
  const[invoices,setInvoices] = useState([])
  const { userState} = useAuth();

  const activatePaddle = async () =>{
    await paddleInit().then((paddleObj:any)=>setPaddle(paddleObj)) 
    .catch((error: any)=>alert(error))
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    activatePaddle()

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const checkOut = async (plan:string,priceId:string) =>{
    if (paddle) { 
      paddle?.Checkout.open({
        
        items:[{quantity:1, priceId:priceId}],
        
        settings:{
          displayMode:'overlay',
          
          theme:'light',
          
          successUrl:`${window.location.origin}/dashboard/success`,    
        },
        customData:{
          userId:userState?.id,
          plan:plan
        }
      })
    }
    
  }

  const cancelSubscription = async(subId:string)=>{
    try {
      await axios.post("/api/subscription/cancel-subscription", {subscriptionId:subId,});
      alert("Subscription cancelled successfully");
    } catch (error: any) {
      alert(`Failed to update subscription: ${error?.response?.data?.error}`);
    }
  }


  const getSubscription = async()=>{

     try {
      const response = await axios.post("/api/subscription", {subscriptionId:userState?.subscriptionId});
      setNextBilling(formatDateToReadableString(response.data.endDate)); 
    } catch (error: any) {
      alert(`Failed to get subscription: ${error?.response?.data?.error}`);
    }
  }
  const getTransactionHistory = async ()=>{
    
   try {
     const res =  await axios.post("/api/transactions",{customerId:userState?.customerId})
     // setInvoices(res.data.transactions);
      setInvoices([]);
   } catch (error) {
     console.log('error happened',error)
   }
    
  }
  useEffect(()=>{
    if(userState?.subscriptionId){
      getTransactionHistory()
      getSubscription()
    }
  },[userState]);

  
  const checkAvailableUpgrades = () => {
    let availableUpgrades;

    if (userState?.plan === 'Starter') {
      availableUpgrades = ['Pro', 'Premium','Enterprise'];

    } else if (userState?.plan === 'Pro') {
      availableUpgrades = ['Premium','Enterprise'];
      
    } else if (userState?.plan === 'Premium') {
      availableUpgrades = ['Enterprise'];
    }
    else if (userState.plan ==='Enterprise'){
      availableUpgrades = null;
    }
    if (!availableUpgrades) {
      alert('Upgrade not available from your current plan.');
      return;
    }
    
    return availableUpgrades
  };

  const upgradePlan = async (newPlan:string) =>{
    const confirmation = prompt(`Are you sure you want to upgrade to The ${newPlan} Plan. pease type 'yes' to confirm`)
    if(confirmation === 'yes' || confirmation ==='Yes' || confirmation ==='YES') {
      const priceId = plans.find(plan => plan.name ===newPlan)?.priceId
      try {
        await axios.post("/api/subscription/change-subscription", { subscriptionId: userState?.subscriptionId, newPriceId: priceId })
        .then(res=>console.log(res)
        )
        alert("Subscription upgraded successfully");
      } catch (error: any) {
  
        console.log(error.response);
        
        alert(`Failed to upgrade subscription: ${error?.response?.data?.error}`);
      }
    }
  }


  const updatePaymentMethod = async (subscriptionId: string) => {
    const res = await axios.post("/api/subscription/update-payment-method", {
      subscriptionId,
      
    });
    // Redirect user to Paddle
    window.location.href = res.data.url;
    console.log(res.data.url);
    
  }
  
  return (
    <div className="p-6  bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className='mb-8'>
        <h2 className="text-3xl text-[#004E7C] mb-2">
          Subscription & Billing
        </h2>
        <p className="text-gray-600">Manage your subscription and view billing history</p>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white">
        <CardContent className="p-8">
          <div  className={`${width < 600 ? 'flex-col':'flex-row'} flex items-start justify-between `}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6" />
                <h3 className="text-2xl text-white">{userState.plan || 'No'} Plan</h3>
              </div>
              <p className="text-[#A0D6D3] mb-6">Your current subscription</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl text-white">{userState.plan =='Starter' ? '€29' : userState.plan =='Pro' ? '€79' :userState.plan =='Premium'? '€199':'€0'}</span>
                <span className="text-xl text-[#A0D6D3]">/month</span>
              </div>
              <div className="flex gap-3">
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button  className="bg-[#F5B700] text-[#004E7C] hover:bg-[#FFC933]">
                      Upgrade Plan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">

                    {userState.plan && checkAvailableUpgrades()?.map((item,index)=>{
                      const Icon:any = plans.find(plan => plan.name === item)?.icon;
                      const color = plans.find(plan => plan.name === item)?.color;

                      return <DropdownMenuItem key={index} onClick={()=>item =='Enterprise'?alert('Coming soon!'): upgradePlan(item)} className="cursor-pointer text-black">
                       <div className={`w-7 h-7  rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                       </div>
                       <p>{item}</p>
                       
                      </DropdownMenuItem>

                    })
                    }

                  </DropdownMenuContent>
                </DropdownMenu> 

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Manage Subscription
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem onClick={()=>cancelSubscription(userState?.subscriptionId)} className="cursor-pointer text-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> 
              </div>
            </div>
            <div className={`${width < 600  ? 'mt-8 flex  w-full  items-center justify-between':''}  text-right`}>

              <p className={` ${width < 600 ? 'mb-0' : 'mb-4'} text-sm text-[#A0D6D3]`}>Next billing date</p>
              <p className="text-xl text-white">{nextBilling}</p>
              <Badge className={`${width < 600 ?'mt-0':'mt-1'} ${userState.subscriptionStatus ==='active'?'bg-green-500':userState.subscriptionStatus ==='inactive'?'bg-red-500':'bg-orange-500'} text-white border-0`}>{userState.subscriptionStatus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className='bg-[#FAFAFA]'>
        <h3 className="text-xl text-[#004E7C] mb-4 mt-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={index} className={`border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-200 relative ${plan.name === userState.plan ? 'ring-2 ring-teal-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-4 shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}icon
                  </ul>
                  <Button
                    disabled={(plan.name ==='Enterprise' || userState.subscriptionStatus !=='inactive') && true}
                    onClick={() => checkOut(plan.name, plan.priceId)}
                    className={`w-full ${plan.name === userState.plan ? 'bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white': ''}`}
                    variant={'outline'}
                  >
                    {plan.name === userState.plan ? 'Current Plan' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Billing History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <p className="text-sm text-gray-300 mb-2">Bank Card</p>
              <p className="text-xl mb-4">•••• •••• •••• 4242</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Expires **/**</span>
                <span className="text-sm">VISA</span>
              </div>
            </div>
            <Button onClick={()=>updatePaymentMethod(userState.subscriptionId)}  className="w-full border border-gray-300 bg-gray-100 hover:bg-[#F5B700] hover:text-[#004E7C]">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 p-2 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your recent invoices</CardDescription>
          </CardHeader>
          {invoices.length>1?<CardContent>
            <div className="space-y-3">
              {invoices.map((invoice:any) => {
                const answer =  formatDateToReadableString(invoice?.billingPeriod?.startsAt)
                return <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm">{invoice.id}</p>
                    <p className="text-xs text-gray-500">{answer =='Invalid Date'?'Not Available':answer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{invoice.items[invoice.items.length-1].price.name === 'Starter'?'€29':invoice.items[invoice.items.length-1].price.name === 'Pro'?'€79':invoice.items[invoice.items.length-1].price.name === 'Premium'?'€199':'€0'}</span>
                    <Badge className={invoice.status ==='completed'?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}>{invoice.status ==='completed'?'Paid':'Unpaid'}</Badge>
                    <Button variant="ghost" size="sm" className='hover:bg-[#F5B700]'>
                      <Download className="w-4 h-4 " />
                    </Button>
                  </div>
                </div>
              })}
            </div>
          </CardContent>
          :<div className='text-center'>No invoices available!</div>  
          }
        </Card>
      </div>
    </div>
  );
}



// <DropdownMenuItem onClick={null} className="cursor-pointer text-red-600">
//                        <XCircle className="w-4 h-4 mr-2" />
//                        Cancel Subscription
//                      </DropdownMenuItem>