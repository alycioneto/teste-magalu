setup:
	npm install yarn -g
	yarn
	yarn run build

setup-test:
	npm install yarn -g
	yarn

build-dev-docker-image:
	docker build .

up:
	docker-compose up

down:
	docker-compose down

test:
	yarn run test

clean:
	rm -rf node_modules
	rm -rf build

lint:
	yarn run lint

prod:
	yarn build
	yarn start:prod
