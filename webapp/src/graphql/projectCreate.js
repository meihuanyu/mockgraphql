import gql from 'graphql-tag'

export default gql`
  mutation projectCreate(
    $name: String!
    $apikey: String!
    $userid: Int!
  ) {
    projectCreate(
        name: $name
        apikey: $apikey
        userid: $userid
    ) {
        name
        apikey
        userid
        
    }
  }
`
