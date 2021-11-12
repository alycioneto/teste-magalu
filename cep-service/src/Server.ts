import App from './App'
import { BaseController } from './shared/controllers'

const controllers: Array<BaseController> = [];

(() => {
    try {
        const app = new App(controllers)
        app.start()
    } catch (error) {
        console.error(error)
    }
})()
