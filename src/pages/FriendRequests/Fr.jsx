import React from "react";
import "./Fr.css";
import assets from "../../assets/assets";

const Fr = () => {
  return (
    <div className="fr">
      <div className="fr-box">
        <h1>Friend Requests</h1>
        <hr/>
        <div className="fr-list">
          <div className="friends add-user">
            <img src={assets.avatar_icon} alt="" />
            <p>username</p>
            <div className="buttons">
                <img src={assets.tick} alt=""/>
                <img src={assets.cross} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Fr;
