import React, { useContext, useState, useEffect } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
1;
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setChatData, setChatUser, setMessagesId , chatVisual,setChatVisual } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu); // Toggle the state on click
  };
  useEffect(() => {
    // Create a copy of chatData to avoid modifying the original state directly
    const uniqueUsers = [];
    const seenIds = new Set();

    for (const user of chatData) {
      if (!seenIds.has(user.rId)) {
        uniqueUsers.push(user);
        seenIds.add(user.rId);
      }
    }

    // Check if there are any duplicates before updating the state
    if (uniqueUsers.length !== chatData.length) {
      setChatData(uniqueUsers);
    }
  }, [chatData,setChatData]);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      setSearchResults(true);
      if (input) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase())); // Make sure usernames are stored in lowercase
        const querySnap = await getDocs(q);

        console.log(querySnap.docs); // Log the query results

        if (!querySnap.empty) { // Removed the userData.id check
          // Removed the userExists condition
          setUser(querySnap.docs[0].data()); 
        } else if (querySnap.empty) {
          console.log("No user found");
          setUser(null);
        }
      } else {
        setSearchResults(false);
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
  
    try {
      // 1. Check if the user already exists in the friends list
      const userExists = chatData.some((chat) => chat.rId === user.id);
  
      if (userExists) {
        toast.info("This user is already in your friends list!");
        return;
      }
  
      // 2. If the user doesn't exist, proceed with creating the chat
      const chatQuery = query(
        chatRef,
        where("chatData", "array-contains-any", [
          { rId: userData.id, messageId: user.id },
          { rId: user.id, messageId: userData.id },
        ])
      );
  
      const chatSnapshot = await getDocs(chatQuery);
      if (!chatSnapshot.empty) {
        console.log("Chat already exists!");
        toast.error("Chat already exists!");
        return;
      } else {
        const newMessageRef = doc(messagesRef);
        await setDoc(newMessageRef, {
          createAt: serverTimestamp(),
          messages: [],
        });
        await updateDoc(doc(chatRef, user.id), {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: userData.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
        await updateDoc(doc(chatRef, userData.id), {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: user.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
    setChatVisual(true);
  };

  return (
    <div className={`ls ${chatVisual?"hidden":""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img onClick={toggleMenu} src={assets.menu_icon} alt="" />
            {showMenu && ( // Correct conditional rendering 
              <div className="sub-menu">
                <p onClick={() => navigate("/profile")}>Edit Profile</p>
                <hr />
                <p onClick={()=>navigate("/FriendRequests")} >Friend Requests</p> {/* Add logout functionality here */}
              </div>
            )} 
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
            <div className="friends add-user">
              <img src={user.avatar} alt="" />
              <p>{user.username}</p>
              <button className="add" onClick={addChat}>
                Add Friend
              </button>
            </div>
          ) : (
            chatData.map((item, index) => (
              <div
                key={index}
                onClick={() => setChat(item)}
                className="friends"
              >
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
