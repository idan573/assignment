import * as React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

/* Components */
import { AppHeader } from './AppHeader/AppHeader';
import { AppNavbar } from './AppNavbar/AppNavbar';
import AppRouter from './AppRouter';
import RootProvider from './RootProvider';

export const history = createBrowserHistory();

const App: React.FC = () => {
  return (
    <Router history={history}>
      <RootProvider>
        <AppHeader />
        <AppRouter />
        <AppNavbar />
      </RootProvider>
    </Router>
  );
};

export default App;
