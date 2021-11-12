import Joi from '@hapi/joi'
import { Request, Response, Router } from 'express'
import { createValidator } from 'express-joi-validation'
import HttpStatus from 'http-status-codes'

import { HttpMethods } from '../enum/HttpMethods'

abstract class BaseController {
  public router = Router()

  public path: string

  public validatorConfig = { joi: { allowUnknown: true, abortEarly: false }, passError: true }

  public joi = Joi

  constructor(path: string) {
    this.path = path
    this.intializeRoute()
  }

  protected executeByStatusCode(req: Request, res: Response): Promise<Response> {
    if (req.method === HttpMethods.POST.toUpperCase()) {
      return this.post(req, res)
    }
    if (req.method === HttpMethods.PATCH.toUpperCase()) {
      return this.patch(req, res)
    }
    if (req.method === HttpMethods.PUT.toUpperCase()) {
      return this.put(req, res)
    }
    if (req.method === HttpMethods.DELETE.toUpperCase()) {
      return this.delete(req, res)
    }

    return this.get(req, res)
  }

  protected intializeRoute() {
    this.setRoute(HttpMethods.GET, this.getSchema())
    this.setRoute(HttpMethods.POST, this.postSchema())
    this.setRoute(HttpMethods.PATCH, this.patchSchema())
    this.setRoute(HttpMethods.PUT, this.putSchema())
    this.setRoute(HttpMethods.DELETE, this.deleteSchema())
  }

  protected async post(req: Request, res: Response) {
    return this.notFound(res)
  }

  protected async get(req: Request, res: Response) {
    return this.notFound(res)
  }

  protected async patch(req: Request, res: Response) {
    return this.notFound(res)
  }

  protected async put(req: Request, res: Response) {
    return this.notFound(res)
  }

  protected async delete(req: Request, res: Response) {
    return this.notFound(res)
  }

  public async execute(req: Request, res: Response, next: Function): Promise<void> {
    try {
      await this.executeByStatusCode(req, res)
      next()
    } catch (err) {
      console.error('[BaseController]: Uncaught controller error')
      console.error(err)
      this.fail(res, 'An unexpected error occurred')
    }
  }

  public jsonResponse(res: Response, code: number, message: string | object) {
    if (typeof message === 'object') {
      return res.status(code).json(message)
    }
    return res.status(code).json({ message })
  }

  public ok(res: Response, dto?: any) {
    return dto ? res.status(HttpStatus.OK).json(dto) : res.status(HttpStatus.OK).send()
  }

  public unauthorized(res: Response, message?: string) {
    return this.jsonResponse(res, HttpStatus.UNAUTHORIZED, message || 'Unauthorized')
  }

  public notFound(res: Response, message?: string) {
    return this.jsonResponse(res, HttpStatus.NOT_FOUND, message || 'Not found')
  }

  public fail(res: Response, error: Error | string) {
    const message = error.toString()

    return this.jsonResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, message)
  }

  public getSchema(): Schema {
    return new Schema()
  }

  public postSchema(): Schema {
    return new Schema()
  }

  public putSchema(): Schema {
    return new Schema()
  }

  public deleteSchema(): Schema {
    return new Schema()
  }

  public patchSchema(): Schema {
    return new Schema()
  }

  private setRoute(method: HttpMethods, schema: Schema) {
    const validator = createValidator()
    validator.headers(schema.headers, this.validatorConfig),
    validator.body(schema.body, this.validatorConfig),
    validator.params(schema.params, this.validatorConfig),
    validator.query(schema.query, this.validatorConfig),
    (req: Request, res: Response, next: Function) => this.execute(req, res, next)
  }
}

class Schema {
  public body: Joi.Schema

  public params: Joi.Schema

  public query: Joi.Schema

  public headers: Joi.Schema

  constructor(body?: Joi.Schema, params?: Joi.Schema, query?: Joi.Schema, headers?: Joi.Schema) {
    this.body = body || Joi.object()
    this.params = params || Joi.object()
    this.query = query || Joi.object()
    this.headers = headers || Joi.object()
  }
}

export { BaseController, Schema }
