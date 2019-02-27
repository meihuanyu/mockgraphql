pipeline {
    agent {
        docker {
            image 'node' 
            args '-p 4001:4001' 
        }
    }
    environment {
        HOME = '.'
        CI = 'true'
    }
    stages {
        stage('koa') { 
            steps {
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

