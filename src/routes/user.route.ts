import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import verifyToken from "../middlewares/guard";

const routerUser = Router();
const userController = new UserController();
const path = "/api/v1";

routerUser.post(`${path}/user-create`, (req, res) =>
  userController.createUser(req, res)
);

routerUser.post(`${path}/user/auth-user`, (req, res) =>
  userController.loginUser(req, res)
);

routerUser.post(`${path}/user/:userId/select-doctor/:doctorId`, (req, res) =>
  userController.setDoctor(req, res)
);

// routerUser.get(`${path}/user/verify-token`, (req, res) => userController.verifyToken(req, res))

routerUser.get(`${path}/users`, (req, res) =>
  userController.getUsers(req, res)
);

export default routerUser;
