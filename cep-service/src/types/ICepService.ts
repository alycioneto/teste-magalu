import { CepServiceResponse } from "./CepServiceResponse";

export interface ICepService {
  get(cep: string): Promise<CepServiceResponse>
}
