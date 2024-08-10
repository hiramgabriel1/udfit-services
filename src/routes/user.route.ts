import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import verifyToken from "../middlewares/guard";

const routerUser = Router();
const userController = new UserController();
const path = "/api/v1/user";

routerUser.post(`${path}/user-create`, (req, res) =>
  userController.createUser(req, res)
);

routerUser.post(`${path}/auth-user`, (req, res) =>
  userController.loginUser(req, res)
);

routerUser.post(`${path}/:userId/select-doctor/:doctorId`, (req, res) =>
  userController.setDoctor(req, res)
);

routerUser.get(`${path}/view-profile/:userId`, (req, res) =>
  userController.patientProfile(req, res)
);

routerUser.get(`${path}/users`, (req, res) =>
  userController.getUsers(req, res)
);

// ! routerUser.get(`${path}/user/verify-token`, (req, res) => userController.verifyToken(req, res))

export default routerUser;
