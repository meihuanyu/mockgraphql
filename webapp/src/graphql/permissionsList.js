import gql from 'graphql-tag'

export default gql`query{
    permissionsList{
        id       
        itable
        table_update
        table_add
        table_query
        table_delete
        tableid
        roleid
    }   
   }
`