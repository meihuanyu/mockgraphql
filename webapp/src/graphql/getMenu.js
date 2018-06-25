import gql from 'graphql-tag'

export default gql`
query systemmenuList($parentid:String){
  systemmenuList(parentid:$parentid) {
      displayname
      name
      id
      component
    }   
   }
`