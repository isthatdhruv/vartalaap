import React, { useContext, useEffect } from "react";
import './RightSidebar.css';
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
    const [currState,setCurrState]=React.useState('friend');
     

    const {chatUser,messages}=useContext(AppContext);
    const [msgImages,setMsgImages]=React.useState([]);

    useEffect(()=>{
        let tempVar=[];
        messages.map((msg)=>{
            if(msg.image){
                tempVar.push(msg.image);
            }
        })
        setMsgImages(tempVar);
        
    },[messages])




    return chatUser ? (
        <div className="rs">
            <div className="rs-profile">
                <img src={chatUser.userData.avatar} alt="" />
                <h3>{chatUser.userData.name}{Date.now()-chatUser.userData.lastSeen <=70000 ? <img src={assets.green_dot} className="dot" alt="" /> : null}</h3>
                <p>{chatUser.userData.bio}</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div className="rs-media-list">
                    {msgImages.map((url,index)=>(<img onClick={()=>{window.open(url)}} key={index} src={url} alt=''/>))}
                    {/* <img src={assets.pic1} alt="" />
                    <img src={assets.pic2} alt="" />
                    <img src={assets.pic3} alt="" />
                    <img src={assets.pic4} alt="" />
                    <img src={assets.pic1} alt="" />
                    <img src={assets.pic2} alt="" /> */}
                </div>
            </div>
            {currState === 'friend' ? (<button onClick={()=>setCurrState('unfriend')} className="">Remove Friend</button>):(<button onClick={()=>setCurrState('friend')} className="">Add Friend</button>)}
        </div>
    ):(
        <div className="rs">
            {currState === 'friend' ? (<button onClick={()=>setCurrState('unfriend')} className="">Remove Friend</button>):(<button onClick={()=>setCurrState('friend')} className="">Add Friend</button>)}
            
        </div>
    )
};

export default RightSidebar;