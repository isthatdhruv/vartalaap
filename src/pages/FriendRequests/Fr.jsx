import React, { useContext, useEffect, useState } from "react";
import "./Fr.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
const Fr = () => {
  const { userData, setChatData } = useContext(AppContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const friendRequestsRef = doc(db, "friendRequests", userData.id);
      const unsubscribe = onSnapshot(friendRequestsRef, async (snapshot) => {
        if (snapshot.exists()) {
          const requestsData = snapshot.data().requests;
          const users = [];

          for (const userId of requestsData) {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            users.push(userSnap.data());
          }

          setRequests(users);
        } else {
          setRequests([]);
        }
      });

      return () => unsubscribe();
    };

    if (userData) {
      fetchRequests();
    }
  }, [userData]);

  const handleAccept = async (userId) => {
    // 1. Create a new chat between the users (similar to your existing addChat logic)
    const messagesRef = collection(db, "messages");
    const chatRef = collection(db, "chats");

    try {
      const chatQuery = query(
        chatRef,
        where("chatData", "array-contains-any", [
          { rId: userData.id, messageId: userId },
          { rId: userId, messageId: userData.id },
        ])
      );

      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        toast.error("Chat already exists!");
        return;
      } else {
        const newMessageRef = doc(messagesRef);
        await setDoc(newMessageRef, {
          createAt: serverTimestamp(),
          messages: [],
        });

        await updateDoc(doc(chatRef, userId), {
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
            rId: userId,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }

    // 2. Remove the request from the friendRequests document
    const friendRequestsRef = doc(db, "friendRequests", userData.id);
    await updateDoc(friendRequestsRef, {
      requests: arrayRemove(userId),
    });
  };

  const handleReject = async (userId) => {
    // Remove the request from the friendRequests document
    const friendRequestsRef = doc(db, "friendRequests", userData.id);
    await updateDoc(friendRequestsRef, {
      requests: arrayRemove(userId),
    });
  };

  return (
    <div className="fr">
      <div className="fr-box">
        <h1>Friend Requests</h1>
        <hr />
        <div className="fr-list">
          {requests.map((user, index) => (
            <div key={index} className="fr-item">
              <img src={user.avatar} alt={user.username} />
              <h2>{user.username}</h2>
              <p>{user.bio}</p>
              <div className="friend-btn">
                <button
                  className="fr-btn1"
                  onClick={() => handleAccept(user.id)}
                >
                  Accept
                </button>
                <button
                  className="fr-btn2"
                  onClick={() => handleReject(user.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Fr;
