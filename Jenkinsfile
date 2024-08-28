pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_USR = credentials('AWS_CREDENTIALS_USR')
        AWS_CREDENTIALS_PSW = credentials('AWS_CREDENTIALS_PSW')
        REGION = credentials('AWS_REGION')
        INSTANCE_ID = credentials('FRONTEND_INST_ID')
        REMOTE_USER = 'ubuntu'
        REMOTE_DIR = '/var/www/html/'
        LOCAL_FILE = './build/*'
        SSH_CREDENTIALS_ID = 'ssh-key-frontend'
        NODE_ENV='production'
    }

    stages {

        stage('Get EC2 Public DNS or IP') {
            steps {
                script {
                    sh """
                        aws configure set aws_access_key_id ${AWS_CREDENTIALS_USR}
                        aws configure set aws_secret_access_key ${AWS_CREDENTIALS_PSW}
                        aws configure set default.region ${REGION}
                    """

                    def remoteHost = sh(
                        script: """
                            aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query 'Reservations[*].Instances[*].PublicDnsName' --output text
                        """,
                        returnStdout: true
                    ).trim()

                    env.REMOTE_HOST = remoteHost
                }
            }
        }

        stage('Checkout from GitHub') {
            steps {
                sshagent(['ssh-private-key']) {
                    checkout([$class: 'GitSCM', 
                        branches: [[name: '*/main']],
                        doGenerateSubmoduleConfigurations: false, 
                        extensions: [], 
                        submoduleCfg: [], 
                        userRemoteConfigs: [[
                            credentialsId: 'ssh-private-key', 
                            url: 'git@github.com:DevOps-ProjectLevel/provedcode-frontend-new-user888.git'
                        ]]
                    ])
                }
            }
        }
        
        stage('Setting .env file'){
            steps{
                sh """
                    echo REACT_APP_BASE_URL=http://${env.REMOTE_HOST} >> .env
                    echo NODE_ENV=${env.NODE_ENV} >> .env
                """
            }
        }

        stage('Installing dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploying to S3 Bucket'){
            steps{
                sh """
                    tar -czvf front_build_`git rev-parse HEAD`.tar ./build
                    gzip front_build_`git rev-parse HEAD`.tar
                    aws s3 cp front_build_`git rev-parse HEAD`.tar.gz s3://bucket-s3-artifactory-frontend/front_build_`git rev-parse HEAD`.tar.gz
                """
            }
        }

        stage('Deploying to Remote Server') {
            steps {
                script {
                    sshagent(credentials: [SSH_CREDENTIALS_ID]) {
                        sh """
                            scp -o StrictHostKeyChecking=no -r ${LOCAL_FILE} ${REMOTE_USER}@${env.REMOTE_HOST}:${REMOTE_DIR}
                            ssh -t -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl restart nginx"
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            dir("${env.WORKSPACE}@tmp") {
                deleteDir()
            }
            dir("${env.WORKSPACE}@script") {
                deleteDir()
            }
            dir("${env.WORKSPACE}@script@tmp") {
                deleteDir()
            }
        }
    }
}
