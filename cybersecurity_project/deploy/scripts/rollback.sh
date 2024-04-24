#!/bin/bash
# Commands to stop the current container and start the previous one, for example:
docker-compose down
docker-compose up -d previous-version
