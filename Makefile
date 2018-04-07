
build: dist
	(cd dist ; zip -r ../footprint.zip .)

dist:
	npm run build

watch:
	npm run watch
