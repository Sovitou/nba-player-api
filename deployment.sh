#!/bin/bash

# Check which container is currently active
ACTIVE=$(docker ps --filter "name=nba-player-api" --format "{{.Names}}" | grep -E 'blue|green')

if [ "$ACTIVE" = "blue" ]; then
    # Blue is active, deploy to green
    echo "Deploying to green..."
    docker-compose -f docker-compose.blue-green.yaml up -d --no-deps --build green
    
    # Wait for green to be healthy
    sleep 30
    
    # Switch traffic to green
    sed -i 's/blue:5000/green:5000/' nginx.conf
    docker-compose -f docker-compose.blue-green.yaml exec nginx nginx -s reload
    
    # Stop blue
    docker-compose -f docker-compose.blue-green.yaml stop blue
else
    # Green is active, deploy to blue
    echo "Deploying to blue..."
    docker-compose -f docker-compose.blue-green.yaml up -d --no-deps --build blue
    
    # Wait for blue to be healthy
    sleep 30
    
    # Switch traffic to blue
    sed -i 's/green:5000/blue:5000/' nginx.conf
    docker-compose -f docker-compose.blue-green.yaml exec nginx nginx -s reload
    
    # Stop green
    docker-compose -f docker-compose.blue-green.yaml stop green
fi