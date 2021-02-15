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
import { map, isArray, isObject, forEach, isFunction } from 'lodash';
import Chatbot, { createChatBotMessage } from 'react-chatbot-kit';
import { io } from 'socket.io-client';
import classnames from 'classnames';
import './ChatbotWrapper.css';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
// import CardWrapper from './components/CardWrapper/CardWrapper';
import Cookies from 'js-cookie';
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
  updateIEmmiterFunc,
  setSocket,
  setActionProvider,
  setSomeFunction,
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
  onUpdateEmmiterFunc,
  onSetSocket,
  onSetActionProvider,
  onSetSomeFunction,
  match,
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
    botBranding: {
      logoUrl: 'https://via.placeholder.com/50',
      wideLogoUrl: '',
      displayName: '',
      botId: '',
      backgroundColor: '',
    },
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

  // Button function to show/hide chat box
  // const toggleChat = () => {
  //   setState({ ...state, visible: !state.visible });
  // };

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

  const someFunction = (botActionProvider, socket) => {
    // socket.on('newReply', data => {
    //   console.log(data)
    //   botActionProvider.showTextMessage('test')
    // });
    // const actionProvider = Object.assign({}, botActionProvider)
    // console.log(actionProvider);
    // setState({ ...state, actionProvider});
  }

  useEffect(() => {
    // get botID from url params
    const botID = match.params.id;
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

    socket.on('connect', () => {
      setState({ ...state, disconnected: false });
      onSetSocket({ socket, someFunction });
      // onSetSomeFunction(someFunction);
      // Once connected send userID to server
      if (isFirstRun.current) {
        isFirstRun.current = false;
        const configBot = Object.assign({}, config, {
          state: { test: (e, a) => socket.emit(e, a) },
        });

        setState({ ...state, configBot });
        socket.emit('get_botInfo', { botID }); // telling SERVER to fetch BotInfo
        const userID = Cookies.get('userID');
        socket.emit('validate_userID', { userID });
        // const emitterFunc = (event, args) => socket.emit(event, args)
        // onUpdateEmmiterFunc(emitterFunc);
      }
    });

    // socket.on('newReply', (data) =>{
    //   // Display Simple Text Message
    //   console.log(data);
    //   console.log(state);
    //   // state.actionProvider.showTextMessage('test');
    //   // if (data.RCSMessage.textMessage) {
    //   //   // this.actionProvider.showTextMessage(data.RCSMessage.textMessage);
    //   // }
    // });

    socket.on('get_botInfo_success', data => {
      if (data) {
        setState({
          ...state,
          botBranding: {
            botId:
              data.pcc['org-details']['comm-addr']['uri-entry'][0]['add-uri'] ||
              '',
            displayName:
              data.pcc['org-details'].name['name-entry']['display-name'] || '',
            logoUrl:
              data.pcc['org-details']['media-list']['media-entry'][0].media[
                'media-url'
              ] || '',
            wideLogoUrl:
              data.pcc['org-details']['media-list']['media-entry'][0].media[
                'media-url'
              ] || '',
            backgroundColor: '#fff',
          },
        });
      }
    });

    socket.on('get_botInfo_error', data => {
      // What to do?
    });

    socket.on('userID_registered', data => {
      // save userID in cookies
      Cookies.set('userID', data.userID);
      console.log('userID', data.userID);
      // localStorage.setItem('userID', JSON.stringify(data.username));
      // setState({ ...state, isLoggedIn: true });

      // If has history display
      // const storedMessages = JSON.parse(localStorage.getItem('chat_messages'));
      // let storedWidgets = JSON.parse(localStorage.getItem('chat_widgets'));
      // Converting text functions to REGULAR FUNCTIONS
      // storedWidgets = map(storedWidgets, widget => ({
      //   ...widget,
      //   widgetFunc: props => getComponent(widget.type, props),
      // }));
      // if (storedMessages && storedMessages.length > 0) {
      //   onUpdateHasMessageHistory(true);
      //   onUpdateConfig({ initialMessages: [] });
      //   if (storedWidgets) {
      //     onUpdateConfig({ widgets: storedWidgets });
      //   }
      // } else {
      //   sendNewMessage(null, 'hello', 'msg01');
      // }
    });

    socket.on('disconnect', () => {
      // Remove userID cookie
      Cookies.remove('userID');
      // setState({ ...state, disconnected: true });
    });
  }, [optionSelected, state.requestLogin]);

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="brand-header"
          style={{ '--color': state.botBranding.backgroundColor }}
        >
          <img src={state.botBranding.logoUrl} alt="" />
          <p>{state.botBranding.displayName}</p>
        </div>
        {config.state &&
          <div className="app-chatbot-container">
            <div
              className={classnames('chatbot-wrapper', {
                hidden: state.visible,
              })}
            >
              <div
                className="custom-header"
                style={{ '--color': state.botBranding.backgroundColor }}
              >
                <img src={state.botBranding.wideLogoUrl} alt=""/>
              </div>
              <Chatbot
                config={config}
                actionProvider={ActionProvider}
                messageParser={MessageParser}
                messageHistory={hasStoredMessages && loadMessages()}
                // saveMessages={saveMessages}
              />
            </div>
          </div>
        }
        <div className="brand-footer">
          <p>
            {`@2021 ${state.botBranding.displayName}, All Rights Reserved.`}
          </p>
        </div>
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
  onUpdateEmmiterFunc: PropTypes.func,
  match: PropTypes.object.isRequired,
  onSetSocket: PropTypes.func,
  onSetActionProvider: PropTypes.func,
  onSetSomeFunction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  config: getChatbotConfig(),
  optionSelected: getOptionSelected(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetSocket: someObj => dispatch(setSocket(someObj)),
    onSetSomeFunction: someFunc => dispatch(setSomeFunction(someFunc)),
    onSetActionProvider: actionProvider => dispatch(setActionProvider(actionProvider)),
    onUpdateConfig: config => dispatch(updateConfig(config)),
    onAddWidget: widget => dispatch(addWidget(widget)),
    onUpdateHasMessageHistory: value =>
      dispatch(updateHasMessageHistory(value)),
    onUpdateInitialMessages: initialMessages =>
      dispatch(updateInitialMessages(initialMessages)),
    onUpdateEmmiterFunc: emitterFunc =>
      dispatch(updateIEmmiterFunc(emitterFunc)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ChatbotWrapper);
