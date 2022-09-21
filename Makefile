# Yeoman Volto App development

### Defensive settings for make:
#     https://tech.davis-hansson.com/p/make/
SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-xeu -o pipefail -O inherit_errexit -c
.SILENT:
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

# Project settings

DIR=$(shell basename $$(pwd))
ADDON ?= "nsw-design-system-plone6"
GIT_USER='pretagov'
GIT_BRANCH='main'

# Recipe snippets for reuse

# We like colors
# From: https://coderwall.com/p/izxssa/colored-makefile-for-golang-projects
RED=`tput setaf 1`
GREEN=`tput setaf 2`
RESET=`tput sgr0`
YELLOW=`tput setaf 3`


# Top-level targets

.PHONY: project
project:
	npm install -g yo
	npm install -g @plone/generator-volto
	npm install -g mrs-developer
	yo @plone/volto project --addon ${ADDON} --workspace "src/addons/${DIR}" --no-interactive
	ln -sf $$(pwd) project/src/addons/
	cp .project.eslintrc.js .eslintrc.js
	cd project && yarn
	@echo "-------------------"
	@echo "$(GREEN)Volto project is ready!$(RESET)"
	@echo "$(RED)Now run: cd project && yarn start$(RESET)"

.PHONY: all
all: project

.PHONY: bootstrap-test-frontend
bootstrap-test-frontend:
	npx -p yo -p @plone/generator-volto -p @plone/scripts -p mrs-developer addon clone https://github.com/${GIT_USER}/${ADDON}.git --branch ${GIT_BRANCH} --canary
	cd addon-testing-project && yarn install

start-test-frontend:
	$(MAKE) bootstrap-test-frontend
	cd addon-testing-project && yarn build && RAZZLE_API_PATH=http://localhost:55001/plone yarn start:prod

start-test-frontend-dev:
	$(MAKE) bootstrap-test-frontend
	cd addon-testing-project && RAZZLE_API_PATH=http://localhost:55001/plone yarn start

.PHONY: start-test-backend
start-test-backend: ## Start Test Plone Backend
	@echo "$(GREEN)==> Start Test Plone Backend$(RESET)"
	docker run -i --rm -e ZSERVER_HOST=0.0.0.0 -e ZSERVER_PORT=55001 -p 55001:55001 -e SITE=plone -e APPLY_PROFILES=plone.app.contenttypes:plone-content,plone.restapi:default,plone.volto:default-homepage,nswdesignsystem.plone6:default -e CONFIGURE_PACKAGES=plone.app.contenttypes,plone.restapi,plone.volto,plone.volto.cors,nswdesignsystem.plone6 -e ADDONS='plone.app.robotframework plone.app.contenttypes plone.restapi plone.volto nswdesignsystem.plone6' plone ./bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

.PHONY: start-backend-docker
start-backend-docker:		## Starts a Docker-based backend
	@echo "$(GREEN)==> Start Docker-based Plone Backend$(RESET)"
	docker run -it --rm --name=plone -p 8080:8080 -e SITE=Plone -e ADDONS="plone.volto" -e ZCML="plone.volto.cors" plone

.PHONY: help
help:		## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
