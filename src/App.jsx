import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import React from 'react';

import Home from './pages/Home';
import Renditions from './pages/Renditions';
/**
 * Main application componenet
 */

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
          {/* <Route component={NotFound} /> */}
        </Switch>
      </BrowserRouter>
    </QueryClientProvider>
  </>
);

export default App;
