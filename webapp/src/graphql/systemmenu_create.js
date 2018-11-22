import gql from 'graphql-tag'

export default gql`
  mutation systemmenu_create(
    $displayname: String!
    $name: String!
    $parentid: String!
    $component: String
    $oper: String
  ) {
    systemmenu_create(
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
