import gql from 'graphql-tag'

export default gql`query projectList($userid:Int!){
    projectList(userid:$userid){
        id
        name
        apikey
        userid
    }   
}
`