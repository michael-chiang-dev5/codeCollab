# This script kills nginx docker container, then restarts
# Use with: `nohup sh docker/deployNginx.sh &``
sudo kill $(ps auxww | grep 'sudo docker-compose up' | awk '{print $2}')
cd ../nginx-certbot/
sudo docker-compose up
