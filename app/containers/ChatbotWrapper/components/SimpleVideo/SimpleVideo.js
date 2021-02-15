import React, { useEffect, useState } from 'react';
import './SimpleVideo.css';
import PropTypes from 'prop-types';

const SimpleVideo = props => {
  const { componentData } = props;
  const initialState = {
    componentData: {},
  };
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState({ ...state.componentData, componentData });
  }, []);

  // const validUrlAction = componentData.urlAction && componentData.urlAction !== '';

  return (
    <div className="image-wrapper">
      <video width="320" height="240" controls>
        <source
          src={state.componentData.mediaUrl}
          type={state.componentData.mediaContentType}
        />
      </video>
    </div>
  );
};

SimpleVideo.propTypes = {
  componentData: PropTypes.object,
};

export default SimpleVideo;
