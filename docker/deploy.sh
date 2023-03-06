# This shell script stops all containers running codecollab, rebuilds the docker image, then re-runs the container with the new image
# Note that sudo is required to run docker on EC2
# If you want to disconnect this from the terminal: 
#   nohup sh docker/deploy.sh &
sudo docker stop $(sudo docker ps -q --filter ancestor=codecollab-prod )
sudo docker image rm codecollab-prod
sudo docker build -t codecollab-prod .
sudo docker run -p 80:8080 -p 4444:4444 codecollab-prod
