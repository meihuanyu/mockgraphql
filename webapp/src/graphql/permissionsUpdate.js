import gql from 'graphql-tag'

export default gql`
  mutation permissionsUpdate(
    $itable: String!
    $table_update: Int!
    $table_add: Int!
    $table_query: Int
    $table_delete: Int
    $tableid: Int
    $roleid: Int
    $id: Int
  ) {
    permissionsUpdate(
        itable: $itable
        table_update: $table_update
        table_add: $table_add
        table_query: $table_query
        table_delete: $table_delete
        tableid: $tableid
        roleid: $roleid
        id: $id
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
