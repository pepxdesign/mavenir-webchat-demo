import React, { useEffect, useState, useRef } from 'react';
import './ButtonList.css';
import { map, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { setOptionSelected } from '../../actions';
import { getOptionSelected, getMessageHistory } from '../../selectors';

const ButtonList = props => {
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


  const sendMessageToServer = e => {
    setState({ ...state, disabled: !state.disabled });
    onSetOptionSelected(`${e.target.value}`);
    onSendMessage(
      actionProvider,
      `${e.target.value}`,
      `${e.target.value}`,
      e.target.innerText,
    );
  };
  // useEffect(() => {
  //   socket.on(`${optionSelected}_r`, message => {
  //     console.log('message from ButtonList', message);
  //     //     console.log('message from buttonList', message);
  //     //   if (message.widget) {
  //     //     actionProvider.showWidgetMessageBot(message.text, {
  //     //       widget: message.widget.name,
  //     //     });
  //     //   } else {
  //     //     actionProvider.showSingleMessageBot(message.text);
  //     //   }
  //     //
  //     // // if (optionSelected && optionSelected.current !== optionSelected) {
  //     //
  //     // // }
  //   });
  // }, [optionSelected]);
  const optionsMarkup = map(options, option => (
    <button
      className="learning-option-button btn-item"
      key={option.id}
      value={option.id}
      onClick={sendMessageToServer}
      disabled={state.disabled}
    >
      {option.label}
    </button>
  ));

  return <div className="learning-options-container">{optionsMarkup}</div>;
};

ButtonList.propTypes = {
  actionProvider: PropTypes.object,
  options: PropTypes.array,
  onSendMessage: PropTypes.func,
  onSetOptionSelected: PropTypes.func,
  hasMessageHistory: PropTypes.bool
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

export default compose(withConnect)(ButtonList);
