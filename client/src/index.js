import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Importing AppolloClient to tell our front end which URL to make http requests to
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';

// Indicating the correct URL
const client = new ApolloClient({
  uri: "http://localhost:4000"
});

// Wrapping the entire App with ApolloProvider to tell our front end which URL to make http requests to

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);

serviceWorker.unregister();
