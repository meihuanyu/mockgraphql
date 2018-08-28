import Client from 'mysql-pro'
const client = new Client({     
    mysql: {
        host : '172.96.221.198',
        database : 'mock',
        user: 'root',
        password : '1234'
    }
}); 

export default client