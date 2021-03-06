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
import Test from './test'

class Start extends Component {
  
  render() {
    console.log('xxx')
    return (
      <ApolloProvider client={client}>
        <Router>
          <div>
              <Route path="/" render={(props)=>{
                if(props.location.pathname==='/'){
                  props.history.push('/web')
                }
                return <span></span>
              }}></Route>
              <Route path="/web" component={App}></Route>
              
              <Route path="/login" component={Login}></Route> 
              <Route path="/test" component={Test}></Route> 
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default Start;
