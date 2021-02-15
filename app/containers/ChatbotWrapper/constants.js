/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_SOCKET = 'SET_SOCKET';
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const ADD_WIDGET = 'ADD_WIDGET';
export const SET_OPTION_SELECTED = 'SET_OPTION_SELECTED';
export const UPDATE_MSG_HISTORY = 'UPDATE_MSG_HISTORY';
export const UPDATE_INITIAL_MESSAGES = 'UPDATE_INITIAL_MESSAGES';
export const UPDATE_EMMITER_FUNC = 'UPDATE_EMMITER_FUNC';
export const SET_ACTION_PROVIDER = 'SET_ACTION_PROVIDER';
export const SET_SOME_FUNCTION = 'SET_SOME_FUNCTION';
