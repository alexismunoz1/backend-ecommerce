import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserById, updateUserData } from "controllers/user";
import method from "micro-method-router";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
   const user = await getUserById(token.userId);
   res.send(user);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
   const { userName, userPhone, userAddress } = req.body;
   const data = {
      userName,
      userPhone,
      userAddress,
   };
   const user = await updateUserData(token.userId, data);
   res.send(user);
}

const handler = method({
   get: getHandler,
   patch: patchHandler,
});

export default authMiddleware(handler);
