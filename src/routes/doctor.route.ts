import { Router } from "express";
import verifyToken from "../middlewares/guard";
import { DoctorController } from "../controllers/doctor.controller";

const routerDoctor = Router();
const doctorController = new DoctorController();
const path = "/api/v1";

routerDoctor.get(`${path}/doctor/show-list`, (req, res) => doctorController.showDoctors(req, res))

routerDoctor.post(`${path}/doctor/create-doctor`, (req, res) =>
  doctorController.createDoctor(req, res)
);

routerDoctor.get(
  `${path}/my-patients/:doctorId`,
  verifyToken(["doctor"]),
  (req, res) => doctorController.myPatients(req, res)
);

routerDoctor.get(`${path}/my-profile/:doctorId`, (req, res) =>
  doctorController.myProfile(req, res)
);

export default routerDoctor;
