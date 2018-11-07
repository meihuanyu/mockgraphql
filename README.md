# mockgraphql
## graphql_table 表结构解释
     type=null 普通表  type=1 中转表  type=2 原始表

##  function 表结构解释

     type        befor after on(替换) original(原始方法)
     tableid
     oper        create list...
     isnew       1 mation 2 query
     isOn        是否开启
     alias       别名