import gql from 'graphql-tag'

export default gql`
query permissions_list($roleid:Int){
    permissions_list(roleid:$roleid) {
        table_update
        table_add
        table_query
        table_delete
        tableid
        roleid
        id
        itable
    }   
   }
`