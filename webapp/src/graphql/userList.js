import gql from 'graphql-tag'

export default gql`query{
    userList{
        id
        accountnumber
        username
    }   
   }
`