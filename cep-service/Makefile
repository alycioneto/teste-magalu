setup:
	npm install yarn -g
	yarn

build-container:
	docker build .

up:
	docker-compose up

down:
	docker-compose down

test:
	yarn run test

build:
	yarn run build

clean:
	rm -rf node_modules
	rm -rf build

lint:
	yarn run lint
