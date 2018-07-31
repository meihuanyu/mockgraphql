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

class Start extends Component {
  render() {
    const cache = new InMemoryCache()
    const defaultState = {
      currentGame: {
        __typename: 'currentGame',
        teamAScore: 0,
        teamBScore: 0,
        teamAName: 'Team A',
        teamBName: 'Team B'
      }
    }

    const stateLink = withClientState({
      cache,
      defaults: defaultState,
      resolvers: {
        Mutation: {
          updateGame: (_, { index, value }, { cache }) => {
                const query=gql`
            query GetCurrentGame {
                currentGame @client {
                    teamAName
                }
            }
            `
            const previous = cache.readQuery({ query })
            const data = {
              currentGame: {
                ...previous.currentGame,
                [index]: value
              }
            }

            cache.writeQuery({ query, data })
          }
        }
      }
    })

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: {
          authorization: localStorage.getItem('token') || null,
        } 
      });
    
      return forward(operation);
    })
    const logoutLink = onError(({ networkError }) => {
      if (networkError.statusCode === 401) {
         window.location.href="/login"
      };
    })
    const applink=ApolloLink.from([
      stateLink,
      authMiddleware,
      new HttpLink({
        uri: '/api/graphql'
      })
    ])

    const client = new ApolloClient({
      link: logoutLink.concat(applink),
      cache
    })
    

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
