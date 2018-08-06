import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'

import gql from 'graphql-tag'

const cache = new InMemoryCache()
    const defaultState = {
      currentGame: {
        __typename: 'currentGame',
        name:"xxxx"
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
                      name
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
    const logoutLink = onError(({ networkError }) => {
      if (networkError.statusCode === 401) {
         window.location.href="/login"
      };
    })
    const applink=ApolloLink.from([
      stateLink,
      new HttpLink({
        uri: '/api/graphql'
      })
    ])

    const client = new ApolloClient({
      link: logoutLink.concat(applink),
      cache
    })
export default client