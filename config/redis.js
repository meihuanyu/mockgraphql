import ioRedis from 'ioredis'
const redis=new ioRedis({
    host : 'localhost',//安装好的redis服务器地址
    port : 6379,　//端口
    prefix : 'sam:',//存诸前缀
    ttl : 60 * 60 * 23,//过期时间
    db: 0
})
export default redis