import React from 'react';
import './RichCard.css';
import PropTypes from 'prop-types';

const RichCard = props => {
  const { options } = props;
  return (
    <div className="rich-card-wrapper">
      <div className="rich-card-inner">
        <div className="rich-card-image-wrapper">
          <img src={options[0].img_src} alt="" />
        </div>
        <div className="rich-card-text-wrapper">
          <h2>{options[0].product}</h2>
          <p>{ `$${  options[0].price}`}</p>
          <p>{ `x${  options[0].amount}`}</p>
          <p className={'total'}><span>Total:</span> $99.98</p>
        </div>
      </div>
    </div>
  );
}

RichCard.propTypes = {
  options: PropTypes.array,
};

export default RichCard;
