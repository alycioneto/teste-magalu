import App from './App'
import { BaseController } from './shared/controller'

const controllers: Array<BaseController> = [];

(() => {
    try {
        const app = new App(controllers)
        app.start()
    } catch (error) {
        console.error(error)
    }
})()
  