import { CepError } from '../errors'
import { ViaCepClient } from '../clients'
import { CepServiceResponse } from '../types'
import { ONE_DAY_SECONDS } from '../constants'
import { StringUtil } from '../shared/utils'
import { ICache, ICepService } from '../types'

class CepService implements ICepService {
  private cepClient: ViaCepClient
  private cache: ICache

  constructor(cepClient: ViaCepClient, cache: ICache) {
    this.cepClient = cepClient
    this.cache = cache
  }

  private async requestCep(cep: string): Promise<CepServiceResponse> {
    try {
      const address = await this.cepClient.get(cep)

      return {
        rua: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf
      }
    } catch (error) {
      throw new CepError((error as Error).message)
    }
  }

  private updateCepToRetry(cep: string): string {
    for (let index = cep.length - 1; index >= 0; index--) {
      const element = cep[index]
      if(element !== "0") {
        return StringUtil.replaceAt(cep, index, "0")
      }
    }
    return cep
  }

  private async getCep(cep: string): Promise<CepServiceResponse> {
    try {
      return await this.requestCep(cep)
    } catch(error) {
      const cepToRetry = this.updateCepToRetry(cep)
      if (cepToRetry !== "00000000") {
        return await this.getCep(cepToRetry)
      }

      throw error
    }
  }

  public async get(cep: string): Promise<CepServiceResponse> {
    const cepResponse = await this.cache.get(cep)
    let cepParsed = cepResponse ? JSON.parse(cepResponse) as CepServiceResponse: null

    if (!cepParsed) {
      cepParsed = await this.getCep(cep)
      const cepJson = JSON.stringify(cepParsed)
      await this.cache.set(cep, cepJson, ONE_DAY_SECONDS)
    }
    return cepParsed
  }
}

export { CepService }
