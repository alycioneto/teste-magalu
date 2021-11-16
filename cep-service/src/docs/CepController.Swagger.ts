import { Swagger } from '../shared/swagger'

const getPathGet = {
  tags: ['cep'],
  summary: 'Get address by cep',
  description: '',
  operationId: 'cep',
  ...Swagger.contentTypesConsumeAndProduce(),
  ...Swagger.useAuth(),
  responses: {
    ...Swagger.response({
      httpStatus: 200,
      schema: { ref: '#/components/responses/CepResponseSuccess' },
    }),
    ...Swagger.responseBadRequest({ ref: '#/components/responses/InvalidCep' }),
    ...Swagger.responseUnauthorized(),
  },
}

const getPaths = {
  ...Swagger.route({ route: '/cep/:cep', get: getPathGet }),
}

const getResponses = {
  CepResponseSuccess: {
    type: 'object',
    properties: {
      cep: {
        type: '90220010',
        example: '80730440',
      },
      street: {
        type: 'string',
        example: 'Avenida Cândido Hartmann',
      },
      neighbourhood: {
        type: 'string',
        example: 'Mercês',
      },
      complement: {
        type: 'string',
        example: 'até 814/815',
      },
      city: {
        type: 'string',
        example: 'Curitiba',
      },
      state: {
        type: 'string',
        example: 'PR',
      },
    },
  },
  InvalidCep: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'CEP Inválido',
      },
    },
  },
}

export { getPaths, getResponses }
