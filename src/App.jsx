import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import React from 'react';

import {
  Home,
  Renditions,
} from './pages';

const oneHourInMs = 1000 * 60 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnmount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: oneHourInMs,
    },
  },
});

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Renditions} exact path="/:uid" />
        </Switch>
      </BrowserRouter>
    </QueryClientProvider>
  </>
);

export default App;
