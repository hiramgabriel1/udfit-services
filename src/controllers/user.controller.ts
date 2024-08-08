import { Request, Response } from "express";
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
        console.log(data);
        const searchSession = await prisma.patient.findFirst({
            where: {
                email: data.email,
            },
        });

        const isPasswordValid = await comparePassword(
            searchSession!.password,
            data?.password
        );

        return isPasswordValid ? true : false;
    }

    public async userAlreadyExists(email: string): Promise<Boolean> {
        const findUser = await prisma.patient.findFirst({
            where: {
                email: email,
            },
        });

        return findUser ? true : false;
    }

    public async createUser(
        req: Request,
        res: Response
    ): Promise<{ message: string; data: IPatient }> {
        const validateUser = await this.userAlreadyExists(req.body.email);
        const { password, ...rest } = req.body;

        if (validateUser) throw new Error("El usuario ya existe");

        const passwordHashed = await hashPassword(password);
        const user: IPatient = {
            ...rest,
            password: passwordHashed,
        };
        const createUser = await prisma.patient.create({
            data: user,
        });
        const response = { message: "user created", data: createUser };

        res.json(response);

        return response;
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

        console.log();

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        this.token = jwt.sign(
            {
                userId: searchSession?.id,
                username: searchSession?.username,
                email: searchSession?.email,
                weight: searchSession?.weight,
                height: searchSession?.height,
                age: searchSession?.age,
                gender: searchSession?.gender,
            },
            this.secret,
            { expiresIn: "24h" }
        );

        res.json({ token: this.token });
    }

    public verifyToken(req: Request, res: Response) {
        try {
            const header = req.header('Authorization');
            
            if (!header) {
                return res.status(400).json({ message: 'Authorization header not provided' });
            }
    
            const token = header.split(' ')[1];
            
            if (!token) {
                return res.status(400).json({ message: 'Token not provided' });
            }
    
            const payload = jwt.verify(token, this.secret);
    
            res.json(payload);
        } catch (error) {
            console.error(error); 
            return res.status(403).json({ message: 'Token is not valid' });
        }
    }
    
    public async getUsers(req: Request, res: Response): Promise<Array<Patient>> {
        const response = await prisma.patient.findMany();
        res.json({ count: response.length, response: response });
        return response;
    }
}
