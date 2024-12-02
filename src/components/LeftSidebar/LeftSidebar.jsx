import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
// import { CSSProperties } from "react";


const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData ,chatData , chatUser ,setChatUser,setMessagesId,messagesId} = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      setSearchResults(true);
      if (input) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist=false;
          chatData.map((user)=>{
            if(user.rId===querySnap.docs[0].data().id){
              userExist=true;
            }
          })
          if(!userExist){
            setUser(querySnap.docs[0].data());
            
          }
          setUser(querySnap.docs[0].data());
          
        } else if (querySnap.empty) {
          console.log("No user found");
          
        }
      }else{
        setSearchResults(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addChat = async () => {
    const messagesRef = collection(db,"messages");
    const chatRef = collection(db, "chats");
    try {
        const newMessageRef = doc(messagesRef);
        await setDoc(newMessageRef,{
            createAt:serverTimestamp(),
            messages:[]
        });
        await updateDoc(doc(chatRef,user.id),{ 
            chatData:arrayUnion({
                messageId:newMessageRef.id,
                lastMessage:"",
                rId:userData.id,
                updatedAt:Date.now(),
                messageSeen:true
            })
        });
        await updateDoc(doc(chatRef,userData.id),{ 
            chatData:arrayUnion({
                messageId:newMessageRef.id,
                lastMessage:"",
                rId:user.id,
                updatedAt:Date.now(),
                messageSeen:true
            })
        });
    } catch (error) {
        toast.error(error.message);
        console.error(error);
    }

    
  }
  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
    

  }
  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Edit Profile
              </p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search or start a new chat"
          />
        </div>
        <div className="ls-list">
          {searchResults && user ? (
            <div onClick={addChat} className="friends add-user">
              <img src={user.avatar} alt="" />
              <p>{user.username}</p>
            </div>
          ) : (
              chatData.map((item, index) => (
                <div key={index} onClick={()=>setChat(item)} className="friends">
                  <img src={item.userData.avatar} alt="" />
                  <div>
                    <p>{item.userData.name}</p>
                    <span>{item.lastMessage}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
export default LeftSidebar;
