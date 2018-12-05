import gql from 'graphql-tag'

export default gql`query user_list{
    user_list{
        id
        accountnumber
        username
        password
    }   
   }
`