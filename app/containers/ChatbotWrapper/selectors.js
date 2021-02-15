/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectUsername = () =>
  createSelector(
    selectHome,
    homeState => homeState.username,
  );

const getChatbotConfig = () =>
  createSelector(
    selectHome,
    homeState => homeState.config,
  );

const getSocket = () =>
  createSelector(
    selectHome,
    homeState => homeState.socket,
  );

const getOptionSelected = () =>
  createSelector(
    selectHome,
    homeState => homeState.optionID,
  );

const getMessageHistory = () =>
  createSelector(
    selectHome,
    homeState => homeState.hasMessageHistory,
  );

export {
  selectHome,
  makeSelectUsername,
  getChatbotConfig,
  getSocket,
  getOptionSelected,
  getMessageHistory
};
