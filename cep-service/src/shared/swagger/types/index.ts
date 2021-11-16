interface IParameter {
  name: string
  place: string
  description: string
  required: boolean
  schema: {
    type: string
    example?: string
    format?: string
    enum?: Array<string>
  }
}

interface IResponseSchema {
  ref?: string
  type?: string
}

interface IResponse {
  httpStatus: number
  description?: string
  schema?: IResponseSchema
  contentType?: string
}

interface IContentTypesConsumeAndProduce {
  contentTypeConsume?: string
  contentTypeProduce?: string
}

interface IPath {
  route: string
  get?: any
  post?: any
  patch?: any
  put?: any
  del?: any
}

export { IParameter, IResponseSchema, IResponse, IContentTypesConsumeAndProduce, IPath }
