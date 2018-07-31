import gql from 'graphql-tag'

export default gql`query userList{
    userList{
        id
        accountnumber
        username
        password
        roleid
    }   
   }
`