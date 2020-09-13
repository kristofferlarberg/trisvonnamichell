import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { apiEndpoint } from "./prismic-configuration";
import { NotFound } from "./pages";
import Home from "./pages/Home";
import Renditions from "./pages/Renditions";

/**
 * Main application componenet
 */
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
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/work/:uid" component={Renditions} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
