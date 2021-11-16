import { ONE_DAY_SECONDS, CEP_ZERO } from "../constants";
import { CepError } from "../errors";
import { StringUtil } from "../shared/utils";
import { CepServiceResponse, ICepClient, ICache, ICepService } from "../types";

const ZERO = "0";

class CepService implements ICepService {
  private cepClient: ICepClient;

  private cache: ICache;

  constructor(cepClient: ICepClient, cache: ICache) {
    this.cepClient = cepClient;
    this.cache = cache;
  }

  private async requestCep(cep: string): Promise<CepServiceResponse> {
    try {
      const address = await this.cepClient.get(cep);

      return {
        rua: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf,
      };
    } catch (error) {
      throw new CepError((error as Error).message);
    }
  }

  private updateCepToRetry(cep: string): string {
    for (let index = cep.length - 1; index >= 0; index--) {
      const element = cep[index];
      if (element !== ZERO) {
        return StringUtil.replaceAt(cep, index, ZERO);
      }
    }
    return cep;
  }

  private async getCep(cep: string): Promise<CepServiceResponse> {
    try {
      return await this.requestCep(cep);
    } catch (error) {
      const cepToRetry = this.updateCepToRetry(cep);
      if (cepToRetry !== CEP_ZERO) {
        const cepResponse = await this.getCep(cepToRetry);
        return cepResponse;
      }

      throw error;
    }
  }

  public async get(cep: string): Promise<CepServiceResponse> {
    const cepResponse = await this.cache.get(cep);
    let cepParsed = cepResponse ? (JSON.parse(cepResponse) as CepServiceResponse) : null;

    if (!cepParsed) {
      cepParsed = await this.getCep(cep);
      const cepJson = JSON.stringify(cepParsed);
      await this.cache.set(cep, cepJson, ONE_DAY_SECONDS);
    }
    return cepParsed;
  }
}

export { CepService };
