#!/usr/bin/sh

# checks git (https://stackoverflow.com/a/3278427)
# build / recreats the containers
# if db exist it will not be deleted

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

COUNT=$(docker-compose ps | wc -l)

if [ $COUNT -lt 3 ]; then
    echo "No Container"
    docker-compose up --build -d
fi

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
    git pull
    docker-compose up --build -d
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi
