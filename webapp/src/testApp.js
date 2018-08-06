import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import gql from 'graphql-tag'
import client from './ApolloClient'
const updateGame=gql`mutation updateGame($index: String!, $value: String!) {
                        updateGame(index: $index, value: $value) @client {
                            name
                        }
                    }`
const getCurrentGame=gql`query {
                            currentGame @client {
                                name
                            }
                        }`
class NewGame extends Component {
  state = {
    created: false,
    error: false
  }

  createGame = () => {
    // const { updateGame } = this.props
    

    client.mutate({mutation:updateGame,variables:{
        index: 'name',
        value: "ggggg"
    }}).then(console.log)
  }
  getGame=()=>{

    const { currentGame } = this.props
  }

  render () {
    const { currentGame } = this.props
    return (
      <div>
          <button onClick={this.createGame}>updateGame</button>
          {/* <span>{currentGame.name}</span> */}
      </div>
    )
  }
}

export default compose(
  graphql(updateGame, {name: 'updateGame'}),
  graphql(getCurrentGame, {
    props: ({ data: { currentGame, loading } }) => ({
      currentGame,
      loading
    })
  })
)(NewGame)
