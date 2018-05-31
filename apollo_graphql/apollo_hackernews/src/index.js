import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

// Importing Apollo dependencies
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './components/App';

import './styles/index.css';

// Create the HttpLink that will connect your ApolloClient instance with the
// GraphQL API.
// Your GraphQL server will be running on http://localhost:4000
const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

// Instanciate ApolloClient by passing in the httpLink and a new instance of
// an InMemoryCache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

// App is wrapped with the higher-order component ApolloProvider that
// gets passed the client as a prop
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root')
);
registerServiceWorker();
