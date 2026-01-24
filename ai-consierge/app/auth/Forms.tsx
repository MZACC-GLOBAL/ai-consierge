"use client";
import { Eye,EyeClosed, FlagIcon, Globe, Hotel, Phone, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import axios from "axios";

type Country = {
	name: string;
	cca2: string; // ISO2
	dial_code: string; // e.g. +1
};



// Add a full list of countries with ISO2 and international dialing codes.
// Exported so other modules/components can import and use it if desired.


const SignUp = ({formToShow, toggleForm}:any) => {
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
    const [selectedIso, setSelectedIso] = useState<string>("");
    const [selectedDialCode, setSelectedDialCode] = useState<string>("");
    const [displayPassword,setVisibility ] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [country, setCountry] = useState<any>("");
    const [city, setCity] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

	// update when user picks a country option
	const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const iso = e.target.value;
        console.log(e.target.value);
        
		setSelectedIso(iso);
		const found = countries.find((c) => c.cca2 === iso);
		setSelectedDialCode(found?.dial_code || "");
	};

	// update when user picks a dial-code option (sync iso when possible)
	const updateDialCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
            
		const dial = e.target.value;
        const cname = e.target.options[e.target.selectedIndex].title
		setSelectedDialCode(dial);
        setCountry(rawCountries.find(countries=>countries.dial_code == dial && countries.name == cname)?.name)
       
		// try to find a country that matches this dial code and sync iso
		    
		const found = countries.find((c) => c.dial_code === dial && c.name == cname);
		if (found) setSelectedIso(found.cca2);
		else setSelectedIso("");
	};


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    

    const handlePasswordInputChange = (e:any) => {
      const value = e.target.value;
      setPassword(value);

      if (!passwordRegex.test(value)) {
      setError("Password must have: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.");
      } else {
      setError("");
      }
    };

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const date = new Date().getTime()
        await createUserWithEmailAndPassword(auth,email,password).then(async (res)=>{
  
            const docRef = doc(db,'users',res.user.uid);
            await setDoc(docRef,{joined:date,messageCount:0,fullName:name,email:email,dialCode:selectedDialCode,phoneNumber:number,country:country,city:city,plan:null,photoURL:null,role:'staff',isAdmin:false,property:{propertyName:'',propertyType:'hotel',numberOfRooms:0,address:'',city:'',country:'uk',timezone:'gmt'},subscriptionStatus:'inactive',widgetSettings:{widgetPosition:'bottom-right',widgetColor:'#004E7C',welcomeMsg:'👋 Welcome! How can I assist you today?',defaultLanguage:'en'},notifications:{emailAlerts: true, pushNotifications: true, weeklyReports: true, guestMessages: true},users:[]}).then(async ()=>{
                const token = await res.user.getIdToken();
                await axios.post('/api/auth/login',{token,email:email},{headers:{"Content-Type":"application/json"}})
                .then((res)=>{
                    alert(res.data.status);
                    router.push('/dashboard/onboarding');
                })
            })
        })
        .catch((err)=>{
            alert(err)
        })
    };
    
   

	return (
        <div className="pt-8">
            {/* header */}
            <div className="space-y-4 text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <img src="/plain-logo.jpg"/>
                </div>
				
                <div>
                    <p className="text-3xl text-[#004E7C]">AI Concierge</p>
                    <p className="mt-2 text-gray-600">{formToShow ? 'Create your account to get started' : 'Welcome back! Please sign in'}</p>
                </div>
            </div>
            {/* body */}
            <form action="POST" onSubmit={signUp} className="mb-5"> 
                {/* name */}
                <div className="flex flex-col mb-4">
                    <label htmlFor="fullName" className="text-sm font-medium mb-2">Full Name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required type="text" pattern="[A-Za-zÀ-ÖØ-öø-ÿ' \-]{2,50}" id="fullName" placeholder="John Smith" className="inputStyle h-11 p-2 rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                </div>
                {/* email */}
                <div className="flex flex-col mb-4">
                    <label htmlFor="email" className="text-sm font-medium mb-2">Email Address</label>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email"  id="email" placeholder="your@email.com" className="inputStyle h-11 p-2 rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                </div>
    
                {/* phone  */}
                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="text-sm font-medium flex mb-2"><Phone className="mr-2 w-4 h-4" /> Phone Number</label>
                    <div style={{ display: "flex", gap: 8 }}>
                       
                        <select  required className="inputStyle h-11 p-2 rounded-lg w-29"   onChange={updateDialCode}>
                            <option value=""> Select dial code</option>
                            {countries.map((item) => (
                                    <option key={item.cca2} value={item.dial_code} title={item.name}>
                                        {item.cca2} {item.dial_code ? `(${item.dial_code})` : ""}
                                    </option>
                                ))}
                        </select>
                        <input value={number} onChange={(e)=>setNumber(e.target.value)}  pattern="\d{5,}" required type="text" id="phoneNumber" placeholder='1234' className="inputStyle w-full h-11 p-2 rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                    </div>
                </div>



                {/* country */}
                <div className="flex flex-col mb-4">
                    <label htmlFor="country" className="text-sm font-medium mb-2 flex items-center"><Globe className="mr-2 w-4 h-4" /> Country <p className="text-xs text-teal-600 ml-2">(auto-detected)</p></label>

                    <select value={selectedIso} className="inputStyle h-11 p-2 rounded-lg" name="country" id="country"   disabled>
                        {countries.map((item) => (
                            <option key={item.cca2} value={item.cca2}>
                                {item.cca2}  {item.name} {item.dial_code ? `(${item.dial_code})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
                {/* city */}
                <div className="flex flex-col mb-4">
                    <label htmlFor="city" className="text-sm font-medium mb-2">City (optional)</label>
                    <input value={city} onChange={(e)=>setCity(e.target.value)} minLength={2} type="text" id="city" placeholder="London" className="inputStyle h-11 p-2 rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60"/>
                </div>

                <div className="flex flex-col mb-4">
                    <label htmlFor="password" className="text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      {displayPassword?<Eye onClick={()=>setVisibility((state)=>!state)} size={30} strokeWidth={1} className="absolute top-2 left-1 "/>:<EyeClosed onClick={()=>setVisibility((state)=>!state)} size={30} strokeWidth={1} className="absolute top-2 left-1 "/>}
                      <input value={password} onChange={handlePasswordInputChange}  required pattern="(?=.*[A-Za-z])(?=.*\d).{8,}" type={displayPassword?"text":"password" }id="password" placeholder="••••••••" className="inputStyle h-11 p-2 pl-10 w-full  rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                      <p className="text-red-500 w-70  text-sm">{error}</p>
                    </div>
                </div>
				<div className="my-4 text-center">
					<p>i accept all terms and conditions <input className="ml-3" type="checkbox" required/></p>
				</div>
                {/* submit btn */}
                <button className="rounded-lg w-full h-11 bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white shadow-lg transition-all duration-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-3" />
                    <p className="text-sm font-medium">Create Account</p>
                </button>
            </form>
            {/* footer */}
            <hr className="my-4  border-gray-300" />
            <p className="text-center text-gray-600">{formToShow?'Already have an account?':`Don't have an account?`} <button className="text-[#004E7C]" onClick={()=>toggleForm(!formToShow)}> {formToShow?'Sign In':'Sign Up'}</button></p>
			<p className="text-center text-gray-600 mt-2 underline" onClick={()=>router.push("/terms-and-conditions")}>Terms And Conditions</p>
        </div>
	);
};

const SignIn = ({formToShow, toggleForm}:any) => {
    const [displayPassword,setVisibility ] = useState(false)

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

   const handleChange = (e:any) => {
      const value = e.target.value;
      setPassword(value);

      if (!passwordRegex.test(value)) {
      setError("Password must have: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.");
      } else {
      setError("");
      }
    };
   
    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth,email,password).then(async (userData)=>{
          
          
           const token = await userData.user.getIdToken();
           await axios.post('/api/auth/login',{token},{headers:{"Content-Type":"application/json"}})
           .then((res)=>{
             alert(res.data.status);
             router.push("/dashboard/analytics")
           })
        })
        .catch((err)=>{
           alert(err)
        });


        //
    };
    
	const forgotPassword = async() => {
		const userEmail = prompt('Enter your account email') as string
		try {
		  await sendPasswordResetEmail(auth,userEmail).then(async ()=>{
			alert("Password reset email sent!");
		  })
		  
		} catch (error) {
		  alert(`Error sending password reset email:, ${error}`);
		  
		}
	 } 
	return (
		<div>
            {/* header */}
            <div className="space-y-4 text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <img src="/plain-logo.jpg"/>
                </div>
                <div>
                    <p className="text-3xl text-[#004E7C]">AI Concierge</p>
                    <p className="mt-2 text-gray-600">{formToShow ? 'Create your account to get started' : 'Welcome back! Please sign in'}</p>
                </div>
            </div>
            {/* body */}
			<form action="POST" onSubmit={signIn}>
				<div className="flex flex-col mb-4">
                    <label htmlFor="email" className="text-sm font-medium mb-2">Email Address</label>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" id="email" placeholder="your@email.com" className="inputStyle h-11 p-2 rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="password" className="text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      {displayPassword?<Eye onClick={()=>setVisibility((state)=>!state)} size={30} strokeWidth={1} className="absolute top-2 left-1 "/>:<EyeClosed onClick={()=>setVisibility((state)=>!state)} size={30} strokeWidth={1} className="absolute top-2 left-1 "/>}
                      <input value={password} onChange={handleChange}  required pattern="(?=.*[A-Za-z])(?=.*\d).{8,}" type={displayPassword?"text":"password" }id="password" placeholder="••••••••" className="inputStyle h-11 p-2 pl-10 w-full  rounded-lg transition focus:border-black focus:border focus:outline-none focus:ring-4 focus:ring-[#004e7c96] focus:ring-opacity-60" />
                      <p className="text-red-500 w-70 mt-4 text-sm">{error}</p>
                    </div>
                </div>
                <button onClick={forgotPassword} className="float-right text-teal-600 mb-4">Forgot password?</button>
                {/* submit btn */}
                <button className="rounded-lg w-full h-11 bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white shadow-lg transition-all duration-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-3" />
                    <p className="text-sm font-medium">sign in</p>
                </button>
			</form>
            {/* footer */}
            <hr className="my-4 border-t border-gray-300" />
            <p className="text-center text-gray-600">{formToShow?'Already have an account?':`Don't have an account?`} <button className="text-[#004E7C]" onClick={()=>toggleForm(!formToShow)}> {formToShow?'Sign In':'Sign Up'}</button></p>
		</div>
	);
};


const FormToggler = ({}) =>{
    const[isSignUp,setPage] = useState(true)
    
    return  (
        isSignUp?<SignUp formToShow={isSignUp} toggleForm={setPage}/>:<SignIn formToShow={isSignUp} toggleForm={setPage}/>
    )
}


export default FormToggler
