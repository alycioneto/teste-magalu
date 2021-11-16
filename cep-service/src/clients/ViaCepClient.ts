import httpStatus from "http-status-codes";

import { INVALID_CEP } from "../constants";
import { ViaCepError } from "../errors";
import { Request, Logger } from "../shared/utils";
import { ViaCepResponse, ICepClient } from "../types";

class ViaCepClient implements ICepClient {
  private client: Request;

  constructor(viaCepUrl: string) {
    this.client = new Request(viaCepUrl);
  }

  public async get(cep: string): Promise<ViaCepResponse> {
    const path = `/ws/${cep}/json/`;
    try {
      Logger.info("Request ViaCep", { cep });
      const response = await this.client.get(path);
      const { data } = response;

      if (data.erro) {
        throw new ViaCepError(INVALID_CEP);
      }

      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.status === httpStatus.BAD_REQUEST) {
        Logger.error("ViaCep BadRequest", { cep });
        throw new ViaCepError(INVALID_CEP);
      }
      Logger.error("ViaCep unkwon error", { cep });
      throw new ViaCepError((error as Error).message);
    }
  }
}

export { ViaCepClient };
