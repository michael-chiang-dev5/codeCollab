# Description

We use docker as part of our CI/CD pipeline. You don't have to do anything special; this document serves as a reference in case in the future we need to modify our docker files.

## Potential improvements

Currently, docker is only used in production to deploy CodeCollab on AWS. We could also create a docker image with hot reloading for development.

## Useful commands

Create docker image from default Dockerfile with:

```
docker build -t codecollab-prod .
```

Create docker image from given Dockerfile with:

```
docker build -t codecollab-prod -f docker/Dockerfile.dev .
```

Run docker container with a given image:

```
docker run -p 8080:8080 -p 4444:4444 codecollab-prod
```

This creates a container. Port 8080 on localhost is proxied onto port 8080 on the container.

Log into docker container with interactive shell:

```
docker exec -it <CONTAINER_NAME> /bin/bash
```

List containers `docker ps`

Kill container `docker stop <CONTAINER_ID>`

#

ec2 instance: `ssh ec2-user@54.215.164.18`

http://ec2-54-215-164-18.us-west-1.compute.amazonaws.com/

##

This gives a description of how you would configure an nginx proxy

- You don't actually need nginx; you can use proxy the ports directly in docker

https://medium.easyread.co/deploying-go-app-with-nginx-docker-to-aws-ec2-b33d458918fd
