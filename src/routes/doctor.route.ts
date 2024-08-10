import { Router } from "express";
import verifyToken from "../middlewares/guard";
import { DoctorController } from "../controllers/doctor.controller";

const routerDoctor = Router();
const doctorController = new DoctorController();
const path = "/api/v1/doctor";

routerDoctor.get(`${path}/show-list`, (req, res) =>
  doctorController.showDoctors(req, res)
);

routerDoctor.post(`${path}/create-doctor`, (req, res) =>
  doctorController.createDoctor(req, res)
);

routerDoctor.post(`${path}/dieta-create/patient/:patientId`, (req, res) =>
  doctorController.createPatientDieta(req, res)
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
