import { Request, Response } from 'express'

import { BaseController, Schema } from '../shared/controllers'
import { CepService } from '../services'
import { INVALID_CEP } from '../constants'
import { Auth } from '../shared/utils'

const VALID_POSTAL_CODE = /\d{8}/

class CepController extends BaseController {
  private cepService: CepService

  constructor(path: string, cepService: CepService, auth: Auth) {
    super(path, auth)
    this.cepService = cepService
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const { params } = req

    try {
      const { cep } = params
      const address = await this.cepService.get(cep as string)

      return this.ok(res, address)
    } catch (error) {
      return this.badRequest(res, INVALID_CEP)
    }
  }

  public getSchema(): Schema {
    const params = this.joi.object({
      cep: this.joi.string().regex(VALID_POSTAL_CODE).required(),
    })

    return new Schema(undefined, params)
  }
}

export { CepController }
