import gql from 'graphql-tag'

export default gql`query userrole_list{
    userrole_list{
        id       
        name
    }   
   }
`