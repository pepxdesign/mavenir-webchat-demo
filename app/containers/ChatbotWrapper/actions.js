/*
 * Chatbot Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  UPDATE_CONFIG,
  SET_SOCKET,
  ADD_WIDGET,
  SET_OPTION_SELECTED,
  UPDATE_MSG_HISTORY,
  UPDATE_INITIAL_MESSAGES,
  UPDATE_EMMITER_FUNC,
  SET_ACTION_PROVIDER,
  SET_SOME_FUNCTION,
} from './constants';

/**
 * Changes the input field of the form
 *
 *
 * @return {object} An action object with a type of CHANGE_USERNAME
 * @param socket
 */
export function setSocket(stateObj) {
  return {
    type: SET_SOCKET,
    stateObj,
  };
}

export function updateConfig(config) {
  return {
    type: UPDATE_CONFIG,
    config,
  };
}

export function addWidget(widget) {
  return {
    type: ADD_WIDGET,
    widget,
  };
}

export function setOptionSelected(optionID) {
  return {
    type: SET_OPTION_SELECTED,
    optionID,
  };
}

export function updateHasMessageHistory(hasMessageHistory) {
  return {
    type: UPDATE_MSG_HISTORY,
    hasMessageHistory,
  };
}

export function updateInitialMessages(initialMessages) {
  return {
    type: UPDATE_INITIAL_MESSAGES,
    initialMessages,
  };
}

export function updateIEmmiterFunc(emitterFunc) {
  return {
    type: UPDATE_EMMITER_FUNC,
    emitterFunc,
  };
}

export function setActionProvider(actionProvider) {
  return {
    type: SET_ACTION_PROVIDER,
    actionProvider,
  };
}

export function setSomeFunction(someFunction) {
  return {
    type: SET_SOME_FUNCTION,
    someFunction,
  };
}


