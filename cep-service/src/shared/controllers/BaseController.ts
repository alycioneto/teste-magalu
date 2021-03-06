import Joi from "@hapi/joi";
import { NextFunction, Request, Response, Router } from "express";
import { createValidator } from "express-joi-validation";
import HttpStatus from "http-status-codes";

import { HttpMethods } from "../enums/HttpMethods";
import { Auth, Schema, Logger } from "../utils";

abstract class BaseController {
  public router = Router();

  public path: string;

  public validatorConfig = { joi: { allowUnknown: true, abortEarly: false }, passError: true };

  public joi = Joi;

  private auth: Auth | undefined;

  constructor(path: string, auth?: Auth) {
    this.path = path;
    this.auth = auth;
    this.intializeRoute();
  }

  protected executeByStatusCode(req: Request, res: Response): Promise<Response> {
    if (req.method === HttpMethods.POST.toUpperCase()) {
      return this.post(req, res);
    }
    if (req.method === HttpMethods.PATCH.toUpperCase()) {
      return this.patch(req, res);
    }
    if (req.method === HttpMethods.PUT.toUpperCase()) {
      return this.put(req, res);
    }
    if (req.method === HttpMethods.DELETE.toUpperCase()) {
      return this.delete(req, res);
    }

    return this.get(req, res);
  }

  protected intializeRoute() {
    this.setRoute(HttpMethods.GET, this.getSchema());
    this.setRoute(HttpMethods.POST, this.postSchema());
    this.setRoute(HttpMethods.PATCH, this.patchSchema());
    this.setRoute(HttpMethods.PUT, this.putSchema());
    this.setRoute(HttpMethods.DELETE, this.deleteSchema());
  }

  protected async post(req: Request, res: Response) {
    return this.notFound(res);
  }

  protected async get(req: Request, res: Response) {
    return this.notFound(res);
  }

  protected async patch(req: Request, res: Response) {
    return this.notFound(res);
  }

  protected async put(req: Request, res: Response) {
    return this.notFound(res);
  }

  protected async delete(req: Request, res: Response) {
    return this.notFound(res);
  }

  public notFound(res: Response, message?: string) {
    return this.jsonResponse(res, HttpStatus.NOT_FOUND, message || "Not found");
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeByStatusCode(req, res);
      next();
    } catch (error) {
      Logger.error("[BaseController]: Uncaught controller error", error);
      this.fail(res, "An unexpected error occurred");
    }
  }

  public jsonResponse(res: Response, code: number, message: string | object) {
    if (typeof message === "object") {
      return res.status(code).json(message);
    }
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T) {
    return dto ? res.status(HttpStatus.OK).json(dto) : res.status(HttpStatus.OK).send();
  }

  public unauthorized(res: Response, message?: string) {
    return this.jsonResponse(res, HttpStatus.UNAUTHORIZED, message || { message: "Unauthorized" });
  }

  public badRequest(res: Response, message?: string | object) {
    return this.jsonResponse(res, HttpStatus.BAD_REQUEST, message || { message: "Bad request" });
  }

  public fail(res: Response, error: Error | string) {
    const message = error.toString();

    return this.jsonResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  public getSchema(): Schema {
    return new Schema();
  }

  public postSchema(): Schema {
    return new Schema();
  }

  public putSchema(): Schema {
    return new Schema();
  }

  public deleteSchema(): Schema {
    return new Schema();
  }

  public patchSchema(): Schema {
    return new Schema();
  }

  public async customError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (err?.error?.isJoi) {
      const { details } = err.error;
      const errors = details.map((detail: any) => {
        return { message: detail.message };
      });

      res.status(400).json({ errors });
    } else {
      next();
    }
  }

  private setRoute(method: HttpMethods, schema: Schema) {
    const validator = createValidator();
    this.router[method](
      this.path,
      this.auth
        ? this.auth?.authenticate()
        : (req: Request, res: Response, next: NextFunction) => {
            next();
          },
      validator.headers(schema.headers, this.validatorConfig),
      validator.body(schema.body, this.validatorConfig),
      validator.params(schema.params, this.validatorConfig),
      validator.query(schema.query, this.validatorConfig),
      (err: any, req: Request, res: Response, next: NextFunction) =>
        this.customError(err, req, res, next),
      (req: Request, res: Response, next: NextFunction) => this.execute(req, res, next)
    );
  }
}

export { BaseController, Schema };
