import { Request, Response } from "express";
import PrismaService from "../prisma/prisma.service"

export class UserController {
    private prismaService: InstanceType<typeof PrismaService>
    constructor() {
       this.prismaService = new PrismaService()
        this.prismaService.connect()
    }

    async userAlreadyExists(): Promise<Boolean> {

        return true
    }

    async createUser(req: Request, res: Response): Promise<Object> {
        return {};
    }
}
