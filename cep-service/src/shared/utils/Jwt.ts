import jwt from "jwt-simple";

const { JWT_SECRET } = process.env;

class Jwt {
  public static encode(payload: unknown) {
    return jwt.encode(payload, JWT_SECRET!);
  }
}

export { Jwt };
