import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';

// Importing Apollo dependencies
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AUTH_TOKEN } from './constants';
import { ApolloLink } from 'apollo-client-preset';

import App from './components/App';

import './styles/index.css';

// Create the HttpLink that will connect your ApolloClient instance with the
// GraphQL API.
// Your GraphQL server will be running on http://localhost:4000
const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

// If user is logged in, we use the middleware to ensure that the token gets
// attached to all requests that are sent to the API.
// This middleware will be invoked every time ApolloClient sends a request to
// the server.
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    }
  });
  return forward(operation);
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

// Instanciate ApolloClient by passing in the httpLinkWithAuthToken and a new
// instance of an InMemoryCache.
// All our API requests will be authenticated if a token is available.
const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache()
})

// App is wrapped with the higher-order component ApolloProvider that
// gets passed the client as a prop
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
);
registerServiceWorker();
