pipeline{
    agent any
    
    environment {
        GITHUB_TOKEN= credentials('github-token_2')
        PATH = "$PATH:/usr/bin" // Add the directory where docker-compose is installed
    }
    
    stages{
        stage("Clone Code"){
            steps{
                echo "Cloning the code"
                git branch: 'docker', credentialsId: 'github-token_2', url: 'https://github.com/inevitableinfotech/InviHR_Server'
            }
            
        }

        stage("building the code"){
            steps{
                echo "Building the Image"
                sh "cd ${WORKSPACE} && docker build -t ghcr.io/inevitableinfotech/node2-ba:latest ."
            }
                       
        }    
            
        
        stage("Push to Docker Hub"){
            steps{
                echo "Pushing the Image"
                sh "export CR_PAT=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"
                sh "echo $GITHUB_TOKEN_PSW | docker login ghcr.io -u $GITHUB_TOKEN_USR --password-stdin"
                sh "docker push ghcr.io/inevitableinfotech/node2-ba"
                
            }
            
        }
        stage("Deploy"){
            steps{
                echo "Deploying the Container"
                sh "docker-compose down --rmi all && docker-compose up -d"
            }
           
        }
    }
}
