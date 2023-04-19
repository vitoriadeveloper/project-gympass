import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
    const prismaUsersAuthenticate = new PrismaUsersRepository();
    const authenticateUserCase = new AuthenticateUseCase(
        prismaUsersAuthenticate,
    );

    return authenticateUserCase;
}
