"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";



const AuthContext = createContext(null);

export default function AuthProvider({ children }:any) {
  const [userState, setUser] = useState({email:""} as any);
  const router = useRouter();
  let ref;
  useEffect(  () => {
    const unsubscribe = onAuthStateChanged(auth,async (userObj:any) => {
      if (userObj) {     
        window.location.pathname ==='/auth' && router.push("/dashboard/analytics");
        try {
          ref = doc(db, "users", userObj.uid);
          const snapshot = await getDoc(ref); 
          if (snapshot.exists()) {
            setUser({...snapshot.data(),id:snapshot.id});      
          }
        } 
        catch (error) {         
          alert(error)
        }
      } else {
        
       ( window.location.pathname !=='/auth' &&  window.location.pathname !=='/widget-ui' && window.location.pathname !=='/terms-and-conditions') && router.push('/auth')
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    const updateEmailInFirestore = async () => {
      ref = doc(db, "users", auth?.currentUser?.uid as string);
      await updateDoc(ref, {email:auth?.currentUser?.email}).then(()=>{
        alert("Email updated!");
      }).catch((err)=>{
        alert('Error implementing email change on document!');
      });
    }
    if (auth.currentUser?.email && userState?.email) {
      if(userState?.email !== auth.currentUser.email){
        updateEmailInFirestore();
      } 
    }
  }, [userState]);
  return (
    <AuthContext.Provider value={{ userState} as any}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth :any = () => useContext(AuthContext);