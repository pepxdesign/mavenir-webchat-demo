/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ChatbotWrapper from 'containers/ChatbotWrapper/Loadable';
import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: 100%;
  margin: 0 0;
  display: flex;
  min-height: 100%;
  padding: 0 0;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
        <Switch>
          <Route path="/webapp">
            <Route
              path="/webapp/:id"
              render={({ match }) => <ChatbotWrapper match={match} />}
            />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </BrowserRouter>
      <GlobalStyle />
    </AppWrapper>
  );
}

//
// <Switch>
//   <Route exact path="/" component={HomePage} />
//   <Route path="/features" component={FeaturePage} />
//   <Route path="" component={NotFoundPage} />
// </Switch>
