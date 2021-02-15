import React, { useEffect, useState, useRef } from 'react';
import { map, isEqual } from 'lodash';
// import {
//   ButtonBack,
//   ButtonNext,
//   CarouselProvider,
//   Slide,
//   Slider,
// } from 'pure-react-carousel';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import './styles.css';

import { createStructuredSelector } from 'reselect';
import { setOptionSelected } from '../../actions';
import { getMessageHistory, getOptionSelected } from '../../selectors';

// import './Carousel.css';
// import './styles.css';
import ImageCard from '../ImageCard/ImageCard';

const Carousel = props => {
  const initialState = {
    disabled: false,
  };
  const [state, setState] = useState(initialState);
  const {
    options,
    onSendMessage,
    actionProvider,
    onSetOptionSelected,
    hasMessageHistory,
  } = props;

  // const sendMessageToServer = e => {
  //   setState({ ...state, disabled: !state.disabled });
  //   onSetOptionSelected(`${e.target.value}`);
  //   onSendMessage(actionProvider, `${e.target.value}`, `${e.target.value}`);
  // };

  const childClickHandler = (eventLabel, msgID, innerText) => {
    setState({ ...state, disabled: !state.disabled });
    // onSetOptionSelected(`${e.target.value}`);
    // if (state.disabled){ // || !hasMessageHistory
    onSendMessage(actionProvider, eventLabel, msgID, innerText);
  }

  // const slidesOptions = map(options, (option, index) => (
  //   <Slide
  //     tag="a"
  //     index={index}
  //     key={index}
  //     value={option.id}
  //     onClick={(state.disabled || hasMessageHistory) ? () => true:sendMessageToServer}
  //     className={"slide"}
  //   >
  //
  //   </Slide>
  // ));
  const [sliderRef] = useKeenSlider({
    slidesPerView: 2,
    mode: 'free-snap',
    spacing: 10,
    centered: true,
    loop: false,
  });

  const slidesOptions = map(options, (option, index) => (
    <div className="keen-slider__slide number-slide1" key={index}>
      <ImageCard
        id={option.id}
        title={option.label}
        subtitle={option.subtitle}
        img_src={option.img_src}
        isDisabled={state.disabled}
        onClick={childClickHandler}
      />
    </div>
  ));

  return (
    <div ref={sliderRef} className="keen-slider">
      {slidesOptions}
    </div>
  );
};

Carousel.propTypes = {
  actionProvider: PropTypes.object,
  options: PropTypes.array,
  onSendMessage: PropTypes.func,
  onSetOptionSelected: PropTypes.func,
  hasMessageHistory: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  optionSelected: getOptionSelected(),
  hasMessageHistory: getMessageHistory(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetOptionSelected: optionID => dispatch(setOptionSelected(optionID)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Carousel);
