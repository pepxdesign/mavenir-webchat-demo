import React, { useEffect, useState } from 'react';
import './SimpleImage.css';
import PropTypes from 'prop-types';

const SimpleImage = props => {
  const { componentData } = props;
  const initialState = {
    componentData: {},
  };
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState({ ...state.componentData, componentData });
  }, []);

  const validUrlAction =
    state.componentData.urlAction && state.componentData.urlAction !== '';

  return (
    <div className="image-wrapper">
      {validUrlAction ? (
        <a href={state.componentData.urlAction} target="_blank">
          <img
            src={state.componentData.mediaUrl}
            alt=""
            className="brandLogo"
          />
        </a>
      ) : (
        <img src={state.componentData.mediaUrl} alt="" className="brandLogo" />
      )}
    </div>
  );
};

SimpleImage.propTypes = {
  componentData: PropTypes.object,
};

export default SimpleImage;
