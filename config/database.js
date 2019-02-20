import Client from 'mysql-pro'
const client = new Client({     
    mysql: {
        host : '47.100.103.106',
        database : 'mock',
        user: 'root',
        password : 'showrpassword'
    }
}); 

export default client