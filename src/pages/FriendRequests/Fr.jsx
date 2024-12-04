import React from "react";
import "./Fr.css";
import assets from "../../assets/assets";

const Fr = () => {
  return (
    <div className="fr">
      <div className="fr-box">
        <h1>Friend Requests</h1>
        <hr />
        <div className="fr-list">
            <div className="fr-item">
                <img src={assets.avatar_icon} alt="user1" />
                <h2>John Doe</h2>
                <p>bio</p>
                <div className="friend-btn">
                    <button className="fr-btn1">Accept</button>
                    <button className="fr-btn2">Reject</button>
                </div>
          </div>
          <div className="fr-item">
                <img src={assets.avatar_icon} alt="user1" />
                <h2>John Doe</h2>
                <p>bio</p>
                <div className="friend-btn">
                    <button className="fr-btn1">Accept</button>
                    <button className="fr-btn2">Reject</button>
                </div>
          </div>
          <div className="fr-item">
                <img src={assets.avatar_icon} alt="user1" />
                <h2>John Doe</h2>
                <p>bio</p>
                <div className="friend-btn">
                    <button className="fr-btn1">Accept</button>
                    <button className="fr-btn2">Reject</button>
                </div>
          </div>
          <div className="fr-item">
                <img src={assets.avatar_icon} alt="user1" />
                <h2>John Doe</h2>
                <p>bio</p>
                <div className="friend-btn">
                    <button className="fr-btn1">Accept</button>
                    <button className="fr-btn2">Reject</button>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Fr;
