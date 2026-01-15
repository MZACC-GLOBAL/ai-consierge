"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Badge } from '../../_components/Badge';
import { Switch } from '../../_components/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../_components/Tabs';
import { Plane, Wine, UtensilsCrossed, Clock, MapPin, Ticket, TrendingUp, Users, Euro, Edit, Copy, Plus } from 'lucide-react';

const campaignTemplates = [
  {
    id: 1,
    category: 'pre-arrival',
    title: 'Airport Pickup Service',
    description: 'Offer convenient airport transfer to guests before arrival',
    icon: Plane,
    price: '€35',
    conversionRate: 18,
    totalBookings: 47,
    revenue: 1645,
    enabled: true,
    color: 'from-[#004E7C] to-[#0067A3]',
  },
  {
    id: 2,
    category: 'pre-arrival',
    title: 'Welcome Wine & Cheese',
    description: 'Premium welcome package with local wines and artisan cheese',
    icon: Wine,
    price: '€25',
    conversionRate: 32,
    totalBookings: 89,
    revenue: 2225,
    enabled: true,
    color: 'from-[#F5B700] to-[#FFC933]',
  },
  {
    id: 3,
    category: 'in-stay',
    title: 'Restaurant Reservation',
    description: 'Priority reservations at partner restaurants with 10% discount',
    icon: UtensilsCrossed,
    price: 'Commission',
    conversionRate: 45,
    totalBookings: 134,
    revenue: 3350,
    enabled: true,
    color: 'from-[#A0D6D3] to-[#B5E5E2]',
  },
  {
    id: 4,
    category: 'in-stay',
    title: 'City Tour Experience',
    description: 'Guided walking tour of historic city center',
    icon: MapPin,
    price: '€45',
    conversionRate: 28,
    totalBookings: 62,
    revenue: 2790,
    enabled: true,
    color: 'from-[#769B9C] to-[#8BACAD]',
  },
  {
    id: 5,
    category: 'checkout',
    title: 'Late Checkout',
    description: 'Extend checkout time by 2 hours',
    icon: Clock,
    price: '€20',
    conversionRate: 52,
    totalBookings: 156,
    revenue: 3120,
    enabled: true,
    color: 'from-[#004E7C] to-[#0067A3]',
  },
  {
    id: 6,
    category: 'checkout',
    title: 'Next Visit Discount',
    description: '15% off your next booking within 6 months',
    icon: Ticket,
    price: 'Free',
    conversionRate: 38,
    totalBookings: 98,
    revenue: 4900,
    enabled: false,
    color: 'from-[#F5B700] to-[#FFC933]',
  },
];

const localExperiences = [
  {
    id: 1,
    title: 'Rome Wine & Dine Tour',
    provider: 'GetYourGuide',
    price: '€89',
    commission: '€15',
    image: '🍷',
    rating: 4.8,
    bookings: 23,
    active: true,
  },
  {
    id: 2,
    title: 'Colosseum Fast Track Entry',
    provider: 'TourScanner',
    price: '€45',
    commission: '€8',
    image: '🏛️',
    rating: 4.9,
    bookings: 67,
    active: true,
  },
  {
    id: 3,
    title: 'Vatican Night Entry',
    provider: 'Viator',
    price: '€75',
    commission: '€12',
    image: '🎨',
    rating: 4.7,
    bookings: 34,
    active: true,
  },
  {
    id: 4,
    title: 'Tuscan Countryside Day Trip',
    provider: 'GetYourGuide',
    price: '€129',
    commission: '€22',
    image: '🌄',
    rating: 4.9,
    bookings: 18,
    active: false,
  },
];

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState(campaignTemplates);

  const toggleCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const avgConversion = campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length;

  return (
    <div className="p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl text-[#004E7C] mb-2">
            Upsell Campaigns
          </h2>
          <p className="text-gray-600">Pre-built campaigns to maximize revenue per guest</p>
        </div>
        <Button className="bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Campaign
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#A0D6D3] text-sm">Total Campaign Revenue</p>
              <Euro className="w-5 h-5 text-[#F5B700]" />
            </div>
            <p className="text-3xl mb-1">€{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-[#A0D6D3]">This month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Avg Conversion Rate</p>
              <TrendingUp className="w-5 h-5 text-[#A0D6D3]" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">{Math.round(avgConversion)}%</p>
            <p className="text-xs text-gray-500">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Active Campaigns</p>
              <Users className="w-5 h-5 text-[#F5B700]" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">{campaigns.filter(c => c.enabled).length}</p>
            <p className="text-xs text-gray-500">Out of {campaigns.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F5B700] to-[#FFC933]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#004E7C]/70 text-sm">Total Bookings</p>
              <Ticket className="w-5 h-5 text-[#004E7C]" />
            </div>
            <p className="text-3xl text-[#004E7C] mb-1">{campaigns.reduce((sum, c) => sum + c.totalBookings, 0)}</p>
            <p className="text-xs text-[#004E7C]/70">Upsells completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="bg-white  shadow-sm">
          <TabsTrigger value="campaigns">Campaign Library</TabsTrigger>
          <TabsTrigger value="local">Local Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <div className="space-y-4">
            {/* Pre-Arrival */}
            <div className=''>
              <h3 className="text-lg text-[#004E7C] mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F5B700]" />
                Pre-Arrival Offers
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {campaigns.filter(c => c.category === 'pre-arrival').map((campaign) => {
                  const Icon = campaign.icon;
                  return (
                    <Card key={campaign.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${campaign.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-[#004E7C] mb-1">{campaign.title}</h4>
                              <p className="text-sm text-gray-600">{campaign.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={campaign.enabled}
                            onCheckedChange={() => toggleCampaign(campaign.id)}
                            className="data-[state=checked]:bg-[#004E7C]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-sm text-[#004E7C]">{campaign.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Conversion</p>
                            <p className="text-sm text-[#004E7C]">{campaign.conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Revenue</p>
                            <p className="text-sm text-[#004E7C]">€{campaign.revenue}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 border-[#004E7C] text-[#004E7C] hover:bg-[#F5B700]">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700] ">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* In-Stay */}
            <div className='mb-6'>
              <h3 className="text-lg text-[#004E7C] mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#A0D6D3]" />
                In-Stay Experiences
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {campaigns.filter(c => c.category === 'in-stay').map((campaign) => {
                  const Icon = campaign.icon;
                  return (
                    <Card key={campaign.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${campaign.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-[#004E7C] mb-1">{campaign.title}</h4>
                              <p className="text-sm text-gray-600">{campaign.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={campaign.enabled}
                            onCheckedChange={() => toggleCampaign(campaign.id)}
                            className="data-[state=checked]:bg-[#004E7C]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-sm text-[#004E7C]">{campaign.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Conversion</p>
                            <p className="text-sm text-[#004E7C]">{campaign.conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Revenue</p>
                            <p className="text-sm text-[#004E7C]">€{campaign.revenue}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 border-[#004E7C] text-[#004E7C] hover:bg-[#F5B700]">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Checkout */}
            <div>
              <h3 className="text-lg text-[#004E7C] mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#004E7C]" />
                Checkout & Retention
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {campaigns.filter(c => c.category === 'checkout').map((campaign) => {
                  const Icon = campaign.icon;
                  return (
                    <Card key={campaign.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${campaign.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-[#004E7C] mb-1">{campaign.title}</h4>
                              <p className="text-sm text-gray-600">{campaign.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={campaign.enabled}
                            onCheckedChange={() => toggleCampaign(campaign.id)}
                            className="data-[state=checked]:bg-[#004E7C]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-sm text-[#004E7C]">{campaign.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Conversion</p>
                            <p className="text-sm text-[#004E7C]">{campaign.conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Revenue</p>
                            <p className="text-sm text-[#004E7C]">€{campaign.revenue}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 border-[#004E7C] text-[#004E7C] hover:bg-[#F5B700]">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-[#A0D6D3] text-[#004E7C] hover:bg-[#F5B700]">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="local" className="mt-6">
          <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-[#004E7C]/5 to-[#A0D6D3]/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#F5B700] flex-shrink-0" />
                <div>
                  <h4 className="text-[#004E7C] mb-1">Rome Local Experiences</h4>
                  <p className="text-sm text-gray-600">
                    Pre-integrated affiliate experiences from trusted partners. Earn commission on every booking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localExperiences.map((exp) => (
              <Card key={exp.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{exp.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-[#004E7C]">{exp.title}</h4>
                        {exp.active ? (
                          <Badge className="bg-[#A0D6D3] text-[#004E7C]">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-600">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">by {exp.provider}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#F5B700]">★ {exp.rating}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{exp.bookings} bookings</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Guest Price</p>
                      <p className="text-sm text-[#004E7C]">{exp.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your Commission</p>
                      <p className="text-sm text-[#F5B700]">{exp.commission}</p>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${exp.active 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white'
                    }`}
                  >
                    {exp.active ? 'Deactivate Offer' : 'Activate Offer'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
