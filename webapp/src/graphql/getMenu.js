import gql from 'graphql-tag'

export default gql`
query systemmenu_list($pid:String){
  systemmenu_list(pid:$pid) {
      displayname
      name
      id
      component
      oper
      pid
      mid
    }   
   }
`