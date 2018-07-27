:: Activate virtual environment
call conda activate ptm-mapper
:: Restart server on change
setlocal
    set FLASK_DEBUG=TRUE
endlocal
:: Start app
call python -m flask run
pause 
