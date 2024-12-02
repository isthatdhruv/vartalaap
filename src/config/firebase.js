// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtpWSV0VvIgeUGboc06tT2HvRpKqvjwa8",
  authDomain: "vartalaap-b47df.firebaseapp.com",
  projectId: "vartalaap-b47df",
  storageBucket: "vartalaap-b47df.firebasestorage.app",
  messagingSenderId: "172207932045",
  appId: "1:172207932045:web:bbf42f54a5e41af81318c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username,email,password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user= res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey im using Vartalaap",
            lastSeen:Date.now()
        });
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        });
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
        
    }
}
const login = async(email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
        
    }
}
const logout = async()=>{
    try{
        await signOut(auth);
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}
export {signup,login,logout,auth,db};