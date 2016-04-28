JSFILES=lib/*/*.js test/*.js test/*/*.js watcher.js
TESTFILES=test/controllers/*.js test/dao/*.js test/delegates/*.js test/models/*.js test/services/*.js
JSHINT=node_modules/.bin/jshint
MOCHA=node_modules/.bin/mocha

all:
	@make npm
	@make test

npm:
	@npm install

jshint:
	@( $(JSHINT) --verbose --reporter node_modules/jshint-stylish/ $(JSFILES) )

test:
	@( [ -d node_modules ] || make npm )
	@( $(MOCHA) $(TESTFILES) )
	@( make jshint )

test-short:
	@( [ -d node_modules ] || make npm )
	@( $(MOCHA) --reporter dot $(TESTFILES) )

watch:
	@( ./watcher.js )

.PHONY:	npm
.PHONY:	test
.PHONY:	jshit
.PHONY:	watch
