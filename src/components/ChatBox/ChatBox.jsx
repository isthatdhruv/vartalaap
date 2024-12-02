import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import './ChatBox.css';
import { AppContext } from "../../context/AppContext";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
    const {userData , messagesId , messages , chatUser , setMessages } = useContext(AppContext);

    const [input,setInput] = useState('');

    const sendMessage = async()=>{
        try {
            if(input && messagesId){
                await updateDoc(doc(db,"messages",messagesId),{
                    messages: arrayUnion({
                        sId:userData.id,
                        text:input,
                        createdAt:new Date()
                    })
                
                })

                const userIDs = [chatUser.rId ,userData.id];

                userIDs.forEach(async(id)=>{
                    const userChatsRef = doc(db,"chats",id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                
                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((chat)=>chat.messageId===messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0,30);
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();

                        if(userChatData.chatsdata[chatIndex].rId === userData.id){
                            userChatData.chatsData[chatIndex].messageSeen= false;
                        }
                        await updateDoc(userChatsRef,{
                            chatsData:userChatData.chatsData
                        })
                    }
                
                })
                
            
            }
        }catch (error) {
        console.error(error);
        toast.error(error.message);
        }
        setInput('');
    }
    const convertTime = (time) =>{
        let date =time.toDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if(hours>12){
            return hours-12 + ':' + minutes +'PM';
        }
    }
    useEffect(()=>{
        if(messagesId){
            const msgRef = doc(db,"messages",messagesId);
            const unSub = onSnapshot(msgRef,(res)=>{
                setMessages(res.data().messages.reverse());
                // console.log(res.data().messages.reverse());
            })
            return ()=>{
                unSub();
            }
        }
    },[messagesId])




    return chatUser?(
        <div className="chat-box">
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt="" />
                <p>{chatUser.userData.name}<img src={assets.green_dot} className="dot" alt="" /></p>
                <img src={assets.help_icon} alt="" className="help" />
            </div>
            <div className="chat-msg">
                {messages.map((msg,index)=>(
                    <div key={""} className={msg.sId === userData.id ? "s-msg":"r-msg"}>
                        <p className="msg">{msg.text}</p>
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" className="msg-avatar" />
                            <p>{convertTime(msg.createdAt)}</p>
                        </div>
                    </div>

                ))}
            </div>
            <div className="chat-input">
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Type a message..." />
                <input type="file" id="image" accept="image/png , image/jpeg" hidden/>
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="" />
            </div>
        </div>
    ):(
        <div className="chat-welcome">
            <img src={assets.logo_icon} alt="" />
            <p>Start a Chat</p>
        </div>

    )
}
export default ChatBox;