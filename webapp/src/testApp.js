import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import gql from 'graphql-tag'
import client from './ApolloClient'
import global,{runState,setGlobal,getGlobal} from './globalState'


const updateGame=gql`mutation updateGame($index: Episode!, $value: Episode!) {
                        updateGame(index: $index, value: $value) @client {
                            name
                        }
                    }`
const xx="currentGame"
const keys="name age "
const getCurrentGame=gql`query {
                            ${xx} @client {
                                ${keys}
                            }
                        }`
class NewGame extends Component {
  state = {
    created: false,
    error: false
  }

  createGame = () => {
    runState('Modal','updateGame',{
      patch:"/admin/php"
    })
  }
  updateName=()=>{
    runState('Test','updateGame',{
      name:"小王"
    })
  }
  render () {
    const { Modal,Test } = this.props
    console.log(Test)
    return (
      <div>
          <button onClick={this.createGame}>updateGame</button>
          <span>{Modal.patch}</span>
          <br />
          <button onClick={this.updateName}>updateGame</button>
          <span>{Test.name}</span>
      </div>
    )
  }
}

export default compose(
  graphql(setGlobal('Modal','updateGame'), {name: 'updateGame'}),
  graphql(getGlobal('Modal'), {
    props: ({ data: { Modal, loading } }) => ({
      Modal,
      loading
    })
  }),
  graphql(getGlobal('Test'), {
    props: ({ data: { Test, loading } }) => ({
      Test,
      loading
    })
  })
)(NewGame)
