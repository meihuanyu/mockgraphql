pipeline {
    agent {
        docker {
            image 'node' 
            args '-p 4001:4001' 
        }
    }
    environment {
    }
    stages {
        stage('koa') { 
            steps {
                sh 'npm install -g cnpm --registry=https://registry.npm.taobao.org'
                sh 'yarn config set registry https://registry.npm.taobao.org'
                sh './sh/startKoa.sh'
            }
        }
        stage('react') {
            steps {
                sh './sh/startReact.sh'
            }
        }
    }
}

