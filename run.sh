#!/usr/bin/bash

# checks git (https://stackoverflow.com/a/3278427)
# build / recreats the containers
# if db exist it will not be deleted

# -f for force update
# -d adds port mapping for mysql
# -s stops node container after creation

if [[ $@ = *"-h"* ]]; then
    echo "-f for force update"
    echo "-d adds port mapping for mysql"
    echo "-s stops node container"
    exit
fi

GITUPLL=$(git pull)

COUNT=$(docker-compose ps | wc -l)

if [ $# -gt 0 ]; then
    if [[ $@ = *"-d"* ]]; then
        echo "Added port mapping (MySQL)"
        echo "    # temp dev ports" >>docker-compose.yml
        echo "    ports:" >>docker-compose.yml
        echo "      - '127.0.0.1:3306:3306'" >>docker-compose.yml
    fi
    if [[ $@ = *"-f"* ]]; then
        echo "Force update"
        echo "------------"
        docker-compose up --build -d
        if [[ $@ = *"-d"* ]]; then
            git checkout docker-compose.yml >/dev/null 2>&1
        fi
        exit
    fi
fi

if [ "$COUNT" -lt 4 ]; then
    echo "Container missing"
    echo "-----------------"
    docker-compose up --build -d
    exit
fi

if [ "$GITUPLL" = "Already up to date." ]; then
    echo "Up-to-date"
    echo "----------"
else
    echo "Need to Update"
    echo "--------------"
    docker-compose up --build -d
fi

if [[ "$@" = *"-d"* ]]; then
    git checkout docker-compose.yml >/dev/null 2>&1
fi

if [[ "$@" = *"-s"* ]]; then
    docker-compose stop node
fi
