import gql from 'graphql-tag'

class Modal{
    state={
        __typename: 'modal',
        modalPatch:"xxxx"
    }
    updateGame = (_, { index, value }, { cache }) => {
        const query=gql`
          query GetCurrentGame {
              currentGame @client {
                  name
              }
          }
          `
        const previous = cache.readQuery({ query })
        const data = {
          currentGame: {
            ...previous.currentGame,
            [index]: value
          }
        }
    
        cache.writeQuery({ query, data })
    }
}
export default Modal