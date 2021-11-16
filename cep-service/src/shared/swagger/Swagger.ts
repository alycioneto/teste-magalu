import { IContentTypesConsumeAndProduce, IResponse, IPath, IResponseSchema, IParameter } from './types'

class Swagger {
  public static useAuth(): any {
    return {
      security: [
        {
          apiKey: [],
        },
      ],
    }
  }

  public static contentTypesConsumeAndProduce(data?: IContentTypesConsumeAndProduce): any {
    return {
      consumes: [data?.contentTypeConsume || 'application/json'],
      produces: [data?.contentTypeProduce || 'application/json'],
    }
  }

  public static sellerIdInHeader(): IParameter {
    return Swagger.parameter({
      place: 'header',
      name: 'sellerid',
      schema: {
        type: 'string',
      },
      required: true,
      description: 'Seller id',
    })
  }

  public static parameter({ name, place, description, required, schema }: IParameter): any {
    return {
      name,
      in: place,
      description,
      required,
      schema,
    }
  }

  public static response({ description, schema, contentType, httpStatus }: IResponse): any {
    return {
      [httpStatus]: {
        description,
        content: {
          [contentType || 'application/json']: {
            schema: {
              $ref: schema?.ref,
              type: schema?.type,
            },
          },
        },
      },
    }
  }

  public static responseNotFound(schema?: IResponseSchema): any {
    const response = Swagger.response({
      httpStatus: 404,
      description: 'Not Found',
      schema: schema || { ref: '#/components/responses/NotFound' },
    })
    return response
  }

  public static responseBadRequest(schema?: IResponseSchema): any {
    const response = Swagger.response({
      httpStatus: 400,
      description: 'Bad Request',
      schema: schema || { ref: '#/components/responses/BadRequest' },
    })
    return response
  }

  public static responseUnauthorized(): any {
    return Swagger.response({
      httpStatus: 401,
      description: 'Unauthorized',
      schema: { ref: '#/components/responses/Unauthorized' },
      contentType: 'text/plain',
    })
  }

  public static responseServerError(schema?: IResponseSchema): any {
    const response = Swagger.response({
      httpStatus: 500,
      description: 'Server error',
      schema: schema || { ref: '#/components/responses/ServerError' },
    })
    return response
  }

  public static route({ route, get, post, patch, put, del }: IPath): any {
    return {
      [route]: {
        get,
        post,
        patch,
        put,
        delete: del,
      },
    }
  }
}

export { Swagger }
