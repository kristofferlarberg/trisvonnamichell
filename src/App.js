import React from "react";
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

const oneHourInMs = 1000 * 60 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: oneHourInMs,
    }
  }
})

const App = (props) => {
  const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
  const repoName = repoNameArray[1];

  return (
    <>
      <Helmet>
        <title>Tris Vonna-Michell</title>
        <meta name="description" content="Presentation of work by Tris Vonna-Michell." />
        <meta property="og:image" content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg" />
        <meta property="og:description" content="Presentation of work by Tris Vonna-Michell." />
        <meta property="og:title" content="Tris Vonna-Michell" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tris Vonna-Michell" />
        <meta name="twitter:description" content="Presentation of work by Tris Vonna-Michell." />
        <meta name="twitter:image" content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg" />
        <link rel="shortcut icon" href="/favicon1.png" />
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
    </>
  );
};

export default App;
