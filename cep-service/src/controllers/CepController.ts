import { Request, Response } from 'express'

import { BaseController, Schema } from '../shared/controllers'
import { CepService } from '../services'
import { INVALID_CEP } from '../constants'

class CepController extends BaseController {
  private postalCodeService: CepService

  constructor(path: string) {
    super(path)
    this.postalCodeService = new CepService()
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const { params } = req

    try {
      const { cep } = params
      const address = await this.postalCodeService.getCep(cep as string)

      return this.ok(res, address)
    } catch (error) {
      return this.badRequest(res, INVALID_CEP)
    }
  }

  public getSchema(): Schema {
    const params = this.joi.object({
      cep: this.joi.string().required(),
    })

    return new Schema(undefined, params)
  }
}

export { CepController }
