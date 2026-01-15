'use client'

import { Avatar, AvatarFallback } from '@/app/_components/Avatar'
import { Button } from '@/app/_components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/Card'
import { Input } from '@/app/_components/Input'
import { Label } from '@/app/_components/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/_components/Select'
import { Switch } from '@/app/_components/Switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/Tabs'
import { Bell, Building2, Check, Copy, Save, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/_components/AuthListener'
import { doc, updateDoc } from '@firebase/firestore'
import {auth, db} from '../../../firebase/firebase'
import { sendPasswordResetEmail, signOut } from 'firebase/auth'
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from "firebase/auth";

interface ProfileSettingsProps {
  user: { name: string; email: string } | null;
}
type Country = {
	name: string;
	cca2: string; // ISO2
	dial_code: string; // e.g. +1
};

const Settings = ({ user }: ProfileSettingsProps) => {
  // convert ISO2 to flag emoji, e.g. "US" -> "🇺🇸"
  const isoToFlag = (iso: string) => {
    if (!iso) return "";
    const up = iso.toUpperCase();
    // Regional Indicator Symbol Letter A starts at 0x1F1E6
    return Array.from(up).map(ch => String.fromCodePoint(0x1F1E6 + ch.charCodeAt(0) - 65)).join("");
  };
  
    // raw list uses ISO2 codes
  const rawCountries: Country[] = [
      { name: "United Kingdom", cca2: "GB", dial_code: "+44" },
      { name: "Afghanistan", cca2: "AF", dial_code: "+93" },
      { name: "Albania", cca2: "AL", dial_code: "+355" },
      { name: "Algeria", cca2: "DZ", dial_code: "+213" },
      { name: "Andorra", cca2: "AD", dial_code: "+376" },
      { name: "Angola", cca2: "AO", dial_code: "+244" },
      { name: "Antigua and Barbuda", cca2: "AG", dial_code: "+1-268" },
      { name: "Argentina", cca2: "AR", dial_code: "+54" },
      { name: "Armenia", cca2: "AM", dial_code: "+374" },
      { name: "Australia", cca2: "AU", dial_code: "+61" },
      { name: "Austria", cca2: "AT", dial_code: "+43" },
      { name: "Azerbaijan", cca2: "AZ", dial_code: "+994" },
      { name: "Bahamas", cca2: "BS", dial_code: "+1-242" },
      { name: "Bahrain", cca2: "BH", dial_code: "+973" },
      { name: "Bangladesh", cca2: "BD", dial_code: "+880" },
      { name: "Barbados", cca2: "BB", dial_code: "+1-246" },
      { name: "Belarus", cca2: "BY", dial_code: "+375" },
      { name: "Belgium", cca2: "BE", dial_code: "+32" },
      { name: "Belize", cca2: "BZ", dial_code: "+501" },
      { name: "Benin", cca2: "BJ", dial_code: "+229" },
      { name: "Bhutan", cca2: "BT", dial_code: "+975" },
      { name: "Bolivia", cca2: "BO", dial_code: "+591" },
      { name: "Bosnia and Herzegovina", cca2: "BA", dial_code: "+387" },
      { name: "Botswana", cca2: "BW", dial_code: "+267" },
      { name: "Brazil", cca2: "BR", dial_code: "+55" },
      { name: "Brunei", cca2: "BN", dial_code: "+673" },
      { name: "Bulgaria", cca2: "BG", dial_code: "+359" },
      { name: "Burkina Faso", cca2: "BF", dial_code: "+226" },
      { name: "Burundi", cca2: "BI", dial_code: "+257" },
      { name: "Cabo Verde", cca2: "CV", dial_code: "+238" },
      { name: "Cambodia", cca2: "KH", dial_code: "+855" },
      { name: "Cameroon", cca2: "CM", dial_code: "+237" },
      { name: "Canada", cca2: "CA", dial_code: "+1" },
      { name: "Central African Republic", cca2: "CF", dial_code: "+236" },
      { name: "Chad", cca2: "TD", dial_code: "+235" },
      { name: "Chile", cca2: "CL", dial_code: "+56" },
      { name: "China", cca2: "CN", dial_code: "+86" },
      { name: "Colombia", cca2: "CO", dial_code: "+57" },
      { name: "Comoros", cca2: "KM", dial_code: "+269" },
      { name: "Congo (Brazzaville)", cca2: "CG", dial_code: "+242" },
      { name: "Congo (Kinshasa)", cca2: "CD", dial_code: "+243" },
      { name: "Costa Rica", cca2: "CR", dial_code: "+506" },
      { name: "Côte d’Ivoire", cca2: "CI", dial_code: "+225" },
      { name: "Croatia", cca2: "HR", dial_code: "+385" },
      { name: "Cuba", cca2: "CU", dial_code: "+53" },
      { name: "Cyprus", cca2: "CY", dial_code: "+357" },
      { name: "Czechia", cca2: "CZ", dial_code: "+420" },
      { name: "Denmark", cca2: "DK", dial_code: "+45" },
      { name: "Djibouti", cca2: "DJ", dial_code: "+253" },
      { name: "Dominica", cca2: "DM", dial_code: "+1-767" },
      { name: "Dominican Republic", cca2: "DO", dial_code: "+1-809" },
      { name: "Ecuador", cca2: "EC", dial_code: "+593" },
      { name: "Egypt", cca2: "EG", dial_code: "+20" },
      { name: "El Salvador", cca2: "SV", dial_code: "+503" },
      { name: "Equatorial Guinea", cca2: "GQ", dial_code: "+240" },
      { name: "Eritrea", cca2: "ER", dial_code: "+291" },
      { name: "Estonia", cca2: "EE", dial_code: "+372" },
      { name: "Eswatini", cca2: "SZ", dial_code: "+268" },
      { name: "Ethiopia", cca2: "ET", dial_code: "+251" },
      { name: "Fiji", cca2: "FJ", dial_code: "+679" },
      { name: "Finland", cca2: "FI", dial_code: "+358" },
      { name: "France", cca2: "FR", dial_code: "+33" },
      { name: "Gabon", cca2: "GA", dial_code: "+241" },
      { name: "Gambia", cca2: "GM", dial_code: "+220" },
      { name: "Georgia", cca2: "GE", dial_code: "+995" },
      { name: "Germany", cca2: "DE", dial_code: "+49" },
      { name: "Ghana", cca2: "GH", dial_code: "+233" },
      { name: "Greece", cca2: "GR", dial_code: "+30" },
      { name: "Grenada", cca2: "GD", dial_code: "+1-473" },
      { name: "Guatemala", cca2: "GT", dial_code: "+502" },
      { name: "Guinea", cca2: "GN", dial_code: "+224" },
      { name: "Guinea-Bissau", cca2: "GW", dial_code: "+245" },
      { name: "Guyana", cca2: "GY", dial_code: "+592" },
      { name: "Haiti", cca2: "HT", dial_code: "+509" },
      { name: "Honduras", cca2: "HN", dial_code: "+504" },
      { name: "Hungary", cca2: "HU", dial_code: "+36" },
      { name: "Iceland", cca2: "IS", dial_code: "+354" },
      { name: "India", cca2: "IN", dial_code: "+91" },
      { name: "Indonesia", cca2: "ID", dial_code: "+62" },
      { name: "Iran", cca2: "IR", dial_code: "+98" },
      { name: "Iraq", cca2: "IQ", dial_code: "+964" },
      { name: "Ireland", cca2: "IE", dial_code: "+353" },
      { name: "Israel", cca2: "IL", dial_code: "+972" },
      { name: "Italy", cca2: "IT", dial_code: "+39" },
      { name: "Jamaica", cca2: "JM", dial_code: "+1-876" },
      { name: "Japan", cca2: "JP", dial_code: "+81" },
      { name: "Jordan", cca2: "JO", dial_code: "+962" },
      { name: "Kazakhstan", cca2: "KZ", dial_code: "+7" },
      { name: "Kenya", cca2: "KE", dial_code: "+254" },
      { name: "Kiribati", cca2: "KI", dial_code: "+686" },
      { name: "Kuwait", cca2: "KW", dial_code: "+965" },
      { name: "Kyrgyzstan", cca2: "KG", dial_code: "+996" },
      { name: "Laos", cca2: "LA", dial_code: "+856" },
      { name: "Latvia", cca2: "LV", dial_code: "+371" },
      { name: "Lebanon", cca2: "LB", dial_code: "+961" },
      { name: "Lesotho", cca2: "LS", dial_code: "+266" },
      { name: "Liberia", cca2: "LR", dial_code: "+231" },
      { name: "Libya", cca2: "LY", dial_code: "+218" },
      { name: "Liechtenstein", cca2: "LI", dial_code: "+423" },
      { name: "Lithuania", cca2: "LT", dial_code: "+370" },
      { name: "Luxembourg", cca2: "LU", dial_code: "+352" },
      { name: "Madagascar", cca2: "MG", dial_code: "+261" },
      { name: "Malawi", cca2: "MW", dial_code: "+265" },
      { name: "Malaysia", cca2: "MY", dial_code: "+60" },
      { name: "Maldives", cca2: "MV", dial_code: "+960" },
      { name: "Mali", cca2: "ML", dial_code: "+223" },
      { name: "Malta", cca2: "MT", dial_code: "+356" },
      { name: "Marshall Islands", cca2: "MH", dial_code: "+692" },
      { name: "Mauritania", cca2: "MR", dial_code: "+222" },
      { name: "Mauritius", cca2: "MU", dial_code: "+230" },
      { name: "Mexico", cca2: "MX", dial_code: "+52" },
      { name: "Micronesia", cca2: "FM", dial_code: "+691" },
      { name: "Moldova", cca2: "MD", dial_code: "+373" },
      { name: "Monaco", cca2: "MC", dial_code: "+377" },
      { name: "Mongolia", cca2: "MN", dial_code: "+976" },
      { name: "Montenegro", cca2: "ME", dial_code: "+382" },
      { name: "Morocco", cca2: "MA", dial_code: "+212" },
      { name: "Mozambique", cca2: "MZ", dial_code: "+258" },
      { name: "Myanmar", cca2: "MM", dial_code: "+95" },
      { name: "Namibia", cca2: "NA", dial_code: "+264" },
      { name: "Nauru", cca2: "NR", dial_code: "+674" },
      { name: "Nepal", cca2: "NP", dial_code: "+977" },
      { name: "Netherlands", cca2: "NL", dial_code: "+31" },
      { name: "New Zealand", cca2: "NZ", dial_code: "+64" },
      { name: "Nicaragua", cca2: "NI", dial_code: "+505" },
      { name: "Niger", cca2: "NE", dial_code: "+227" },
      { name: "Nigeria", cca2: "NG", dial_code: "+234" },
      { name: "North Korea", cca2: "KP", dial_code: "+850" },
      { name: "North Macedonia", cca2: "MK", dial_code: "+389" },
      { name: "Norway", cca2: "NO", dial_code: "+47" },
      { name: "Oman", cca2: "OM", dial_code: "+968" },
      { name: "Pakistan", cca2: "PK", dial_code: "+92" },
      { name: "Palau", cca2: "PW", dial_code: "+680" },
      { name: "Panama", cca2: "PA", dial_code: "+507" },
      { name: "Papua New Guinea", cca2: "PG", dial_code: "+675" },
      { name: "Paraguay", cca2: "PY", dial_code: "+595" },
      { name: "Peru", cca2: "PE", dial_code: "+51" },
      { name: "Philippines", cca2: "PH", dial_code: "+63" },
      { name: "Poland", cca2: "PL", dial_code: "+48" },
      { name: "Portugal", cca2: "PT", dial_code: "+351" },
      { name: "Qatar", cca2: "QA", dial_code: "+974" },
      { name: "Romania", cca2: "RO", dial_code: "+40" },
      { name: "Russia", cca2: "RU", dial_code: "+7" },
      { name: "Rwanda", cca2: "RW", dial_code: "+250" },
      { name: "Saint Kitts and Nevis", cca2: "KN", dial_code: "+1-869" },
      { name: "Saint Lucia", cca2: "LC", dial_code: "+1-758" },
      { name: "Saint Vincent and the Grenadines", cca2: "VC", dial_code: "+1-784" },
      { name: "Samoa", cca2: "WS", dial_code: "+685" },
      { name: "San Marino", cca2: "SM", dial_code: "+378" },
      { name: "Sao Tome and Principe", cca2: "ST", dial_code: "+239" },
      { name: "Saudi Arabia", cca2: "SA", dial_code: "+966" },
      { name: "Senegal", cca2: "SN", dial_code: "+221" },
      { name: "Serbia", cca2: "RS", dial_code: "+381" },
      { name: "Seychelles", cca2: "SC", dial_code: "+248" },
      { name: "Sierra Leone", cca2: "SL", dial_code: "+232" },
      { name: "Singapore", cca2: "SG", dial_code: "+65" },
      { name: "Slovakia", cca2: "SK", dial_code: "+421" },
      { name: "Slovenia", cca2: "SI", dial_code: "+386" },
      { name: "Solomon Islands", cca2: "SB", dial_code: "+677" },
      { name: "Somalia", cca2: "SO", dial_code: "+252" },
      { name: "South Africa", cca2: "ZA", dial_code: "+27" },
      { name: "South Korea", cca2: "KR", dial_code: "+82" },
      { name: "South Sudan", cca2: "SS", dial_code: "+211" },
      { name: "Spain", cca2: "ES", dial_code: "+34" },
      { name: "Sri Lanka", cca2: "LK", dial_code: "+94" },
      { name: "Sudan", cca2: "SD", dial_code: "+249" },
      { name: "Suriname", cca2: "SR", dial_code: "+597" },
      { name: "Sweden", cca2: "SE", dial_code: "+46" },
      { name: "Switzerland", cca2: "CH", dial_code: "+41" },
      { name: "Syria", cca2: "SY", dial_code: "+963" },
      { name: "Taiwan", cca2: "TW", dial_code: "+886" },
      { name: "Tajikistan", cca2: "TJ", dial_code: "+992" },
      { name: "Tanzania", cca2: "TZ", dial_code: "+255" },
      { name: "Thailand", cca2: "TH", dial_code: "+66" },
      { name: "Timor-Leste", cca2: "TL", dial_code: "+670" },
      { name: "Togo", cca2: "TG", dial_code: "+228" },
      { name: "Tonga", cca2: "TO", dial_code: "+676" },
      { name: "Trinidad and Tobago", cca2: "TT", dial_code: "+1-868" },
      { name: "Tunisia", cca2: "TN", dial_code: "+216" },
      { name: "Turkey", cca2: "TR", dial_code: "+90" },
      { name: "Turkmenistan", cca2: "TM", dial_code: "+993" },
      { name: "Tuvalu", cca2: "TV", dial_code: "+688" },
      { name: "Uganda", cca2: "UG", dial_code: "+256" },
      { name: "Ukraine", cca2: "UA", dial_code: "+380" },
      { name: "United Arab Emirates", cca2: "AE", dial_code: "+971" },
      { name: "United States", cca2: "US", dial_code: "+1" },
      { name: "Uruguay", cca2: "UY", dial_code: "+598" },
      { name: "Uzbekistan", cca2: "UZ", dial_code: "+998" },
      { name: "Vanuatu", cca2: "VU", dial_code: "+678" },
      { name: "Vatican City", cca2: "VA", dial_code: "+379" },
      { name: "Venezuela", cca2: "VE", dial_code: "+58" },
      { name: "Vietnam", cca2: "VN", dial_code: "+84" },
      { name: "Yemen", cca2: "YE", dial_code: "+967" },
      { name: "Zambia", cca2: "ZM", dial_code: "+260" },
      { name: "Zimbabwe", cca2: "ZW", dial_code: "+263" }
  ];
  
  // initialize state with cca2 converted to flag emoji
  const [countries, setCountries] = useState<Country[]>(() =>
    rawCountries.map(c => ({ ...c, cca2: isoToFlag(c.cca2) }))
  );


  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReports: true,
    guestMessages: true,
  });
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    photoURL: '',
    dialCode: '',
    role: '',
  }); 
  
  const [property, setProperty] = useState({
    propertyName: '',
    propertyType: '', 
    numberOfRooms: 0,
    address: '',
    city: '',
    country: '',
    timezone: '',
  });
  
  const { userState} = useAuth();
  let docRef;



  const handleProfileChange = (value:string,to:any) => {
    setProfile((prev) => ({ ...prev, [to]: value }));
  }

  
  const updateProfilePhoto = () =>{

  }



  const submitProfileChanges = async (): Promise<void> => {
    if (userState?.id)  {
      
      
      try {
        docRef = doc(db,"users", userState?.id);
        await updateDoc(docRef, {
          fullName:profile.fullName,
          phoneNumber:profile.phoneNumber,
          dialCode:profile.dialCode,
          role:profile.role
        }).then(()=>{
          alert("Profile information updated!");
        });
      } catch (error) {
        alert(`Error updating preferences: ${error}`);
      }
    }  
    
  }

  const changeEmail = async () => {
    if (auth.currentUser) {
      const userObj = auth?.currentUser;

      try {
        // Step 1: Re-auth
        const currentPassword = prompt("Please enter your current password to confirm the email change:") as string
        const cred = EmailAuthProvider.credential(userObj?.email as string, currentPassword );
        await reauthenticateWithCredential(userObj, cred);

        // Step 2: Send verification to the new email
        await verifyBeforeUpdateEmail(userObj, profile.email);
        alert("Check your new email for a verification link, click it to proceed this change.");

        await signOut(auth).then(()=>{
          alert('You need to sign in with the new Email. A reset email has been sent to your email address.');
          document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        })

      } catch (err) {
        alert(err);
      }
    }
  }

  const submitNotificationChanges = async (): Promise<void> => {
    if (userState?.id)  {
      try {
        docRef = doc(db,"users", userState?.id);
        await updateDoc(docRef, {notifications:notifications}).then(()=>{
          alert("Notification preferences updated!");
        });
      } catch (error) {
        alert(`Error updating preferences: ${error}`);
      }
    }  
    
  }

  const submitPropertyChanges = async (): Promise<void> => {
    if (userState?.id)  {
      try {
        docRef = doc(db,"users", userState?.id);
        await updateDoc(docRef, {property:property}).then(()=>{
          alert("Property information updated!");
        });
      } catch (error) {
        alert(`Error updating preferences: ${error}`);
      }
    }  
    
  }
   
  const requestPasswordReset = async() => {
    try {
      await sendPasswordResetEmail(auth, profile?.email).then(async ()=>{

        alert("Password reset email sent!");
    
        await signOut(auth).then(()=>{
          alert('You need to sign in with the new password. A password reset email has been sent to your email address.');
          document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        })
      })
      
    } catch (error) {
      console.error("Error sending password reset email:", error);
      
    }
 } 
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(userState.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(()=>{
    const setData = async () => {
      if (!userState?.id) return 0;
      
      setNotifications(userState?.notifications );
      setProfile({          
        fullName: userState?.fullName,
        email: userState?.email,
        phoneNumber: userState?.phoneNumber ,
        photoURL: userState?.photoURL,
        dialCode: userState?.dialCode,
        role: userState?.role.toLowerCase(),
      });
      setProperty({
        propertyName: userState?.property?.propertyName,   
        propertyType: userState?.property?. propertyType,
        numberOfRooms: userState?.property?.numberOfRooms,
        address: userState?.property?.address,
        city: userState?.property?.city,
        country: userState?.property?.country,
        timezone: userState?.property?.timezone,
      });  

    }
    setData();

    
  },[userState])


  return (
    <div className='p-6 bg-[#FAFAFA] overflow-y-scroll max-h-9/10'>
        <div className=''>
            <h2 className="text-3xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <Tabs defaultValue="profile" className="w-full ">
          <TabsList className="bg-white mt-6 shadow-sm font-semibold">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 bg-white rounded-lg shadow">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details 
                  <code className="flex mt-5 items-center">
                    <>{userState.id}</>
                    <Button
                      size="sm"
                      variant="ghost"
                      className=" text-black hover:bg-black/10"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-2xl">
                      {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className='border border-gray-300 bg-gray-100 hover:bg-[#F5B700] hover:text-[#004E7C]'>Change Photo</Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" onChange={(e:any)=>handleProfileChange(e.target.value,'fullName')} defaultValue={profile?.fullName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" onChange={(e:any)=>handleProfileChange(e.target.value,'email')} type="email" defaultValue={profile?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" onChange={(e:any)=>handleProfileChange(e.target.value,'phoneNumber')}  type="tel" defaultValue={profile?.phoneNumber} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    {userState?.id && <Select onValueChange={(value:any)=>handleProfileChange(value,'role')} defaultValue={userState?.role?.toLowerCase()}>
                      <SelectTrigger className='py-5'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Dial Code</Label>
                    {userState?.id && <Select defaultValue={userState?.dialCode}    onValueChange={(value:any)=>handleProfileChange(value,'dialCode')}>
                      <SelectTrigger className='py-5'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                      {countries.map((item) => (
                        <SelectItem key={item.cca2} value={item.dial_code} title={item.name}>
                          {item.cca2} {item.dial_code ? `(${item.dial_code})` : ""}
                        </SelectItem>
                      ))}
                      </SelectContent>
                    </Select>}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={changeEmail} className="bg-orange-400 hover:from-blue-700 hover:to-teal-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Change Email
                  </Button>
                  <Button onClick={submitProfileChanges} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="mt-6 bg-white rounded-lg shadow">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Property Details
                </CardTitle>
                <CardDescription>Configure your hotel or B&B information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input onChange={(e:any)=>setProperty(prev=> ({ ...prev, propertyName: e.target.value }))} id="propertyName" defaultValue={property?.propertyName} placeholder="The Grand Boutique Hotel" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    {userState?.id &&<Select onValueChange={(value:any)=>setProperty(prev=> ({ ...prev, propertyType:value }))} defaultValue={userState?.property?.propertyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="bnb">B&B</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                      </SelectContent>
                    </Select>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Input onChange={(e:any)=>setProperty(prev=> ({ ...prev, numberOfRooms:Number (e.target.value) }))} id="rooms" type="number" placeholder='100' defaultValue={property?.numberOfRooms} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input onChange={(e:any)=>setProperty(prev=> ({ ...prev, address: e.target.value }))}  id="address" defaultValue={property?.address} placeholder="123 Ocean Drive, Brighton" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input onChange={(e:any)=>setProperty(prev=> ({ ...prev, city: e.target.value }))} id="city" placeholder="Brighton" defaultValue={property?.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {userState?.id &&<Select onValueChange={(value:any)=>setProperty(prev=> ({ ...prev, country:value }))}  defaultValue={userState?.property?.country}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                        <SelectItem value="us">🇺🇸 United States</SelectItem>
                        <SelectItem value="fr">🇫🇷 France</SelectItem>
                        <SelectItem value="es">🇪🇸 Spain</SelectItem>
                      </SelectContent>
                    </Select>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    {userState?.id && <Select onValueChange={(value:any)=>setProperty(prev=> ({ ...prev, timezone:value }))} defaultValue={userState?.property?.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value="gmt">GMT+0 London</SelectItem>
                        <SelectItem value="est">EST New York</SelectItem>
                        <SelectItem value="cet">CET Paris</SelectItem>
                      </SelectContent>
                    </Select>}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={submitPropertyChanges} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 bg-white rounded-lg shadow">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p>Email Alerts</p>
                    <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p>Push Notifications</p>
                    <p className="text-sm text-gray-500">Get real-time updates on your device</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p>Weekly Reports</p>
                    <p className="text-sm text-gray-500">Receive weekly analytics summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p>Guest Messages</p>
                    <p className="text-sm text-gray-500">Notify me when guests send new messages</p>
                  </div>
                  <Switch
                    checked={notifications.guestMessages}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, guestMessages: checked }))
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={submitNotificationChanges} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 bg-white rounded-lg shadow">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="text" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="text" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="text" placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p>Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button disabled variant="outline" className='hover:bg-[#F5B700] border border-gray-300 bg-gray-100 hover:bg-[#F5B700] hover:text-[#004E7C]'>Enable 2FA</Button>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={requestPasswordReset} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

    </div>
  )
}

export default Settings