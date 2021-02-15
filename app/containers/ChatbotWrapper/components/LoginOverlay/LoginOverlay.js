import React from 'react';
import './LoginOverlay.css';
import PropTypes from 'prop-types';

const LoginOverlay = props => {
  const { onClick } = props;

  const handleOnClick = () => {
    onClick();
  };

  return (
    <div className="overlay-wrapper">
      <p>Click to Login</p>
      <button type="button" onClick={handleOnClick}>
        Login
      </button>
    </div>
  );
};

LoginOverlay.propTypes = {
  onClick: PropTypes.func,
};

export default LoginOverlay;
