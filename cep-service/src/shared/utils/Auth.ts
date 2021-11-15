import passport  from "passport";
import { Strategy, ExtractJwt } from "passport-jwt"
import { users } from '../../services/UserService'

// TODO: passar pro env
const { jwtSecret = "MyS3cr3tK3Y" } = process.env

class Auth {

  constructor() {
    const strategy = this.passportStrategy()
    passport.use(strategy)
  }

  private passportStrategy(): Strategy {

    //TODO: passar pro env
    const params = {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    const strategy = new Strategy(params, (payload, done) => {
      const user = users[payload.id] || null
      if (user) {
        return done(null, {id: user.id})
      } else {
        return done(new Error("User not found"), null);
      }
    })

    return strategy
  }

  public initialize() {
    return passport.initialize()
  }

  public authenticate() {
    return passport.authenticate("jwt", {session: false})
  }
}

export { Auth }
