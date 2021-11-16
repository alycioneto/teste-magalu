/* eslint-disable import/no-extraneous-dependencies */
import httpStatus from "http-status-codes";
import nock from "nock";

import { INVALID_CEP } from "../constants/CepMessages";
import { ViaCepError } from "../errors/ViaCepError";
import { ViaCepClient } from "./ViaCepClient";

const { VIACEP_BASE_URL = "https://viacep.com.br/" } = process.env;
const validPostalCode = "90220010";
const invalidPostalCode = "80730441";
const invalidPostalCodeFormat = "90220--44aaa";

interface SutTypes {
  sut: ViaCepClient;
}

const makeSut = (): SutTypes => {
  const sut = new ViaCepClient(VIACEP_BASE_URL!);

  return { sut };
};

describe('Tests for "ViaCepClient" class', () => {
  describe('Tests for "get" method', () => {
    let nockObject: nock.Scope;

    beforeEach(() => {
      nock.cleanAll();

      nockObject = nock(VIACEP_BASE_URL!);
    });

    it('SHOULD return "INVALID_CEP message" WHEN postalCode with invalid format is sent', async () => {
      nockObject.get(`/ws/${invalidPostalCodeFormat}/json/`).reply(httpStatus.BAD_REQUEST, {});

      const { sut } = makeSut();

      await expect(sut.get(invalidPostalCodeFormat)).rejects.toThrow(new ViaCepError(INVALID_CEP));
    });

    it('SHOULD return "INVALID_CEP message" WHEN invalid postalCode is sent', async () => {
      nockObject.get(`/ws/${invalidPostalCode}/json/`).reply(httpStatus.OK, {
        erro: true,
      });

      const { sut } = makeSut();

      await expect(sut.get(invalidPostalCode)).rejects.toThrow(new ViaCepError(INVALID_CEP));
    });

    it('SHOULD return "ViaCepError" WHEN something goes wrong in request', async () => {
      nockObject.get(`/ws/${validPostalCode}/json/`).replyWithError("Something went wrong");

      const { sut } = makeSut();

      await expect(sut.get(validPostalCode)).rejects.toThrow(
        new ViaCepError("Something went wrong")
      );
    });

    it('SHOULD return "data as ViaCepResponse" WHEN request is right', async () => {
      nockObject.get(`/ws/${validPostalCode}/json/`).reply(httpStatus.OK, {
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

      const { sut } = makeSut();

      const responseData = await sut.get(validPostalCode);

      expect(responseData).toStrictEqual({
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
    });
  });
});
