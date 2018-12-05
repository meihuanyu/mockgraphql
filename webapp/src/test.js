import React, { Component } from 'react';


import './App.css';
import { ApolloProvider } from 'react-apollo'
import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'

import gql from 'graphql-tag'
import TApp from './testApp'
import clientx from './T_Apollo'
class Start extends Component {
  render() {
    
    
    return (
      <ApolloProvider client={clientx}>
          <TApp />
      </ApolloProvider>
    );
  }
}

export default Start;
