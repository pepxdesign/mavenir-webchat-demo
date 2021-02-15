/*
 * ChatbotWrapper
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
// //
import { map, isArray, isObject, forEach } from 'lodash';
import Chatbot, { createChatBotMessage } from 'react-chatbot-kit';

import { io } from 'socket.io-client';
import classnames from 'classnames';
import './ChatbotWrapper.css';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
// import CardWrapper from './components/CardWrapper/CardWrapper';
import cancelIcon from '../../images/cancel.svg';
import chatIcon from '../../images/chatIcon.svg';
// import H2 from 'components/H2';
// import ReposList from 'components/ReposList';
import MessageParser from './components/MessageParser';
import ActionProvider from './components/ActionProvider';
// import AtPrefix from './AtPrefix';
// import CenteredSection from './CenteredSection';
// import Form from './Form';
// import Input from './Input';
// import Section from './Section';
// import messages from './messages';
import {
  addWidget,
  updateConfig,
  updateHasMessageHistory,
  updateInitialMessages,
} from './actions';
import { getChatbotConfig, getOptionSelected } from './selectors';
import reducer from './reducer';
// import saga from './saga';
import ButtonList from './components/ButtonList/ButtonList';
import Carousel from './components/Carousel/Carousel';
import Overlay from './components/Overlay/Overlay';
import SimpleImage from './components/SimpleImage/SimpleImage';
import RichCard from './components/RichCard/RichCard';

import LoginOverlay from './components/LoginOverlay/LoginOverlay';

const socketServerURL = 'https://webchat-beta.rcs.mavenir.com'; // 'http://jose-webchat.com:80';
const key = 'home';

const storedMessagesGlobal = JSON.parse(localStorage.getItem('chat_messages'));
const hasStoredMessages =
  storedMessagesGlobal && storedMessagesGlobal.length > 0;

export function ChatbotWrapper({
  config,
  onUpdateConfig,
  onAddWidget,
  optionSelected,
  onUpdateHasMessageHistory,
  onUpdateInitialMessages,
}) {
  useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });

  const initialState = {
    visible: false,
    connected: false,
    actionProvider: {},
    disconnected: false,
    isLoggedIn: false,
    requestLogin: false,
    botConfig: {},
  };

  const [state, setState] = useState(initialState);

  const getComponent = (cardType, props) => {
    // const component = React.createElement(ButtonList, props, null);
    if (cardType === 'buttonList') {
      return <ButtonList {...props} />;
    }

    if (cardType === 'carousel') {
      return <Carousel {...props} />;
    }

    if (cardType === 'simpleImage') {
      return <SimpleImage {...props} />;
    }

    if (cardType === 'richCard') {
      return <RichCard {...props} />;
    }

    return (
      <div>
        <p>Card Type not defined</p>
      </div>
    );
  };

  // Hooks
  // Printing 1st iteration:
  //   useEffect(() => {
  //     console.log('count changed', props.count);
  //   }, [props.count])
  //
  // //Skipping first iteration (exactly like componentWillReceiveProps):
  //   const isFirstRun = useRef(true);
  //   useEffect (() => {
  //     if (isFirstRun.current) {
  //       isFirstRun.current = false;
  //       return;
  //     }
  //     console.log('count changed', props.count);
  //   }, [props.count]);

  const toggleChat = () => {
    setState({ ...state, visible: !state.visible });
  };

  const saveMessages = messages => {
    // Can receive array (for Initial Messages ONLY) or object (single message)
    if (isArray(messages)) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    } else if (isObject(messages)) {
      let storedMessages =
        JSON.parse(localStorage.getItem('chat_messages')) || [];
      storedMessages = [...storedMessages, messages];
      localStorage.setItem('chat_messages', JSON.stringify(storedMessages));
    }
  };

  const saveWidgets = widget => {
    if (isObject(widget)) {
      let widgetToStore;
      if (widget.widgetFunc) {
        widgetToStore = { ...widget, widgetFunc: widget.widgetFunc.toString() };
        let storedWidgets =
          JSON.parse(localStorage.getItem('chat_widgets')) || [];
        storedWidgets = [...storedWidgets, widgetToStore];
        localStorage.setItem('chat_widgets', JSON.stringify(storedWidgets));
      }
    }
  };

  const loadMessages = () => {
    let messages = JSON.parse(localStorage.getItem('chat_messages'));
    // removing delay property for all messages
    messages = map(messages, message => ({
      ...message,
      delay: null,
    }));
    return messages;
  };

  const sendLoginMessage = () => {
    setState({ ...state, requestLogin: true });
  };

  const isFirstRun = useRef(true);
  useEffect(() => {
    // need to generate a AuthToken here,
    const sendNewMessage = (actionProvider, eventLabel, msgID, innerText) => {
      console.log('sending msg -> ', msgID);
      socket.emit(eventLabel, { id: msgID });
      // create message on chatbot for client innerText
      if (actionProvider) {
        actionProvider.showSingleMessageClient(innerText, saveMessages);
      }
      socket.on(`${msgID}_r`, data => {
        if (data && actionProvider) {
          if (!data.widget) {
            // MESSAGE NO WIDGET
            actionProvider.showSingleMessageBot(data.text, {}, saveMessages);
          } else {
            // MESSAGE WIDGET
            const widget = {
              widgetName: data.widget.name,
              widgetFunc: props => getComponent(data.widget.cardType, props),
              props: {
                options: data.widget.options,
                onSendMessage: sendNewMessage,
              },
              type: data.widget.cardType,
            };
            onAddWidget(widget);
            saveWidgets(widget);
            actionProvider.showWidgetMessageBot(
              data.text,
              { widget: data.widget.name },
              saveMessages,
            );
          }
        } else if (data.id === 'msg01_r') {
          const initialMessages = map(data.messages, (message, index) => {
            if (message.widget) {
              // Create widget here
              const widget = {
                widgetName: message.widget.name,
                widgetFunc: props =>
                  getComponent(message.widget.cardType, props),
                props: {
                  options: message.widget.options,
                  onSendMessage: sendNewMessage,
                },
                type: message.widget.cardType,
              };
              onAddWidget(widget); // push widget in widgets (state)
              saveWidgets(widget);
              return createChatBotMessage(message.text, {
                delay: index * 1000,
                widget: message.widget.name,
              });
            }
            return createChatBotMessage(message.text, {
              delay: index * 1000,
            });
          });
          // onUpdateConfig({ initialMessages });
          onUpdateInitialMessages(initialMessages);
          // Storage Messages
          saveMessages(initialMessages);
        }
      });
    };

    const socket = io(socketServerURL, {
      // transports: ['websocket'],
      // reconnection: true,
      // reconnectionDelayMax: 10000,
      // secure: false,
      transports: ['websocket'],
      auth: {
        token: '123', // generate Token and send to server
      },
    });

    socket.on('connect', () => {
      setState({ ...state, socket: Object.assign({}, socket) });
      setState({ ...state, disconnected: false });
    });

    if (isFirstRun.current) {
      isFirstRun.current = false;
      // set config to state so Chatbot renders,
      // setState({ ...state, botConfig: config });
      const username = JSON.parse(localStorage.getItem('username'));
      if (username) {
        // If I have username cookie ? -> ask server to check in loggedUsers
        socket.emit('validate_username', { username });
      }
    }

    // When user clicks on "login" button
    if (state.requestLogin) {
      socket.emit('login_request', { id: 'login_request' });
    }
    // When config.initialMessages is updated,
    // console.log(state.botConfig);
    // console.log(config)
    // console.log(state.botConfig.current)

    socket.on('login_success', data => {
      localStorage.setItem('username', JSON.stringify(data.username));
      setState({ ...state, isLoggedIn: true });

      // localStorage.removeItem('chat_messages');
      // localStorage.removeItem('chat_widgets');

      // If has history display
      const storedMessages = JSON.parse(localStorage.getItem('chat_messages'));
      let storedWidgets = JSON.parse(localStorage.getItem('chat_widgets'));
      // Converting text functions to REGULAR FUNCTIONS
      storedWidgets = map(storedWidgets, widget => ({
        ...widget,
        widgetFunc: props => getComponent(widget.type, props),
      }));
      if (storedMessages && storedMessages.length > 0) {
        onUpdateHasMessageHistory(true);
        onUpdateConfig({ initialMessages: [] });
        if (storedWidgets) {
          onUpdateConfig({ widgets: storedWidgets });
        }
      } else {
        sendNewMessage(null, 'hello', 'msg01');
      }
    });

    socket.on('login_fail', () => {
      setState({ ...state, isLoggedIn: false });
    });

    socket.on('disconnect', () => {
      setState({ ...state, disconnected: true });
      // what we should do when user disconnects?
    });

    // Initial Messages
    // socket.on('msg01_r', data => {
    //   if (data) {
    //     if (data.id === 'msg01_r') {
    //       const initialMessages = map(data.messages, (message, index) => {
    //         if (message.widget) {
    //           // Create widget here
    //           const widget = {
    //             widgetName: message.widget.name,
    //             widgetFunc: props =>
    //               getComponent(message.widget.cardType, props),
    //             props: {
    //               options: message.widget.options,
    //               onSendMessage: sendNewMessage,
    //             },
    //             type: message.widget.cardType,
    //           };
    //           onAddWidget(widget); // push widget in widgets (state)
    //           saveWidgets(widget);
    //           return createChatBotMessage(message.text, {
    //             delay: index * 1000,
    //             widget: message.widget.name,
    //           });
    //         }
    //         return createChatBotMessage(message.text, {
    //           delay: index * 1000,
    //         });
    //       });
    //       // onUpdateConfig({ initialMessages });
    //       onUpdateInitialMessages(initialMessages);
    //       // Storage Messages
    //       saveMessages(initialMessages);
    //     }
    //   }
    // });
  }, [optionSelected, state.requestLogin]);

  // !config.initialMessages
  return (
    <div className="App">
      <header className="App-header">
        {true && (
          <div className="app-chatbot-container">
            <div
              className={classnames('chatbot-wrapper', {
                hidden: state.visible,
              })}
            >
              <div className="custom-header">
                <img
                  src="https://jose-velazquez.com/webchat_img/logo.png"
                  alt="Mavenir logo"
                />
              </div>
              {state.disconnected && <Overlay />}
              {!state.isLoggedIn && <LoginOverlay onClick={sendLoginMessage} />}
              <Chatbot
                config={config}
                actionProvider={ActionProvider}
                messageParser={MessageParser}
                messageHistory={hasStoredMessages && loadMessages()}
                // saveMessages={saveMessages}
              />
              <div className="input-overlay" />
            </div>
            <button
              type="button"
              className="app-chatbot-button"
              onClick={toggleChat}
            >
              {!state.visible ? (
                <img src={cancelIcon} alt="chat icon" />
              ) : (
                <img src={chatIcon} alt="chat icon" />
              )}
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

ChatbotWrapper.propTypes = {
  config: PropTypes.object,
  onUpdateConfig: PropTypes.func,
  onAddWidget: PropTypes.func,
  onUpdateHasMessageHistory: PropTypes.func,
  optionSelected: PropTypes.string,
  onUpdateInitialMessages: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  config: getChatbotConfig(),
  optionSelected: getOptionSelected(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateConfig: config => dispatch(updateConfig(config)),
    onAddWidget: widget => dispatch(addWidget(widget)),
    onUpdateHasMessageHistory: value =>
      dispatch(updateHasMessageHistory(value)),
    onUpdateInitialMessages: initialMessages =>
      dispatch(updateInitialMessages(initialMessages)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ChatbotWrapper);
