# restful api 计划

## 前端解析 基础模板 合并模板
+ start 3.6
+ end 3.7
> 完成度:0%

## 后端根据基础模板 add delete update表
+ start 3.7
+ end  3.9
> 完成度:0%

## 根据表与模板生成接口 add delete update query(单个,多个)
+ start 3.11
+ end 3.14
> 完成度:0%

## 合并接口方案  自定义function 方案
### 灵感Jenkins 管道式执行
#### query
``` 
     formal_query_class {
          ckeck_token {
               token:ctx.tonken
          }
          class_query {
               params:{class_name,desc}
               re:{id,class_name,desc}
          }

          class_query_list {
               params:{
                    class:[class_name,desc]
                    id:ctx.token
               }
               re:{id,class_name,desc}
          }
     }
     
```
#### delete
``` 
     stage('ckeck_grant'){

     }
     stage('delete_class'){

     }
     stage('delte_student'){
          
     }
     
```
+ start 3.14
+ end 3.14
- 完成度:0%

## end 合并接口 自定义function
+ start 3.14
+ end 3.19
> 完成度:0%
