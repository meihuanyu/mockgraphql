import gql from 'graphql-tag'

export default gql`
  mutation systemmenu_create(
    $displayname: String!
    $name: String!
    $pid: String!
    $component: String
    $oper: String
  ) {
    systemmenu_create(
        displayname: $displayname
        name: $name
        pid: $pid
        component: $component
        oper: $oper
    ) {
        displayname
        name
        pid
        component
        oper
    }
  }
`
