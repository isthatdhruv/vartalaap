import React, { useContext, useEffect, useState } from "react";
import './Chat.css';
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ChatBox from "../../components/ChatBox/ChatBox";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { AppContext } from "../../context/AppContext";
import ClipLoader from "react-spinners/ClipLoader";
const Chat = () => {
    const {chatData , userData} = useContext(AppContext);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        if(userData && chatData){
            setLoading(false);
        }
    },[chatData,userData])
    return (
        <>
        {loading
        ?<div className="loading"><ClipLoader color="blue" loading={loading} size={100} margin={5}/></div>
        :<div className="chat-container">
            <LeftSidebar/>
            <ChatBox/>
            <RightSidebar/>

            </div>
        }
        </>
    );
}
export default Chat;