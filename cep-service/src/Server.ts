import App from "./App";
import { ViaCepClient } from "./clients";
import { CepController } from "./controllers";
import { TokenController } from "./controllers/TokenController";
import { CepService } from "./services";
import { UserService } from "./services/UserService";
import { BaseController } from "./shared/controllers";
import { Redis, Auth } from "./shared/utils";

const { VIACEP_BASE_URL } = process.env;

const redis = new Redis();

const cepClient = new ViaCepClient(VIACEP_BASE_URL!);
const cepService = new CepService(cepClient, redis);
const userService = new UserService();

const auth = new Auth();

const controllers: Array<BaseController> = [
  new TokenController("/token", userService),
  new CepController("/cep/:cep", cepService, auth),
];

const app = new App(controllers, auth);
app.start();
