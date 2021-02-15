import React from 'react';
import './ImageCard.css';
import PropTypes from 'prop-types';

const ImageCard = props => {
  const handleOnClick = () => {
    props.onClick(props.id, props.id, props.title);
  };

  return (
    <div className="card-wrapper">
      <div className="card-inner">
        <div className="card-image-wrapper">
          <img src={props.img_src} alt="" />
        </div>
        <div className="text-wrapper">
          <button
            type="button"
            onClick={handleOnClick}
            disabled={props.isDisabled}
          >
            {props.title}
          </button>
          <p>{props.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

ImageCard.propTypes = {
  onClick: PropTypes.func,
  img_src: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  messageData: PropTypes.string,
  // actionProvider: PropTypes.object
};

export default ImageCard;
