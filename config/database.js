import Client from 'mysql-pro'
const client = new Client({     
    mysql: {
        host : '118.24.96.18',
        database : 'mock',
        user: 'root',
        password : 'KeYpZrZx'
    }
}); 

export default client