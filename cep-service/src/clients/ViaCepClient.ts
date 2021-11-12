import httpStatus from 'http-status-codes'

import { Request } from '../shared/utils'
import { INVALID_POSTAL_CODE_PT_BR } from '../constants'
import { ViaCepError } from '../errors'
import { ViaCepResponse } from '../types'

const { VIACEP_BASE_URL } = process.env

class ViaCepClient {
  private client: Request

  constructor() {
    this.client = new Request(VIACEP_BASE_URL as string)
  }

  public async get(postalCode: string): Promise<ViaCepResponse> {
    const path = `/ws/${postalCode}/json/`
    try {
      const response = await this.client.get(path)
      const { data } = response

      if (data.erro) {
        throw new ViaCepError(INVALID_POSTAL_CODE_PT_BR)
      }

      return data
    } catch (error) {
      if (error.response?.status === httpStatus.BAD_REQUEST) {
        throw new ViaCepError(INVALID_POSTAL_CODE_PT_BR)
      }
      throw new ViaCepError(error.message)
    }
  }
}

export { ViaCepClient }
