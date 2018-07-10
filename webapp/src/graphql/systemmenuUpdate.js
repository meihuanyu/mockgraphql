import gql from 'graphql-tag'

export default gql`
  mutation systemmenuUpdate(
    $displayname: String!
    $name: String!
    $component: String
    $oper: String
    $id:Int
  ) {
    systemmenuUpdate(
        displayname: $displayname
        name: $name
        component: $component
        oper: $oper
        id:$id
    ) {
        id
        displayname
        name
        component
        oper
    }
  }
`
