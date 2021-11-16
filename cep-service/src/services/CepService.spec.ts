/* eslint-disable unused-imports/no-unused-vars-ts */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import { CepError } from "../errors";
import { ICache, ICepClient, ViaCepResponse } from "../types";
import { CepService } from "./CepService";

const makeClient = (): ICepClient => {
  class ClientFake implements ICepClient {
    get(cep: string): Promise<ViaCepResponse> {
      return Promise.resolve({
        cep: "90220-011",
        logradouro: "Rua Santo Antônio",
        complemento: "lado ímpar",
        bairro: "Floresta",
        localidade: "Porto Alegre",
        uf: "RS",
        ibge: "4314902",
        gia: "",
        ddd: "51",
        siafi: "8801",
      });
    }
  }

  return new ClientFake();
};

const makeCache = (): ICache => {
  class CacheFake implements ICache {
    get(key: string): Promise<string | null> {
      return Promise.resolve(
        '{"bairro":"Floresta","cidade":"Porto Alegre","estado":"RS","rua":"Rua Santo Antônio"}'
      );
    }

    set(key: string, value: string, maxAge?: number): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CacheFake();
};

interface SutTypes {
  sut: CepService;
  client: ICepClient;
  cache: ICache;
  cep: string;
}

const makeSut = (): SutTypes => {
  const client = makeClient();
  const cache = makeCache();
  const sut = new CepService(client, cache);
  const cep = "90220010";

  return { sut, client, cache, cep };
};

describe('Tests for "CepService" class', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Tests for the "requestCep" method', () => {
    it("Should throw an error when ICepClient throws", async () => {
      const { sut, client, cep } = makeSut();

      const createSpy = jest.spyOn(client, "get").mockRejectedValue(new Error());

      await expect(sut["requestCep"](cep)).rejects.toThrowError(new CepError());
      expect(createSpy).toBeCalledWith(cep);
    });

    it("Should return a CepServiceResponse when ICepClient returns a address", async () => {
      const { sut, client, cep } = makeSut();

      const createSpy = jest.spyOn(client, "get");
      const response = await sut["requestCep"](cep);
      expect(createSpy).toBeCalledWith(cep);
      expect(response).toStrictEqual({
        bairro: "Floresta",
        cidade: "Porto Alegre",
        estado: "RS",
        rua: "Rua Santo Antônio",
      });
    });
  });
  describe('Tests for the "updateCepToRetry" method', () => {
    it("Should return 9022010 when called with 90220012", async () => {
      const { sut, cep } = makeSut();

      const response = sut["updateCepToRetry"]("90220012");
      expect(response).toBe(cep);
    });

    it("Should return 90220000 when called with 90220010", async () => {
      const { sut, cep } = makeSut();

      const response = sut["updateCepToRetry"](cep);

      expect(response).toBe("90220000");
    });

    it("Should return 00000000 when called with 90000000", async () => {
      const { sut } = makeSut();

      const response = sut["updateCepToRetry"]("90000000");

      expect(response).toBe("00000000");
    });
  });

  describe('Tests for the "getCep" method', () => {
    it("Should return CepServiceResponse when find an address", async () => {
      const { sut, cep } = makeSut();
      const response = await sut["getCep"](cep);

      expect(response).toStrictEqual({
        bairro: "Floresta",
        cidade: "Porto Alegre",
        estado: "RS",
        rua: "Rua Santo Antônio",
      });
    });

    it("Should call two times getCep and requestCep when find only on second time an address and then return", async () => {
      const { sut, cep } = makeSut();

      const createSpyRequestCep = jest
        .spyOn(sut as any, "requestCep")
        .mockRejectedValueOnce(new Error());
      const createSpyGetCep = jest.spyOn(sut as any, "getCep");
      const response = await sut["getCep"](cep);

      expect(createSpyRequestCep).toBeCalledTimes(2);
      expect(createSpyGetCep).toBeCalledTimes(2);
      expect(response).toStrictEqual({
        bairro: "Floresta",
        cidade: "Porto Alegre",
        estado: "RS",
        rua: "Rua Santo Antônio",
      });
    });

    it("Should call two times getCep and one time requestCep and throw an error when 01000000 not valid cep", async () => {
      const { sut } = makeSut();

      const createSpyRequestCep = jest
        .spyOn(sut as any, "requestCep")
        .mockRejectedValueOnce(new Error());
      const createSpyGetCep = jest.spyOn(sut as any, "getCep");

      await expect(sut["getCep"]("01000000")).rejects.toThrow();
      expect(createSpyRequestCep).toBeCalledTimes(1);
      expect(createSpyGetCep).toBeCalledTimes(1);
    });
  });

  describe('Tests for the "get" method', () => {
    it("Should return CepServiceResponse when find an address in cache", async () => {
      const { sut, cache, cep } = makeSut();

      const createSpy = jest.spyOn(cache, "get");
      const response = await sut.get(cep);

      expect(createSpy).toBeCalledWith(cep);
      expect(response).toStrictEqual({
        bairro: "Floresta",
        cidade: "Porto Alegre",
        estado: "RS",
        rua: "Rua Santo Antônio",
      });
    });

    it("Should return CepServiceResponse when not find an address in cache but find in request then save in cache", async () => {
      const { sut, cache, cep } = makeSut();

      const createSpyGetCache = jest.spyOn(cache, "get").mockResolvedValueOnce(null);
      const createSpySetCache = jest.spyOn(cache, "set");
      const response = await sut.get(cep);

      expect(createSpyGetCache).toBeCalledWith(cep);
      expect(createSpySetCache).toBeCalled();
      expect(response).toStrictEqual({
        bairro: "Floresta",
        cidade: "Porto Alegre",
        estado: "RS",
        rua: "Rua Santo Antônio",
      });
    });
  });
});
