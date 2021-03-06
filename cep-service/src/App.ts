import compression from "compression";
import express from "express";
import Actuator from "express-actuator";
import helmet from "helmet";
import morgan from "morgan";
import apiMetrics from "prometheus-api-metrics";
import swaggerui from "swagger-ui-express";

import { BaseController } from "./shared/controllers";
import { Environment } from "./shared/enums";
import { Redis, Auth, Logger } from "./shared/utils";
import swaggerDocument from "./Swagger";

const defaultPort = "3000";
const { NODE_ENV = Environment.DEVELOPMENT, PORT = defaultPort } = process.env;

class App {
  protected app: express.Application;

  protected port: number;

  protected nodeEnv: string;

  constructor(controllers: Array<BaseController>, auth: Auth) {
    this.nodeEnv = NODE_ENV;
    this.port = parseInt(PORT, 10);

    this.app = express();

    this.initializeMiddlewares(auth);
    this.initializeDataBases();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares(auth: Auth) {
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(auth.initialize());
    this.app.use(apiMetrics());
    this.app.use(Actuator());
    this.app.use("/docs", swaggerui.serve, swaggerui.setup(swaggerDocument));
  }

  private initializeControllers(controllers: Array<BaseController>) {
    controllers.forEach((controller: BaseController) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeDataBases() {
    Redis.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on the port ${this.port}`);
    });
  }

  public appInstance(): express.Application {
    return this.app;
  }
}

export default App;
