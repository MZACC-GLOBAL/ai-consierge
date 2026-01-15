"use client"
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/Card';
import { Button } from '../../_components/Button';
import { Input } from '../../_components/Input';
import { Label } from '../../_components/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../_components/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../_components/Select';
import { MessageCircle, X, Send, Code, Palette, Eye, Copy, Check } from 'lucide-react';
import { useAuth } from '@/app/_components/AuthListener';
import axios from 'axios';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function ChatWidgetPreview() {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [origin,setOrigin] = useState('')
  const [widgetColor, setWidgetColor] = useState('#3b82f6');
  const [widgetPosition, setWidgetPosition] = useState('bottom-right');
  const [defaultLanguage,setDefaultLanguage] = useState('en')
  const [welcomeMsg,setWelcomeMsg] = useState('👋 Welcome! How can I assist you today?')
  const [copied, setCopied] = useState(false);
  const tabRefOne = useRef<any>(null);
  const tabRefTwo = useRef<any>(null);
  const {userState} = useAuth()
  
  const widgetSettings = {
    widgetColor,
    widgetPosition,
    welcomeMsg,
    defaultLanguage
  }

  const getPreferences = async()=>{
    try {
      let docRef = doc(db,"users", userState?.id);
      await getDoc(docRef).then(res=>{
        const data = res?.data()?.widgetSettings
        setDefaultLanguage(data.defaultLanguage)
        setWelcomeMsg(data.welcomeMsg)
        setWidgetColor(data.widgetColor)
        setWidgetPosition(data.widgetPosition)
      })
    } catch (error) {
      console.log(error);
      
      alert('Error getting settings')
      
    }
  }

  const savePreferences = async ()=>{ 
    if (!welcomeMsg) {
      return
    }
    try {
      let docRef = doc(db,"users", userState?.id);

      await updateDoc(docRef,{widgetSettings:widgetSettings})
      .then(()=>alert('Changes applied'))
      
    } catch (error) {
      alert('Error Applying changes')
    }
  }

  
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const toggleTabColor = (num:number) =>{
    if (num ===1) {
      tabRefOne?.current.classList.add('bg-white')
      tabRefTwo?.current.classList.remove('bg-white')
      
    }
    else if (num ===2) {
      tabRefOne?.current.classList.remove('bg-white')
      tabRefTwo?.current.classList.add('bg-white')
      
    }
    
  }
  
  useEffect(()=>{
    if(userState?.id){
      window?.location?.origin && setOrigin(window.location.origin)
      getPreferences()
    }
  },[userState])


  const embedCode = `<!-- AI Concierge Chat Widget -->
  <script
    src="${origin}/widget.js"
    data-user-id="UNIQUE_ID_OF_GUEST" //Dynamic property
    data-site-id="${userState.id}"
    data-user-name="GUEST_USER_NAME" //dynamic property
    data-user-email="${userState.email}" 
    data-checkin-time="month/day/year" //Dynamic property
    data-checkout-time="month/day/year" //Dynamic property
   >
  </script>`;
  return (
    <div className="p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10">
      <div className='mb-6'>
        <h2 className="text-3xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-2">
          Chat Widget
        </h2>
        <p className="text-gray-600">Customize and embed your AI concierge on your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Panel */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Widget Customization
            </CardTitle>
            <CardDescription>Personalize your chat widget appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="appearance">
              <TabsList className="w-full bg-gray-200">
                <TabsTrigger ref={tabRefOne} onClick={()=>toggleTabColor(1)} value="appearance" className="flex-1 bg-white">Appearance</TabsTrigger>
                <TabsTrigger ref={tabRefTwo} onClick={()=>toggleTabColor(2)} value="embed" className="flex-1">Embed Code</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="widgetColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="widgetColor"
                      type="color"
                      value={widgetColor}
                      onChange={(e:any) => setWidgetColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={widgetColor}
                      onChange={(e:any) => setWidgetColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Widget Position</Label>
                  <Select value={widgetPosition} onValueChange={setWidgetPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greeting">Welcome Message</Label>
                  <Input
                    id="greeting"
                    defaultValue={welcomeMsg}
                    onChange={(e:any)=>setWelcomeMsg(e.target.value)}
                  />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue={defaultLanguage} onValueChange={(value:any)=>setDefaultLanguage(value)} >
                    <SelectTrigger >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white' >
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={savePreferences} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </TabsContent>

              <TabsContent value="embed" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Embed Code</Label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{embedCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-white hover:bg-white/10"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Copy and paste this code before the closing {'</body>'} tag of your website
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-blue-900 mb-1">Integration Guide</p>
                      <p className="text-blue-700">
                        Need help? Check our <u> detailed integration documentation</u> or <u>contact support for assistance.</u>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Live Preview
            </CardTitle>
            <CardDescription>See how your widget will look on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-[600px] overflow-hidden border-4 border-gray-300">
              {/* Simulated Website */}
              <div className="p-8">
                <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              </div>

              {/* Chat Widget */}
              <div className={`absolute ${
                widgetPosition === 'bottom-right' ? 'bottom-6 right-6' :
                widgetPosition === 'bottom-left' ? 'bottom-6 left-6' :
                widgetPosition === 'top-right' ? 'top-6 right-6' :
                'top-6 left-6'
              }`}>
                {!widgetOpen ? (
                  <button
                    onClick={() => setWidgetOpen(true)}
                    className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110"
                    style={{ backgroundColor: widgetColor }}
                  >
                    <MessageCircle className="w-8 h-8" />
                  </button>
                ) : (
                  <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div
                      className="p-4 text-white flex items-center justify-between"
                      style={{ backgroundColor: widgetColor }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm">AI Concierge</p>
                          <p className="text-xs opacity-90">Online</p>
                        </div>
                      </div>
                      <button onClick={() => setWidgetOpen(false)} className="hover:bg-white/10 p-1 rounded">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[80%]">
                          <p className="text-sm">👋 Welcome! How can I assist you today?</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div
                          className="text-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[80%]"
                          style={{ backgroundColor: widgetColor }}
                        >
                          <p className="text-sm">What time is breakfast?</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[80%]">
                          <p className="text-sm">
                            Breakfast is served from 7:00 AM to 10:30 AM in our dining room. We offer a continental buffet with fresh pastries, fruits, and hot options. 🍳☕
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          className="flex-1 text-sm"
                        />
                        <button
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: widgetColor }}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}