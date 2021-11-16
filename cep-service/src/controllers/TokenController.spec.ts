// eslint-disable-next-line import/no-extraneous-dependencies
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Response } from "express";
import HttpStatus from "http-status-codes";

import { IUser } from "../types";
import { IUserService } from "../types/IUserService";

import { TokenController } from ".";

interface SutTypes {
  sut: TokenController;
  service: IUserService;
  email: string;
  password: string;
}

const makeService = (): IUserService => {
  class ServiceFake implements IUserService {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    find(email: string, password: string): IUser | undefined {
      return {
        id: "1",
        name: "John",
        email: "john@mail.com",
        password: "john123",
      };
    }
  }

  return new ServiceFake();
};

const makeSut = (): SutTypes => {
  const service = makeService();
  const sut = new TokenController("/token", service);
  const email = "john@mail.com";
  const password = "john123";

  return { sut, service, email, password };
};

let res: Response;
describe('Tests for "TokenController" class', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    const response = getMockRes();
    res = response.res;
  });

  describe('Tests for the "get" method', () => {
    it("Return an error when email and password not sent in params", async () => {
      const req = getMockReq({
        body: {},
      });

      const { sut } = makeSut();

      const { error } = sut.postSchema().body.validate(req.body, sut.validatorConfig.joi);
      expect(error!.details.length).toBe(2);
      expect(error!.details[0].message).toBe('"email" is required');
      expect(error!.details[1].message).toBe('"password" is required');
    });

    it("Return an error when email is not a valid mail", async () => {
      const { sut, password } = makeSut();

      const req = getMockReq({
        body: {
          email: "test",
          password,
        },
      });

      const { error } = sut.postSchema().body.validate(req.body, sut.validatorConfig.joi);

      expect(error!.details.length).toBe(1);
      expect(error!.details[0].message).toBe('"email" must be a valid email');
    });

    it("Return an unauthorized request when service returns not found a user", async () => {
      const { sut, service, email, password } = makeSut();

      const req = getMockReq({
        body: { email, password },
      });

      const createSpy = jest.spyOn(service, "find").mockReturnValueOnce(undefined);

      const { error } = sut.postSchema().body.validate(req.body, sut.validatorConfig.joi);
      res = await sut.post(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(error).toBeUndefined();
      expect(createSpy).toBeCalledWith(email, password);
    });

    it("Expect a status OK when the flow is processed without errors", async () => {
      const { sut, service, email, password } = makeSut();

      const req = getMockReq({
        body: { email, password },
      });

      const createSpy = jest.spyOn(service, "find");

      const { error } = sut.postSchema().body.validate(req.body, sut.validatorConfig.joi);
      res = await sut.post(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalled();
      expect(error).toBeUndefined();
      expect(createSpy).toBeCalled();
    });
  });
});
