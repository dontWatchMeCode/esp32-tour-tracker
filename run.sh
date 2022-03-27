#!/usr/bin/bash

# checks git (https://stackoverflow.com/a/3278427)
# build / recreats the containers
# if db exist it will not be deleted

# -f for force update
# -d adds port mapping for mysql

UPSTREAM=${1:-'@{u}'}
BRANCH="main" # invalid branch will trow error

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "${BRANCH}")
BASE=$(git merge-base @ "${BRANCH}")

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

if [ $COUNT -lt 4 ]; then
    echo "No Container"
    echo "------------"
    docker-compose up --build -d
    exit
fi

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
    echo "----------"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
    echo "------------"
    git pull
    docker-compose up --build -d
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
    echo "------------"
else
    echo "Diverged"
    echo "--------"
fi

if [[ $@ = *"-d"* ]]; then
    git checkout docker-compose.yml >/dev/null 2>&1
fi
