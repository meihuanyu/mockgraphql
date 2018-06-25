import Client from 'mysql-pro'
const client = new Client({     
    mysql: {
        host : '127.0.0.1',
        database : 'mock',
        user: 'root',
        password : ''
    }
}); 

export default client