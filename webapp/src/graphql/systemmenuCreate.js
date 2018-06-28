import gql from 'graphql-tag'

export default gql`
  mutation systemmenuCreate(
    $displayname: String!
    $name: String!
    $parentid: Int!
    $component: String!
    $oper: String!
  ) {
    systemmenuCreate(
        displayname: $displayname
        name: $name
        parentid: $parentid
        component: $component
        oper: $oper
    ) {
        displayname
        name
        parentid
        component
        oper
    }
  }
`
