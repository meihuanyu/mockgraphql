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
import App from './app'

class Start extends Component {
  render() {
    const cache = new InMemoryCache()
    const defaultState = {
      currentGame: {
        __typename: 'currentGame',
        teamAScore: 0,
        teamAScore: 0,
        teamAName: 'Team A'
      }
    }

    const stateLink = withClientState({
      cache,
      defaults: defaultState,
      resolvers: {
        Mutation: {
          updateGame: (_, { index, value }, { cache }) => {
            console.log(value)
          }
        }
      }
    })
    const client = new ApolloClient({
      link: ApolloLink.from([
        stateLink,
        new HttpLink({
          uri: '/api/graphql'
        })
      ]),
      cache
    })
    

    return (
      <ApolloProvider client={client}>
        <Router>
            {/* <App/> */}
        </Router>
      </ApolloProvider>
    );
  }
}

export default Start;
