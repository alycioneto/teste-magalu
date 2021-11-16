import { ViaCepResponse } from "../types"

export interface ICepClient {
  get(cep: string): Promise<ViaCepResponse>
}
