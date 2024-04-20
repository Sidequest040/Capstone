# Jenkins Setup

We have set up Jenkins to automate our build and deployment processes. Jenkins is running inside a Docker container to ensure a consistent environment for all team members.

## Getting Started with Jenkins

### Prerequisites

- Docker must be installed on your machine. Visit [Docker's website](https://www.docker.com/get-started) for installation instructions.

### Running Jenkins

To start the Jenkins server, navigate to the `deploy` directory and run the following command:

```sh
docker run -d --name my-jenkins -p 8080:8080 -p 50000:50000 my-jenkins-image

## Stopping Jenkins
To stop the Jenkins server, run the following command:
docker stop my-jenkins


## Restarting Jenkins
To restart a stopped Jenkins container:
docker start my-jenkins

To restart and apply updates:
docker restart my-jenkins


## Initial Admin Password
Retrieve the initial admin password for Jenkins setup with:
docker exec my-jenkins cat /var/jenkins_home/secrets/initialAdminPassword

