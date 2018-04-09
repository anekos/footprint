
# See: https://addons.mozilla.org/en-US/developers/addon/api/key/
include .env

.PHONY: dist

build: dist sign
	(cd dist ; zip -r ../footprint.zip .)

sign:
	web-ext sign --source-dir dist

dist:
	npm run build

watch:
	npm run watch

install:
	npm install
