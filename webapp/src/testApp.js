import React, { Component } from 'react'
import { graphql, compose,Mutation } from 'react-apollo'

import gql from 'graphql-tag'
import client from './ApolloClient'
import {runState,setGlobal,getGlobal} from './globalState'


const UPLOAD_FILE = gql`
mutation ($file: Upload!) {
  fileCreate(file: $file) {
    id
  }
}
`;
class NewGame extends Component {
  state = {
    created: false,
    error: false
  }

  createGame = () => {
    runState('Modal','update',{
      patch:[{id:11,name:"xxx"},{id:22,name:"ggg"}]
    })
  }
  updateName=()=>{
    runState('Test','updateGame',{
      name:"小王"
    })
  }
  hanldChange=(e)=>{
    const xx=new FormData()
    xx.append('file',e.target.files[0])
    console.log(e.target.files)
    fetch('/api/upload',{ method: 'post',body:xx})
  }
  
  render () {
    const { Modal,Test } = this.props
    console.log(Test)
    return (
      <div>
        
          {/* <span>{Modal.patch}</span> */}
          <br />
          {/* <button onClick={this.updateName}>updateGame</button>
          <span>{Test.name}</span> */}
          <Mutation mutation={UPLOAD_FILE}>
          {uploadFile => (
            <input
            type="file"
            required
            onChange={({ target: { validity, files: [file] } }) =>
              validity.valid && uploadFile({ variables: { file } })
            }
          />
          )}
          </Mutation>
      </div>
    )
  }
}

export default compose(
  
  graphql(setGlobal('Modal','updateGame'), {name: 'updateGame'}),
  graphql(getGlobal('Modal','patch{name}'), {
    props: ({ data: { Modal, loading } }) => ({
      Modal,
      loading
    })
  }),
  graphql(getGlobal('Test',"name"), {
    props: ({ data: { Test, loading } }) => ({
      Test,
      loading
    })
  })
)(NewGame)
