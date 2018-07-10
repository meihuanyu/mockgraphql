import gql from 'graphql-tag'

export default gql`
  mutation systemmenuDelete(
    $id:Int
  ) {
    systemmenuDelete(
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
