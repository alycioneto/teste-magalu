import httpStatus from 'http-status-codes'

import { Request } from '../shared/utils'
import { INVALID_CEP } from '../constants'
import { ViaCepError } from '../errors'
import { ViaCepResponse } from '../types'

const { VIACEP_BASE_URL } = process.env

class ViaCepClient {
  private client: Request

  constructor(viaCepUrl: string) {
    this.client = new Request(viaCepUrl)
  }

  public async get(postalCode: string): Promise<ViaCepResponse> {
    const path = `/ws/${postalCode}/json/`
    try {
      const response = await this.client.get(path)
      const { data } = response

      if (data.erro) {
        console.log("data.erro", data.erro)
        throw new ViaCepError(INVALID_CEP)
      }

      return data
    } catch (error) {
      console.log(error)
      throw new ViaCepError(INVALID_CEP)
    }
  }
}

export { ViaCepClient }
