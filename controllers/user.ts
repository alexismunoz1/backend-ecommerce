import { User } from "models/user";

export async function getUserById(id: string): Promise<any> {
   const user = new User(id);
   await user.pull();
   return user.data;
}
