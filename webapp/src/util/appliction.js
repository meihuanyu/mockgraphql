class app{
    eachRow =(arr)=>{
        
    }

 eachTree(data, callback, parent, level){
    level = level || 0;
    for(var a = 0; a < data.length; a++){
        var node = data[a];
        if(callback.call(node, node, parent, a, level, data) === false){
            return false;
        };
        if (node.children && node.children.length) {
            if(eachTree(node.children, callback, node, level+1) === false){
                return false;
            }
        }
  
    }
  }
}
export default app