import { CEP_CACHE_MAX_AGE_SECONDS, CEP_ZERO } from "../constants";
import { CepError } from "../errors";
import { StringUtil } from "../shared/utils";
import { CepServiceResponse, ICepClient, ICache, ICepService } from "../types";

class CepService implements ICepService {
  private cepClient: ICepClient;

  private cache: ICache;

  constructor(cepClient: ICepClient, cache: ICache) {
    this.cepClient = cepClient;
    this.cache = cache;
  }

  public async get(cep: string): Promise<CepServiceResponse> {
    const cepResponse = await this.cache.get(cep);
    let cepParsed = cepResponse ? (JSON.parse(cepResponse) as CepServiceResponse) : null;

    if (!cepParsed) {
      cepParsed = await this.getCep(cep);
      const cepJson = JSON.stringify(cepParsed);
      await this.cache.set(cep, cepJson, parseInt(CEP_CACHE_MAX_AGE_SECONDS!, 10));
    }
    return cepParsed;
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
      if (element !== "0") {
        return StringUtil.replaceAt(cep, index, "0");
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
}

export { CepService };
