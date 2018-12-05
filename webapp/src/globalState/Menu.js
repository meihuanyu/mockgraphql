import gql from 'graphql-tag'

class Menu{
    state={
        currentTopMenu: null,
        __typename:'xxx'
    }
    updateCurrentTopMenu = (_, params, { cache }) => {
        let data={
            Menu:{
                currentTopMenu:params.currentTopMenu
            }  
        }
        cache.writeData({ data });
    }
}
export default Menu