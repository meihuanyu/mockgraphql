import ioRedis from 'ioredis'
const redis=new ioRedis({
    host : '118.24.96.18',//安装好的redis服务器地址
    port : 6379
})
export default redis

