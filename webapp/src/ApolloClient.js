import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client';

import gql from 'graphql-tag'
import globalState from './globalState'
const {Mutation,defaultState}=globalState
const cache = new InMemoryCache()

    const stateLink = withClientState({
      cache,
      defaults: defaultState,
      resolvers: {
        Mutation: Mutation
      }
    })
    const logoutLink = onError(({ networkError }) => {
      if (networkError && networkError.statusCode === 401) {
         window.location.href="/login"
      };
    })
    const applink=ApolloLink.from([
      stateLink
    ])

    const client = new ApolloClient({
      link: logoutLink.concat(
        stateLink.concat(
          createUploadLink(
            {uri: '/api/graphql/system',headers:{authorization:localStorage.token}}
          )
        )
      ),
      cache
    })
export default client