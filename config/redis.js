import ioRedis from 'ioredis'
const redis=new ioRedis({
    port: 6379,          // Redis port
    host: '47.100.103.106',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'showrpasswordredis',
    db: 0
  })

export default redis

