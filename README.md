![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
# CEP Service

## Description
A Node, Typescript and express API to find CEP for magalu test.

# Principles and best practices
- [Clean code](https://github.com/labs42io/clean-code-typescript)
- Use best practices of [SOLID](https://medium.com/@matheusbessa_44838/princ%C3%ADpios-solid-com-typescript-4f8a9d5d1ef8)
- Make test always
- [Considerations](cep-service/docs/considerations.md)
# How to run

## Production
```bash
# Install yarn, project dependencies and build.
$ make setup
# Run the project.
$ make prod
```
obs: To deploy in production using a container orchestrator like kubernets needs a other docker file with a new configuration.
## Development
```bash
# Build a docker container image.
$ make build-dev-docker-image
# Run container
$ make up
```

## Test
```bash
# Install yarn and project dependencies
$ make setup-test
# Run test
$ make test
```

# API documentation
## Opened Endpoints

Opened endpoints require no Authentication.
### Token:
* [Token](cep-service/docs/token.md) : `POST /token`

### Health:
* Health: `GET /health`

### Info:
* Info: `GET /info`

### Metrics:
* Metrics: `/metrics`
## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### CEP

* [CEP](cep-service/docs/cep.md) : `GET /cep/:cep`
