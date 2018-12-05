import gql from 'graphql-tag'

export default gql`
mutation login(
    $accountnumber: String
    $password: String
  ) {
    login(
        accountnumber: $accountnumber
        password: $password
    ) {
        token
        username
        id
        
    }
  }
`
