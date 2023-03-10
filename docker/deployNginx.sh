# kill nginx docker container, then restart
sudo kill $(ps auxww | grep 'sudo docker-compose up' | awk '{print $2}')
cd ../nginx-certbot/
sudo docker-compose up
