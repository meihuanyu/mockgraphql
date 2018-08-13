import gql from 'graphql-tag'

class Modal{
    state={
        patch: null,
        modalProps:null
    }
    update = (_, {params}, { cache }) => {
        let data={
            Modal:{
                patch:params.patch,
                modalProps:params.modalProps
            }  
        }
        cache.writeData({ data });
    }
    formart=(obj,typename)=>{
        if(typeof obj=='object'){
            if(Array.isArray(obj)){
                for(let i=0;i<obj.length;i++){
                    this.formart(obj[i],typename)
                }
            }else{
                if(obj){
                    const keys=Object.keys(obj)
                    for(let i=0;i<keys.length;i++){
                        let _typename=keys[i]
                        if(typename){
                            _typename=typename+_typename
                        }
                        this.formart(obj[keys[i]],_typename)
                    }
                    if(typename){
                        obj.__typename=typename
                    }
                } 
            }
        }
    }
}
export default Modal