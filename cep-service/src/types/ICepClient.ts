import { ViaCepResponse } from "../types"

export interface ICepClient {
  get(postalCode: string): Promise<ViaCepResponse>
}
