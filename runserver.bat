:: Enable restart server on change
set FLASK_ENV="development"
:: Start app
call pipenv run python -m flask run
pause
