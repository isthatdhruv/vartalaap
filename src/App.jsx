// import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext';
import Fr from './pages/FriendRequests/Fr';
const App = () => {
  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext);

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        navigate('/chat');
        // console.log(user);
        await loadUserData(user.uid);
      }else{
        navigate('/');
      }
    })
  },[])
  return(
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/FriendRequests" element={<Fr />} />
      </Routes>
    
    </>



  )


}
export default App;