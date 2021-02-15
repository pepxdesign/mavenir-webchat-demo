/**
 * CardWrapper
 *
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach } from 'lodash';
import './CardWrapper.css';
import { compose } from 'redux';

import ButtonList from '../ButtonList/ButtonList';

import {
  updateConfig,
  addWidget,
} from '../../containers/ChatbotWrapper/actions';

// Send Message to Server
const sendMessageToServer = (socket, msgID) => {
  console.log('sending', msgID);
  socket.emit('messages', { id: msgID });
};



export function CardWrapper(props) {
  const { options, socket, actionProvider, onAddWidget } = props;
  useEffect(() => {
    socket.on('messages', data => {
      if (data && (data.id === 'opt1' || data.id === 'opt1a')) {
        if (data.widget) {
          // update widgets on global state
          const widget = {
            widgetName: data.widget.name,
            widgetFunc: newProps => getComponent(newProps), // props passed by Chatbot
            props: { //extra Props
              options: data.widget.options,
              // a function to trigger socket functions, not the socket
              // function to update the widget onAddWidget,
            },
          };
          onAddWidget(widget);
        }

        forEach(data.messages, (message, index) => {
          if (message.widget) {
            actionProvider.showWidgetMessageBot(message.text, {
              delay: index * 1000,
              widget: message.widget,
            });
          } else {
            actionProvider.showSingleMessageBot(message.text, {
              delay: index * 1000,
            });
          }
        });
      }
    });
  }, []);

  const optionsMarkup = map(options, option => (
    <button
      className="learning-option-button"
      key={option.id}
      value={option.label}
      onClick={() => sendMessageToServer(socket, option.id)}
    >
      {option.label}
    </button>
  ));

  return <div className="learning-options-container">{optionsMarkup}</div>;
}

CardWrapper.propTypes = {
  options: PropTypes.array,
  socket: PropTypes.object,
  actionProvider: PropTypes.object,
  onAddWidget: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateConfig: config => dispatch(updateConfig(config)),
    // onAddWidget: widget => dispatch(addWidget(widget)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(CardWrapper);
