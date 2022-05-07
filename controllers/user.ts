import { User } from "models/user";

export async function getUserById(id: string): Promise<any> {
   const user = new User(id);
   await user.pull();
   return user.data;
}

type userData = {
   userName: string;
   userPhone: number;
   userAddress: string;
};

export async function updateUserData(id: string, data: userData) {
   const user = new User(id);
   user.data = data;
   await user.push();
   await user.pull();
   return user.data;
}
