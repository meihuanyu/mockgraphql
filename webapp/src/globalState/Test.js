class Test{
    state={
        name: '小名' 
    }
    updateGame = (_, {params}, { cache }) => {
        console.log(params)
        const data={
            Test:{
                name:params.name,
                __typename: 'Test'
            }  
        }
        cache.writeData({ data });
    }
}
export default Test