pipeline {
    agent {
        docker {
            image 'node:9-alpine' 
            args '-p 4001:4001' 
        }
    }
    stages {
        stage('koa') { 
            steps {
                sh 'yarn config set registry https://registry.npm.taobao.org'
                sh './sh/startKoa.sh'
            }
        }
    }
}

