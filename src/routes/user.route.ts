import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const routerUser = Router();
const userController = new UserController();
const path = "/api/v1";

routerUser.post(`${path}/user/create`, (req, res) =>
  userController.createUser(req, res)
);

export default routerUser;
