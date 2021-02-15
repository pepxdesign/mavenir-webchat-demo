import React from 'react';
import './Overlay.css';
import icon from '../../../../images/reconnecting.gif';

const Overlay = () => (
  <div className="overlay-wrapper">
    <img src={icon} alt="reconnecting icon" />
    <p>Reconnecting</p>
  </div>
);

export default Overlay;
