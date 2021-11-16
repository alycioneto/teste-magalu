import { IUserService } from "../types";
import { IUser } from "../types/IUser";

export const users: Array<IUser> = [
  { id: "1", name: "John", email: "john@mail.com", password: "john123" },
  { id: "2", name: "Sarah", email: "sarah@mail.com", password: "sarah123" },
];

class UserService implements IUserService {
  find(email: string, password: string): IUser | undefined {
    return users.find((u) => {
      return u.email === email && u.password === password;
    });
  }
}

export { UserService };
