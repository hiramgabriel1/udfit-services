import { Request, response, Response } from "express";
import { prisma } from "../prisma/prisma.service";
import { IDoctor } from "../types/IDoctor";
import { hashPassword, comparePassword } from "../utils/hash.password";
import jwt from "jsonwebtoken";
import { IDieta } from "../types/IDieta";

export class DoctorController {
    constructor() { }

    private secretKey = process.env.SECRET_KEY || "";
    private res: Response = response;
    private messageInternalError(error: Error | unknown) {
        console.log(error);
        this.res.status(500).json({ message: "error interno", error: error });
    }

    private async findDoctor(email: string): Promise<boolean> {
        const doctor = await prisma.doctor.findFirst({
            where: {
                email: email,
            },
        });

        return !!doctor;
    }

    public async createDoctor(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const { password, ...rest } = req.body;
            const [find, passwordHashed] = await Promise.all([
                this.findDoctor(email),
                hashPassword(password),
            ]);

            if (find)
                return res
                    .status(409)
                    .json({ message: "el doctor ya esta registrado" });

            const doctor: IDoctor = {
                ...rest,
                password: passwordHashed,
            };
            const createDoctor = await prisma.doctor.create({
                data: doctor,
            });

            if (createDoctor)
                res.status(201).json({ message: "doctor created", data: createDoctor });
        } catch (error) {
            console.log(error);
            return this.messageInternalError(error);
        }
    }

    public async loginDoctor(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const searchDoctor = await prisma.doctor.findFirst({
                where: {
                    email: email,
                },
            });
            const passwordComp = await comparePassword(
                password,
                searchDoctor?.password
            );

            if (!searchDoctor || !passwordComp)
                return res.status(409).json({ message: "el doctor no existe" });

            const token = jwt.sign(
                {
                    userId: searchDoctor.id,
                    username: searchDoctor.username,
                    lastname: searchDoctor.lastname,
                    email: searchDoctor.email,
                    password: searchDoctor.password,
                },
                this.secretKey,
                { expiresIn: "24hr" }
            );

            res.json({ token: token });
        } catch (error) {
            return this.messageInternalError(error);
        }
    }

    public async myPatients(req: Request, res: Response) {
        const [searchDoctor, patients] = await Promise.all([
            this.findDoctor(req.params.id),

            prisma.doctor.findMany({
                where: {
                    id: req.params.id,
                },
            }),
        ]);

        if (!searchDoctor) res.status(404).json({ message: "no existe el doctor" });

        console.log(patients);

        res.status(200).json({ response: "tus pacientes", data: patients });
    }

    public async myProfile(req: Request, res: Response) {
        const doctor = await prisma.doctor.findFirst({
            where: {
                id: req.params.doctorId,
            },
            include: {
                patients: true
            }
        });

        if (!doctor) return res.status(404).json({ response: 'doctor no existe' });

        res.status(200).json({ message: "doctor finded", data: doctor });
    }

    public async createPatientDieta(req: Request, res: Response) {
        const { userId } = req.params;
        const findPatient = await prisma.patient.findFirst({
            where: { id: userId },
        });

        if (!findPatient)
            return res.status(404).json({ response: "patient no exists" });

        const dieta: IDieta = { ...req.body };
        const createDieta = await prisma.dietas.create({
            data: {
                ...dieta,
                patientId: userId,
            },
        });

        if (!createDieta)
            return res.status(500).json({ message: "error in creation" });

        res.status(201).json({ response: "data created" });
    }

    public async showDoctors(req: Request, res: Response) {
        try {
            const search = await prisma.doctor.findMany();

            res.json({ count: search.length, data: search });
        } catch (error) {
            this.messageInternalError(error);
        }
    }
}
