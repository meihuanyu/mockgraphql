import gql from 'graphql-tag'

export default gql`
  mutation userUpdate(
    $accountnumber: String!
    $password: String!
    $username: String!
    $roleid: Int
    $id:Int
  ) {
    userUpdate(
        accountnumber: $accountnumber
        password: $password
        username: $username
        roleid: $roleid
        id:$id
    ) {
        accountnumber
        password
        username
        roleid
    }
  }
`
