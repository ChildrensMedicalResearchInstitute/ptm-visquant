:: Activate virtual environment
call conda activate ptm-visquant
:: Restart server on change
set FLASK_DEBUG=TRUE
:: Start app
call python -m flask run
pause
