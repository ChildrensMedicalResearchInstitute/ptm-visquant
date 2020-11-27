.DEFAULT_GOAL := help

APP_DIRECTORY=visquant/

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Install dev dependencies 
	yarn --cwd ${APP_DIRECTORY} install

.PHONY: start
start: ## Start application server locally
	yarn --cwd ${APP_DIRECTORY} start

.PHONY: format
format: ## Run prettier formatting on code
	yarn --cwd ${APP_DIRECTORY} prettier --write .

.PHONY: deploy
deploy: ## Deploy application to github
	yarn --cwd ${APP_DIRECTORY} run deploy

.PHONY: test
test: ## Run tests
	yarn --cwd ${APP_DIRECTORY} test

