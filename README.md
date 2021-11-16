# CEP Service

## Description
A API to find CEP for magalu test.

# Principles and best practices
- [Clean code](https://github.com/labs42io/clean-code-typescript)
- Use best practices of [SOLID](https://medium.com/@matheusbessa_44838/princ%C3%ADpios-solid-com-typescript-4f8a9d5d1ef8)
- Make test always

# Installation

## Production
```bash
# Install yarn, project dependencies and build.
$ make setup
# Run the project.
$ make prod
```
## Development
```bash
# Build a docker container image.
$ make build-container
# Run container
$ make up
```

# API documentation
## Open Endpoints

Open endpoints require no Authentication.
### Token
* [Token](cep-service/docs/token.md) : `POST /token`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### CEP

* [CEP](cep-service/docs/cep.md) : `GET /cep/:cep`
