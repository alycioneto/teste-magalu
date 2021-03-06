import { ViaCepResponse } from ".";

export interface ICepClient {
  get(cep: string): Promise<ViaCepResponse>;
}
