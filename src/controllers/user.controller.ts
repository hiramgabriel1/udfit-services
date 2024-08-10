import { Request, response, Response } from "express";
import { prisma } from "../prisma/prisma.service";
import type { IPatient } from "../types/IPatient";
import { hashPassword, comparePassword } from "../utils/hash.password";
import { Patient } from "@prisma/client";
import jwt from "jsonwebtoken";

type userSession = {
    email: string;
    password: string | undefined;
};

export class UserController {
    constructor() { }
    private token: string = "";
    private secret: any = process.env.SECRET_KEY;

    public async validateSession(data: userSession): Promise<boolean> {
        const searchSession = await prisma.patient.findFirst({
            where: {
                email: data.email,
            },
        });

        const isPasswordValid = await comparePassword(
            searchSession!.password,
            data?.password
        );

        return !!isPasswordValid;
    }

    private async userAlreadyExists(email: string): Promise<Boolean> {
        console.log(email);

        const findUser = await prisma.patient.findFirst({
            where: {
                email: email,
            },
        });

        console.log(findUser);

        return !!findUser;
    }

    public async createUser(req: Request, res: Response) {
        const { email } = req.body;
        const validateUser = await this.userAlreadyExists(email);
        const { password, ...rest } = req.body;

        if (validateUser)
            return res.status(409).json({ response: "usuario ya existe" });

        const passwordHashed = await hashPassword(password);
        const user: IPatient = {
            ...rest,
            password: passwordHashed,
            doctorId: undefined,
        };
        const createUser = await prisma.patient.create({
            data: user,
        });
        const response = { message: "user created", data: createUser };

        res.json(response);
    }

    public async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;
        const searchSession = await prisma.patient.findFirst({
            where: {
                email: email,
            },
        });

        const isPasswordValid = await comparePassword(
            password,
            searchSession!.password
        );

        if (!isPasswordValid)
            return res.status(401).json({ message: "Invalid password" });

        this.token = jwt.sign(
            {
                userId: searchSession?.id,
                username: searchSession?.username,
                email: searchSession?.email,
                weight: searchSession?.weight,
                height: searchSession?.height,
                age: searchSession?.age,
                gender: searchSession?.gender,
                role: searchSession?.role,
            },
            this.secret,
            { expiresIn: "24h" }
        );

        res.json({ token: this.token });
    }

    public async setDoctor(req: Request, res: Response) {
        const { userId, doctorId } = req.params;
        const [findDoctor, findPatient] = await Promise.all([
            prisma.doctor.findFirst({
                where: { id: doctorId },
            }),
            prisma.patient.findFirst({
                where: { id: userId },
            }),
        ]);

        if (!findDoctor)
            return res.status(409).json({ response: "dc dont exists" });
        if (!findPatient)
            return res.status(409).json({ response: "el patient no existe" });

        const setDoctorToPatient = await prisma.patient.update({
            where: {
                id: userId,
            },
            data: {
                doctorId: doctorId,
            },
        });

        if (!setDoctorToPatient)
            return res
                .status(500)
                .json({ response: "error al asignar doctor al paciente" });

        res.status(201).json({
            response: "doctor asignado al paciente",
            data: setDoctorToPatient,
        });
    }

    public async getUsers(req: Request, res: Response): Promise<Array<Patient>> {
        const response = await prisma.patient.findMany({
            include: { doctor: true },
        });
        
        res.json({ count: response.length, response: response });

        return response;
    }
}
