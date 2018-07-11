import gql from 'graphql-tag'

export default gql`
query permissionsList($roleid:Int){
    permissionsList(roleid:$roleid) {
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