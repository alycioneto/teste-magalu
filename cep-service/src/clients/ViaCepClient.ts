import httpStatus from 'http-status-codes'

import { Request } from '../shared/utils'
import { INVALID_CEP } from '../constants'
import { ViaCepError } from '../errors'
import { ViaCepResponse, ICepClient } from '../types'

class ViaCepClient implements ICepClient{
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
        throw new ViaCepError(INVALID_CEP)
      }

      return data
    } catch (error) {
      if (error?.response?.status === httpStatus.BAD_REQUEST) {
        throw new ViaCepError(INVALID_CEP)
      }
      throw new ViaCepError((error as Error ).message)
    }
  }
}

export { ViaCepClient }
