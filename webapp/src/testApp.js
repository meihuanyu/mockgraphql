import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import gql from 'graphql-tag'
import client from './ApolloClient'
import {runState,setGlobal,getGlobal} from './globalState'



class NewGame extends Component {
  state = {
    created: false,
    error: false
  }

  createGame = () => {
    runState('Modal','update',{
      patch:[
        {cc:"cc",dd:"dd"},
        {cc:"ggcc",dd:"hh"}
      ],
      modalProps:{ll:"ll"}
    })
  }
  updateName=()=>{
    runState('Test','updateGame',{
      name:"小王"
    })
  }
  render () {
    const { Modal,Test } = this.props
    console.log(Modal)
    return (
      <div>
          <button onClick={this.createGame}>xxxx</button>
          {/* <span>{Modal.patch}</span> */}
          <br />
          {/* <button onClick={this.updateName}>updateGame</button>
          <span>{Test.name}</span> */}
      </div>
    )
  }
}

export default compose(
  graphql(setGlobal('Modal','updateGame'), {name: 'updateGame'}),
  graphql(getGlobal('Modal',"patch{cc dd} modalProps{ ll}"), {
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
