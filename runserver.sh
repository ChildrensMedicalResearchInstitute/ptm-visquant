#!/bin/bash

# Activate virtual environment
source activate ptm-visquant
# Restart server on change
export FLASK_ENV="development"
# Move to this directory and run app
cd "$(dirname "$0")"
python3 -m flask run
