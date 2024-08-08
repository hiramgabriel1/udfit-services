import { PrismaClient } from "@prisma/client/extension";

class PrismaService {
    private prisma: PrismaClient
    
    constructor(){
        this.prisma = new PrismaClient()
    }

    async connect(){
        await this.prisma.$connect()
    }

    async disconnect(){
        await this.prisma.$disconnect()
    }

    get client(){
        return this.prisma
    }
}   

export default new PrismaService()