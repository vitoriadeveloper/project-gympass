import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { GetUserProfileUseCase } from "../get-use-profile";

export function makeGetUserProfileUseCase() {
    const prismaUsersAuthenticate = new PrismaUsersRepository();
    const useCase = new GetUserProfileUseCase(prismaUsersAuthenticate);

    return useCase;
}
