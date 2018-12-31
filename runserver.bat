:: Activate virtual environment
call conda activate ptm-visquant
:: Restart server on change
set FLASK_ENV="development"
:: Start app
call python -m flask run
pause
