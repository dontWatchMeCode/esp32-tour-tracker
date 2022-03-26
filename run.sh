#!/usr/bin/sh
# build / recreats the containers
# if db exist it will not be deleted

docker-compose up --build -d --no-cache
