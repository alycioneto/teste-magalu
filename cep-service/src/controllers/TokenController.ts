import { Request, Response } from 'express'
import { users } from '../Users'
import { BaseController, Schema } from '../shared/controllers'
import jwt from 'jwt-simple'

const { jwtSecret = "MyS3cr3tK3Y" } = process.env

class TokenController extends BaseController {

  constructor(path: string) {
    super(path)
  }

  public async post(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    if (email && password) {
      var user = users.find(function(u) {
        return u.email === email && u.password === password;
      });
      if (user) {
        var payload = {id: user.id};
        var token = jwt.encode(payload, jwtSecret);
        return this.ok(res, {token: token})
      } else {
        return this.unauthorized(res)
      }
    } else {
      return this.unauthorized(res)
    }
  }

  public postSchema(): Schema {
    const body = this.joi.object({
      email: this.joi.string().email().required(),
      password: this.joi.string().required()
    })

    return new Schema(body)
  }
}

export { TokenController }
