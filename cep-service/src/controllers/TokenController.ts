import { Request, Response } from "express";

import { BaseController, Schema } from "../shared/controllers";
import { Logger, Jwt } from "../shared/utils";
import { IUserService } from "../types";

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
      const token = Jwt.encode({ id: user.id });
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
