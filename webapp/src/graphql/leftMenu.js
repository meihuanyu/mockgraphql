import gql from 'graphql-tag'

export default gql`
query xxx($pid:String){
  systemmenu_list(pid:$pid) {
      displayname
      name
      id
      component
    }   
   }
  fragment CommentsRecursive on Message {
    comments {
      ...CommentFields
      comments {
        ...CommentFields
        comments {
          ...CommentFields
          comments {
            ...CommentFields
            comments {
              ...CommentFields
              comments {
                ...CommentFields
                comments {
                  ...CommentFields
                  comments {
                    ...CommentFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  fragment CommentFields on Comment {
    id
    content
  }
`
