import gql from 'graphql-tag'

class Modal{
    state={
        patch: true,
        modalProps:{} 
    }
    updateGame = (_, {params}, { cache }) => {
        console.log(params)
        const data={
            Modal:{
                patch:params.patch,
                modalProps:12,
                __typename: 'Modal'
            }  
        }
        cache.writeData({ data });
    }
}
export default Modal