#!/usr/bin/env bash

# Prepare build
echo Prepare build
git pull

# Build and start website
echo Build and start website
sudo docker compose up --build
