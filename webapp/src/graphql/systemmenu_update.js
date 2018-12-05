import gql from 'graphql-tag'

export default gql`
  mutation systemmenu_update(
    $displayname: String!
    $name: String!
    $component: String
    $oper: String
    $id:Int
  ) {
    systemmenu_update(
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
