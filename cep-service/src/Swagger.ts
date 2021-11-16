import * as Cep from './docs/CepController.Swagger'

const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Cep service',
    description: '',
    termsOfService: '',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'local server',
    },
  ],
  paths: {
    ...Cep.getPaths
  },
  components: {
    schemas: { },
    responses: {
      NotFound: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Not found',
          },
        },
      },
      BadRequest: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Bad request',
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
      },
      ServerError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Server error',
          },
        },
      },
      ...Cep.getResponses
    },
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
}

export default swaggerDocument
