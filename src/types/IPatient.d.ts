export enum userRoles  {
    admin = 'administrador',
    doctor = 'doctor',
    patient = 'paciente'
}

export interface IPatient {
    username: string
    email: string
    password: string
    weight: number
    height: number
    age: number
    gender: string
    role: userRoles
}