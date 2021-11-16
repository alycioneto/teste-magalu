import { Request, Response } from "express";
import jwt from "jwt-simple";

import { BaseController, Schema } from "../shared/controllers";
import { Logger } from "../shared/utils";
import { IUserService } from "../types";

// TODO: passar pro env
const { jwtSecret = "MyS3cr3tK3Y" } = process.env;

class TokenController extends BaseController {
  private userService: IUserService;

  constructor(path: string, userService: IUserService) {
    super(path);
    this.userService = userService;
  }

  public async post(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    Logger.info("POST token", { email });
    const user = this.userService.find(email, password);

    if (user) {
      const payload = { id: user.id };
      const token = jwt.encode(payload, jwtSecret);
      Logger.info("POST token ok", { email });
      return this.ok(res, { token });
    }
    Logger.error("POST token user not found", { email });
    return this.unauthorized(res);
  }

  public postSchema(): Schema {
    const body = this.joi.object({
      email: this.joi.string().email().required(),
      password: this.joi.string().required(),
    });

    return new Schema(body);
  }
}

export { TokenController };
