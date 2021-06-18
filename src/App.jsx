import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {Helmet} from 'react-helmet';
import React from 'react';

import {
  Home,
  NotFound,
  Preview,
  Renditions,
} from './pages';
import {apiEndpoint} from './prismic-configuration';
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

const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
const repoName = repoNameArray[1];

const App = () => (
  <>
    <Helmet>
      <script
        async
        defer
        src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`}
      />
    </Helmet>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Renditions} exact path="/:uid" />
          <Route component={Preview} exact path="/preview" />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </QueryClientProvider>
  </>
);

export default App;
