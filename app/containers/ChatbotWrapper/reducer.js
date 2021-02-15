/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import React from 'react';
import { Map } from 'immutable';
import { createChatBotMessage } from 'react-chatbot-kit';
import SimpleImage from './components/SimpleImage/SimpleImage';
import SimpleVideo from './components/SimpleVideo/SimpleVideo';

import {
  ADD_WIDGET,
  UPDATE_CONFIG,
  SET_SOCKET,
  SET_OPTION_SELECTED,
  UPDATE_MSG_HISTORY,
  UPDATE_INITIAL_MESSAGES,
  UPDATE_EMMITER_FUNC,
  SET_ACTION_PROVIDER,
  SET_SOME_FUNCTION,
} from './constants';
import BotAvatar from './components/BotAvatar/BotAvatar';
import BotUser from './components/BotUser/BotUser';
import MessageParser from './components/MessageParser';

// The initial state of the App
export const initialState = {
  socket: {},
  optionID: null,
  config: {
    botName: 'Mavenir InstantFlora',
    initialMessages: [],
    // Defines an object of custom components that will replace the stock chatbot components.
    customComponents: {
      // Replaces the default header
      // header: () => <div style={{ backgroundColor: 'red', padding: "5px", borderRadius: "3px" }}>This is the
      // header</div>,
      // Replaces the default bot avatar
      botAvatar: props => <BotAvatar {...props} />,
      // Replaces the default bot chat message container
      // botChatMessage: (props) => <CustomChatMessage {...props} />,
      // Replaces the default user icon
      userAvatar: props => <BotUser {...props} />,
      // Replaces the default user chat message
      // userChatMessage: (props) => <MyUserChatMessage {...props} />
    },
    // state: {},
    widgets: [
      {
        widgetName: 'SimpleImage',
        widgetFunc: props => <SimpleImage {...props} />,
        mapStateToProps: ['componentData'],
      },
      {
        widgetName: 'SimpleVideo',
        widgetFunc: props => <SimpleVideo {...props} />,
        mapStateToProps: ['componentData'],
      },
    ],
    customStyles: {
      botMessageBox: {
        // @todo it has to be changed once botInfo is fetched
        backgroundColor: '#d8d8d8',
      },
      chatButton: {
        // @todo it has to be changed once botInfo is fetched
        // backgroundColor: 'rgb(0, 90, 146)', MAVENIR BLUE
        backgroundColor: '#d8d8d8',
      },
    },
  },
  hasMessageHistory: false,
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  produce(state, draft => {
    let newConfig;
    switch (action.type) {
      case UPDATE_CONFIG:
        draft.config = Object.assign({}, draft.config, action.config);
        break;
      case ADD_WIDGET:
        draft.config.widgets = [...draft.config.widgets, action.widget];
        break;
      case UPDATE_INITIAL_MESSAGES:
        if (draft.config.initialMessages) {
          draft.config.initialMessages = [
            ...draft.config.initialMessages,
            ...action.initialMessages,
          ];
        } else {
          draft.config.initialMessages = action.initialMessages;
        }
        break;
      case SET_SOCKET:
        newConfig = Object.assign({}, draft.config, { state: action.stateObj });
        draft.config = { ...draft.config, ...newConfig };
        // draft.socket = { ...draft.socket, ...action.socket };
        break;
      case SET_ACTION_PROVIDER:
        // newConfig = Object.assign({}, draft.actionProvider, action.actionProvider)
        // draft.config = { ...draft.config, ...newConfig};
        // draft.socket = { ...draft.socket, ...action.socket };
        break;
      case SET_SOME_FUNCTION:
        newConfig = Map(draft.config).set('state', action.someFunction);
        console.log(newConfig.get('state'));
        // newConfig = Object.assign({}, draft.actionProvider, action.actionProvider)
        // draft.config = { ...draft.config, ...newConfig};
        // draft.socket = { ...draft.socket, ...action.socket };
        break;
      case SET_OPTION_SELECTED:
        draft.optionID = action.optionID;
        break;
      case UPDATE_MSG_HISTORY:
        draft.hasMessageHistory = action.hasMessageHistory;
        break;
      case UPDATE_EMMITER_FUNC:
        // console.log(action)
        // draft.config.state = { ...draft.config.state, emitterFunc: action.emitterFunc}
        // draft.config = Object.assign({}, draft.config, {
        //   state: { emitterFunc: action.emitterFunc },
        // });
        // draft.config.state = {
        //   ...draft.config.state,
        //   emitterFunc: action.emitterFunc,
        // };
        // draft.config.state.emitterFunc = action.emitterFunc;
        break;
    }
  });

export default homeReducer;
