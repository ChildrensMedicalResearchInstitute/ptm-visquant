APP_DIRECTORY=visquant/

.PHONY: dev
dev:
	yarn --cwd ${APP_DIRECTORY} install

.PHONY: start
start:
	yarn --cwd ${APP_DIRECTORY} start

.PHONY: deploy
deploy:
	yarn --cwd ${APP_DIRECTORY} run deploy

.PHONY: test
test:
	yarn --cwd ${APP_DIRECTORY} test

