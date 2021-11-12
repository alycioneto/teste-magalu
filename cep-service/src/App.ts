import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import apiMetrics from 'prometheus-api-metrics'
import { Environment } from './shared/enum'
import { BaseController } from './shared/controller/'

const defaultPort = 3000
const { NODE_ENV = Environment.DEVELOPMENT, PORT = defaultPort } = process.env

class App {
  protected app: express.Application

  protected port: number

  protected nodeEnv: string

  constructor(controllers: Array<BaseController>) {
    this.nodeEnv = NODE_ENV
    this.port = Number(PORT)

    this.app = express()

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  private initializeMiddlewares() {
    this.app.use(helmet())
    this.app.use(morgan('dev'))
    this.app.use(compression())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(express.json({ type: 'application/vnd.api+json' }))
    // this.app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument))
    this.app.use(apiMetrics())
  }

  private initializeControllers(controllers: Array<BaseController>) {
    controllers.forEach((controller: BaseController) => {
      this.app.use('/', controller.router)
    })
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`)
    })
  }

  public appInstance(): express.Application {
    return this.app
  }
}

export default App
