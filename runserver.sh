#!/bin/bash

# Enable restart server on change
export FLASK_ENV="development"
# Move to this directory and run app
cd "$(dirname "$0")"
pipenv run python -m flask run
