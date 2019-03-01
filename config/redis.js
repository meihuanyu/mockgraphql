import ioRedis from 'ioredis'
const redis=new ioRedis({
    port: 6379,          // Redis port
    host: '118.24.96.18',   // Redis host
    // family: 4,           // 4 (IPv4) or 6 (IPv6)
    // password: 'showrpasswordredis',
    db: 0
  })

export default redis

