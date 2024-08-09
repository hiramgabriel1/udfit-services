import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

const verifyToken = (allowedRole: string[]) => {
    return (req: Request, res: Response) => {
        try {
            const header = req.header('Authorization');
            const secret: any = process.env.SECRET_KEY
            if (!header) {
                return res.status(400).json({ message: 'Authorization header not provided' });
            }
    
            const token = header.split(' ')[1];
            
            if (!token) {
                return res.status(400).json({ message: 'Token not provided' });
            }
    
            const payload = jwt.verify(token, secret) as JwtPayload;
    
            // check roles
            if(!allowedRole.includes(payload.role)){
                res.json({ messageError: 'el rol no es admitido' })
            }
    
            res.json(payload);
        } catch (error) {
            console.error(error); 
            return res.status(403).json({ message: 'Token is not valid' });
        }
    }
}

export default verifyToken