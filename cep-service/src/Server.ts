import App from './App'
import { BaseController } from './shared/controllers'
import { CepController } from './controllers'

const controllers: Array<BaseController> = [
  new CepController("/cep/:cep")
];

const app = new App(controllers)
app.start()

