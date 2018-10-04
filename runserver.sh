#!/bin/bash

# Activate virtual environment
source activate ptm-mapper
# Restart server on change
export FLASK_DEBUG=TRUE
# Move to this directory and run app
cd "$(dirname "$0")"
python3 -m flask run
