import { IUser } from "./IUser";

export interface IUserService {
  find(email: string, password: string): IUser | undefined;
}
