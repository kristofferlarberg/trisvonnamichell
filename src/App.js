import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { apiEndpoint } from './prismic-configuration';
import Home from './pages/Home';
import Renditions from './pages/Renditions';
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
        },
    },
});

const App = (props) => {
    const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
    const repoName = repoNameArray[1];

    return (
        <>
            <Helmet>
                <script
                    async
                    defer
                    src={ `//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true` }
                />
            </Helmet>
            <QueryClientProvider client={ queryClient }>
                <BrowserRouter basename="/">
                    <Switch>
                        <Route exact path="/" component={ Home } />
                        <Route exact path="/:uid" component={ Renditions } />
                        { /* <Route component={NotFound} /> */ }
                    </Switch>
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
};

export default App;
