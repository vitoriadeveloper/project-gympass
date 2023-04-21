import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { RegisterUserCase } from "../register";

export function makeRegisterUseCase() {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUserCase = new RegisterUserCase(prismaUsersRepository);

    return registerUserCase;
}
