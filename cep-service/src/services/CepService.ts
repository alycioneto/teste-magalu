
import { ViaCepError } from '../errors'
import { ViaCepClient } from '../clients'
import { CepServiceresponse } from '../types'
import { CEP_LENGTH } from '../constants'

class CepService {
  private cepClient: ViaCepClient

  constructor() {
    this.cepClient = new ViaCepClient()
  }

  public async getCep(cep: string): Promise<CepServiceresponse> {
    try {
      const cepFilled = this.fillZero(cep)
      const address = await this.cepClient.get(cepFilled)

      return {
        rua: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf
      }
    } catch (error) {
      throw new ViaCepError(error.message)
    }
  }

  private fillZero(cep: string) {
    if (cep.length < CEP_LENGTH) {
      return cep.padEnd( CEP_LENGTH, '0' )
    }
    return cep
  }

}

export { CepService }
