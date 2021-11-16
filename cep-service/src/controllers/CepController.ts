import { Request, Response } from "express";

import { INVALID_CEP } from "../constants";
import { BaseController, Schema } from "../shared/controllers";
import { Auth, Logger } from "../shared/utils";
import { CepServiceResponse, ICepService } from "../types";

const VALID_POSTAL_CODE = /\d{8}/;

class CepController extends BaseController {
  private cepService: ICepService;

  constructor(path: string, cepService: ICepService, auth?: Auth) {
    super(path, auth);
    this.cepService = cepService;
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const { params } = req;

    try {
      const { cep } = params;

      Logger.info("GET cep", { cep });
      const address = await this.cepService.get(cep as string);

      Logger.info("GET cep ok", { cep, address });
      return this.ok<CepServiceResponse>(res, address);
    } catch (error) {
      Logger.error("GET cep error", { params });
      return this.badRequest(res, INVALID_CEP);
    }
  }

  public getSchema(): Schema {
    const params = this.joi.object({
      cep: this.joi.string().regex(VALID_POSTAL_CODE).required(),
    });

    return new Schema(undefined, params);
  }
}

export { CepController };
