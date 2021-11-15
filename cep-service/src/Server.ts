import App from './App'
import { BaseController } from './shared/controllers'
import { CepController } from './controllers'
import { CepService } from './services'
import { ViaCepClient } from './clients'
import { Redis } from './shared/utils'

const redis = new Redis()

const cepClient = new ViaCepClient("https://viacep.com.br/")
const cepService = new CepService(cepClient, redis)

const controllers: Array<BaseController> = [
  new CepController("/cep/:cep", cepService)
];

const app = new App(controllers)
app.start()

