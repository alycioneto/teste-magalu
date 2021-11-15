import { ICepService } from './../types/ICepService'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Response } from 'express'
import { CepController } from '../controllers'
import { CepServiceResponse } from '../types'
import HttpStatus from 'http-status-codes'

interface SutTypes {
  sut: CepController
  service: ICepService
  cep: string
}

const makeService = (): ICepService => {
  class ServiceFake implements ICepService {
    get(cep: string): Promise<CepServiceResponse> {
      return Promise.resolve({
        rua: 'Rua Santo Antônio',
        bairro: 'Floresta',
        cidade: 'Porto Alegre',
        estado: 'RS'
      })
    }
  }

  return new ServiceFake()
}

const makeSut = (): SutTypes => {
  const service = makeService()
  const sut = new CepController("/cep/:cep", service)
  const cep = '90220010'

  return { sut, service, cep }
}


let res: Response
describe('Tests for "CepController" class', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    const response = getMockRes()
    res = response.res
  })

  describe('Tests for the "get" method', () => {
    it('Return an error when cep not sent in params', async () => {
      const req = getMockReq({
        params: {},
      })

      const { sut } = makeSut()

      const { error } = sut.getSchema().params.validate(req.params, sut.validatorConfig.joi)
      expect(error!.details.length).toBe(1)
      expect(error!.details[0].message).toBe('"cep" is required')
    })

    it('Return an error when cep is not a string with only numbers', async () => {
      const req = getMockReq({
        params: {
          cep: "test",
        },
      })

      const { sut } = makeSut()

      const { error } = sut.getSchema().params.validate(req.params, sut.validatorConfig.joi)

      expect(error!.details.length).toBe(1)
      expect(error!.details[0].message).toBe('"cep" with value "test" fails to match the required pattern: /\\d{8}/')
    })

    it('Return an bad request when service returns an error', async () => {
      const { sut, service, cep } = makeSut()

      const req = getMockReq({
        params: { cep },
      })

      const createSpy = jest.spyOn(service, 'get').mockRejectedValue(new Error())

      const { error } = sut.getSchema().params.validate(req.params, sut.validatorConfig.joi)
      res = await sut.get(req, res)

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(error).toBeUndefined()
      expect(createSpy).toBeCalledWith(cep)
    })

    it('Expect a status OK when the flow is processed without errors', async () => {
      const { sut, service, cep } = makeSut()

      const req = getMockReq({
        params: { cep },
      })

      const createSpy = jest.spyOn(service, 'get')

      res = await sut.get(req, res)
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK)
      expect(res.json).toHaveBeenCalledWith({
        "bairro": "Floresta",
        "cidade": "Porto Alegre",
        "estado": "RS",
        "rua": "Rua Santo Antônio",
      })
      expect(createSpy).toBeCalledWith(cep)
    })
  })
})
