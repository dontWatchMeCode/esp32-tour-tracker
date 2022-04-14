#!/usr/bin/bash

if [ $# -gt 0 ]; then
    if [[ $@ = *"-dev"* ]]; then
        sed -i -e 's/@database/@localhost/g' .env

        echo "    ports: # temp dev ports" >>docker-compose.yml
        echo "      - '127.0.0.1:3306:3306' # temp dev ports" >>docker-compose.yml

        docker-compose up -d db
        docker-compose stop node
        npm run db

        sed -i -e "s/    ports: # temp dev ports//g" docker-compose.yml
        sed -i -e "s/      - '127.0.0.1:3306:3306' # temp dev ports//g" docker-compose.yml
        sed -i -Ez '$ s/\n+$//' docker-compose.yml
        echo "" >>docker-compose.yml

        npm run dev
        exit 1
    fi

    if [[ $@ = *"-l"* ]]; then
        docker-compose logs -f node
        exit 1
    fi

    if [[ $@ = *"-g"* ]]; then
        if [ "$(git pull)" = "Already up to date." ]; then
            echo "Up-to-date"
            echo "----------"
        else
            echo "Need to Update"
            echo "--------------"

            sed -i -e 's/@localhost/@database/g' .env
            docker-compose up --build -d
        fi
    fi

    if [[ $@ = *"-f"* ]]; then
        echo "Force update"
        echo "------------"

        sed -i -e 's/@localhost/@database/g' .env
        docker-compose up --build -d

        read -p "View log of node container (y/n)?" yn
        case $yn in
        [Yy]*)
            docker-compose logs -f node
            exit 1
            ;;
        *) exit 1 ;;
        esac
    fi
else
    echo "-dev  build db container; npm run dev"
    echo "-f    force recreate docker containers"
    echo "-g    git pull; build containers if needed"
    echo "-l    view logs of node container"
    exit
fi
