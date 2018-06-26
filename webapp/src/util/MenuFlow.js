
// 解析操作流程字符串的正则
let flowReg = /([^\.])\.([^\,\(]+)(\(([^\)]*)\))?(\s*\,\s*)?/g;
class MenuFlow{
    dataSource={}
    constructor(oper,dataSource){
        const groupOper = {g: [], v: [], f: [], c: []};
        // 解析操作字符串
        let arr = null;
        do{
            arr = flowReg.exec(oper);
            if(arr != null){
                // 正则匹配之后是类似这样的数组
                // ["f.edit('baidu', '12')", "f", "edit", "('baidu', '12')", "'baidu', '12'"]
                // 取到对应的数组
                let groupArr = groupOper[arr[1]];
                groupArr.push({
                    // 名称
                    name: arr[2],
                    // 参数数组
                    params: arr[4] ? eval("[" + arr[4] + "]") : [],
                    // 标识
                    tag: arr[1]
                });
            }
        }while(arr != null);
        this.runOper(groupOper)
        this.dataSource=Object.assign({},this.dataSource,dataSource)
    }
    queue(arr) {
        var sequence = Promise.resolve()
        arr.forEach(function (item) {
          sequence = sequence.then(item)
        })
        return sequence
    }
    runOper=(opers)=>{
        let funArr=[]
        for(let oper in opers){
            for(let i=0;i<opers[oper].length;i++){
                const fun=opers[oper][i];
                funArr.push(this[oper][fun.name].bind(this,fun.params.join()))
            }
            
        }
        this.queue(funArr)
    }
    ds = async function(name, ...args){
        let val = this.dataSource[name];
        if(typeof(val) === "function"){
            return await val.apply(this, args)
        }
        return val;
    }
    f={
        ds:this.ds,
        create:(xx)=>{
            console.log(xx)
        }    
    }
    g={
        ds:this.ds,
        getRows:()=>{
            return new Promise((resolve)=>{
                setTimeout(() => {
                    console.log('getRows')
                    resolve()
                }, 500);
            })
        }
    }
}
export default MenuFlow;