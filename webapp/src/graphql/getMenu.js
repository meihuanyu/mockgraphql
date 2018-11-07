import gql from 'graphql-tag'

export default gql`
query systemmenu_list($parentid:String){
  systemmenu_list(parentid:$parentid) {
      displayname
      name
      id
      component
      oper
      parentid
    }   
   }
`