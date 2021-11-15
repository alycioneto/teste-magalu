import App from './App'
import { BaseController } from './shared/controllers'
import { CepController } from './controllers'
import { CepService } from './services'
import { ViaCepClient } from './clients'
import { Redis, Auth } from './shared/utils'
import { TokenController } from './controllers/TokenController'

const redis = new Redis()

const cepClient = new ViaCepClient("https://viacep.com.br/")
const cepService = new CepService(cepClient, redis)
const auth = new Auth()

const controllers: Array<BaseController> = [
  new TokenController("/token"),
  new CepController("/cep/:cep", cepService, auth)
];

const app = new App(controllers, auth)
app.start()

