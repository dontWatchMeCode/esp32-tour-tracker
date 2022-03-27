#!/usr/bin/bash

# checks git (https://stackoverflow.com/a/3278427)
# build / recreats the containers
# if db exist it will not be deleted

# -f for force update

UPSTREAM=${1:-'@{u}'}
BRANCH="main" # invalid branch will trow error

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "${BRANCH}")
BASE=$(git merge-base @ "${BRANCH}")

COUNT=$(docker-compose ps | wc -l)

if [ "$1" = "-f" ]; then
    echo "Force update"
    echo "------------"
    docker-compose up --build -d
    exit
fi

if [ $COUNT -lt 4 ]; then
    echo "No Container"
    echo "------------"
    docker-compose up --build -d
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
