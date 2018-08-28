import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import './App.css';
import { ApolloProvider } from 'react-apollo'
import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'

import gql from 'graphql-tag'

import App from './app'
import Login from './common/Login'

import client from './ApolloClient'
class Start extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div>
              <Route path="/web" component={App}></Route>
              
              <Route path="/login" component={Login}></Route> 
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default Start;
