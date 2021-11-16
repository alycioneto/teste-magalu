import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

import { users } from "../../services/UserService";

const { JWT_SECRET } = process.env;

class Auth {
  constructor() {
    const strategy = this.passportStrategy();
    passport.use(strategy);
  }

  private passportStrategy(): Strategy {
    const params = {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    const strategy = new Strategy(params, (payload, done) => {
      const user = users[payload.id] || null;
      if (user) {
        return done(null, { id: user.id });
      }
      return done(new Error("User not found"), null);
    });

    return strategy;
  }

  public initialize() {
    return passport.initialize();
  }

  public authenticate() {
    return passport.authenticate("jwt", { session: false });
  }
}

export { Auth };
