import { INVALID_CEP } from './../constants/CepMessages';

import { CepError } from '../errors'
import { ViaCepClient } from '../clients'
import { CepServiceResponse } from '../types'
import { ONE_DAY_SECONDS } from '../constants'
import { Redis, StringUtil } from '../shared/utils'

class CepService {
  private cepClient: ViaCepClient

  constructor() {
    this.cepClient = new ViaCepClient()
  }

  private async getCep(cep: string): Promise<CepServiceResponse> {
    try {
      const address = await this.cepClient.get(cep)

      return {
        rua: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf
      }
    } catch (error) {
      throw new CepError(error.message)
    }
  }

  private async getCepWithFixedCep(cep: string, index: number): Promise<CepServiceResponse> {
    let cepResponse
    let cepFixed = index === cep.length ? cep : StringUtil.replaceAt(cep, index)
    cepResponse = await this.cacheCep(cepFixed)
    return cepResponse
  }

  private async cacheCep(cep: string): Promise<CepServiceResponse> {
    let cepResponse = Redis.get(cep)
    if (!cepResponse) {
      cepResponse = await this.getCep(cep)
      Redis.set(cep, cepResponse, ONE_DAY_SECONDS)
    }
    return cepResponse as CepServiceResponse
  }

  public async get(cep: string) {
    let cepResponse
    for (let index = cep.length; index > 0; index--) {
      try {
        cepResponse = await this.getCepWithFixedCep(cep, index)
        if (cepResponse) {
          break
        }
      } catch (error) {
        console.error(error)
      }

    }

    if (!cepResponse) {
      throw new CepError(INVALID_CEP)
    }

    return cepResponse
  }

}

export { CepService }
