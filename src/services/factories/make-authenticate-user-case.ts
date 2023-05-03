import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
    const prismaUsersAuthenticate = new PrismaUsersRepository();
    const authenticateUserCase = new AuthenticateUseCase(
        prismaUsersAuthenticate,
    );

    return authenticateUserCase;
}

// The use of factory is to  abstract object creation without exposing the creation logic benefiting reuse
