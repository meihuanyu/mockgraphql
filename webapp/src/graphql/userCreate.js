import gql from 'graphql-tag'

export default gql`
  mutation userCreate(
    $accountnumber: String!
    $password: String!
    $username: String!
    $roleid: Int
  ) {
    userCreate(
        accountnumber: $accountnumber
        password: $password
        username: $username
        roleid: $roleid
    ) {
        accountnumber
        password
        username
        roleid
    }
  }
`
