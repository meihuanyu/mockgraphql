import gql from 'graphql-tag'

export default gql`
query project_list{
    project_list{
        id
        name
        apikey
        userid
    }   
}
`