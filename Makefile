
# See: https://addons.mozilla.org/en-US/developers/addon/api/key/
include .env

.PHONY: dist

release: build sign
	(cd dist ; zip -r ../footprint.zip .)

sign:
	web-ext sign --source-dir dist

build:
	npm run build

watch:
	npm run watch

install:
	npm install
