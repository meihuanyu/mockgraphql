import gql from 'graphql-tag'

export default gql`
  mutation project_create(
    $name: String!
    $apikey: String!
  ) {
    project_create(
        name: $name
        apikey: $apikey
    ) {
        id
    }
  }
`
