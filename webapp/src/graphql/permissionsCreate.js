import gql from 'graphql-tag'

export default gql`
  mutation permissionsCreate(
    $itable: String!
    $table_update: Int!
    $table_add: Int!
    $table_query: Int
    $table_delete: Int
    $tableid: Int
    $roleid: Int
  ) {
    permissionsCreate(
        itable: $itable
        table_update: $table_update
        table_add: $table_add
        table_query: $table_query
        table_delete: $table_delete
        tableid: $tableid
        roleid: $roleid
    ) {
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
