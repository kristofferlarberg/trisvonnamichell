import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { apiEndpoint } from "./prismic-configuration";
import Home from "./pages/Home";
import Renditions from "./pages/Renditions";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
/**
 * Main application componenet
 */

const queryClient = new QueryClient()

const App = (props) => {
  const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
  const repoName = repoNameArray[1];

  return (
    <Fragment>
      <Helmet>
        <script
          async
          defer
          src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`}
        />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename='/'>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:uid" component={Renditions} />
            {/* <Route component={NotFound} /> */}
          </Switch>
        </BrowserRouter>
      </QueryClientProvider>
    </Fragment>
  );
};

export default App;
