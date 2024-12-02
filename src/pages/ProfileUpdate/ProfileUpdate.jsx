import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
// import setUserData from "../../lib/setUserData";
const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = React.useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData}=useContext(AppContext);
  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile Picture First");
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        try {
          const imgUrl = await upload(image);
          setPrevImage(imgUrl);
          await updateDoc(docRef, {
            avatar: imgUrl,
            bio: bio,
            name: name,
          });
        } catch (error) {
            console.error(error);
            toast.error("error uploading image");
        }
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile Updated Successfully");
      navigate("/chat");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          setUid(user.uid);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.data().name) {
            setName(docSnap.data().name);
          }
          if (docSnap.data().bio) {
            setBio(docSnap.data().bio);
          }
          if (docSnap.data().avatar) {
            setPrevImage(docSnap.data().avatar);
          }
        } else {
          navigate("/");
        }
      },
      []
    );
  });
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png , .jpg , .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Username"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Bio"
            required
          ></textarea>
          <button type="submit">Update</button>
        </form>
        <img
          src={image ? URL.createObjectURL(image) : prevImage?prevImage:assets.logo_icon}
          className="profile-pic"
          alt=""
        />
      </div>
    </div>
  );
};
export default ProfileUpdate;
