import React, { useContext, useEffect} from "react";
import assets from "../../assets/assets";
import './ChatBox.css';
import { AppContext } from "../../context/AppContext";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { db , storage} from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { getDownloadURL, ref } from "firebase/storage";

const ChatBox = () => {
    const {userData , messagesId , messages , chatUser , setMessages ,chatVisual , setChatVisual} = useContext(AppContext);

    const [input,setInput] = React.useState('');

    const sendMessage = async()=>{
        try {
            if(input && messagesId){
                await updateDoc(doc(db,"messages",messagesId),{
                    messages: arrayUnion({
                        sId:userData.id,
                        text:input,
                        createdAt:Timestamp.now(),
                    })
                
                })

                const userIDs = [chatUser.rId ,userData.id];

                userIDs.forEach(async(id)=>{
                    const userChatsRef = doc(db,"chats",id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                
                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((chat)=>chat.messageId===messagesId);
                        userChatData.chatData[chatIndex].lastMessage = input.slice(0,30);
                        userChatData.chatData[chatIndex].updatedAt = Date.now();

                        if(userChatData.chatdata[chatIndex].rId === userData.id){
                            userChatData.chatData[chatIndex].messageSeen= false;
                        }
                        await updateDoc(userChatsRef,{
                            chatData:userChatData.chatData
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
    const sendImage = async(e)=>{
        try {
            const fileUrl=await upload(e.target.files[0]);

            if(fileUrl&&messagesId){
                await updateDoc(doc(db,"messages",messagesId),{
                    messages: arrayUnion({
                        sId:userData.id,
                        image:fileUrl,
                        createdAt:Timestamp.now(),
                    })
                
                })
                const userIDs = [chatUser.rId ,userData.id];

                userIDs.forEach(async(id)=>{
                    const userChatsRef = doc(db,"chats",id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                
                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((chat)=>chat.messageId===messagesId);
                        userChatData.chatData[chatIndex].lastMessage = "image";
                        userChatData.chatData[chatIndex].updatedAt = Date.now();

                        if(userChatData.chatdata[chatIndex].rId === userData.id){
                            userChatData.chatData[chatIndex].messageSeen= false;
                        }
                        await updateDoc(userChatsRef,{
                            chatData:userChatData.chatData
                        })
                    }
                
                })

            }
        } catch (error) {
            toast.error(error.message);
            
        }

    }
    // const handleImageDownload = async (imageUrl) => {
    //     try {
    //       const imageRef = ref(storage, imageUrl);
    //       const downloadUrl = await getDownloadURL(imageRef);
    
    //       const link = document.createElement("a");
    //       link.href = downloadUrl;
    //       link.setAttribute("download", "image.jpg"); // Or get the image name from imageUrl
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     } catch (error) {
    //       console.error("Error downloading image:", error);
    
    //       toast.error("Failed to download image.");
    //     }
    //   };




    const convertTime = (time) => {
        let date = time.toDate(); // Convert Firestore timestamp to Date object
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; 
    
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
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
    },[messagesId, setMessages])




    return chatUser?(
        <div className={`chat-box ${chatVisual?"":"hidden"}`}>
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt="" />
                <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <=70000 ? <img src={assets.green_dot} className="dot" alt="" /> : null}</p>
                <img src={assets.help_icon} alt="" className="help" />
            </div>
            <div className="chat-msg">
                {messages.map((msg,index)=>(
                    <div key={index} className={msg.sId === userData.id ? "s-msg":"r-msg"}> 
                    <div> {/* Moved this div to the beginning */}
                        {/* <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" className="msg-avatar" /> */}
                        <p>{convertTime(msg.createdAt)}</p>
                    </div>
                    {msg["image"]
                        ? <img src={msg.image} alt="" className="msg-image" onClick={()=>{window.open(msg.image)}} />
                        : <p className="msg">{msg.text}</p>
                    }
                </div>

                ))}
            </div>
            <div className="chat-input">
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Type a message..." />
                <input onChange={sendImage} type="file" id="image" accept="image/png , image/jpeg" hidden/>
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="" />
            </div>
        </div>
    ):(
        <div className={`chat-welcome ${chatVisual?"":"hidden"}`}>
            <img src={assets.logo_icon} alt="" />
            <p>Start a Chat</p>
        </div>

    )
}
export default ChatBox;