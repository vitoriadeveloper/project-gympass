import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SeacrhGymUserCase } from "../seacrh-gyms";

export function makeSearchGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new SeacrhGymUserCase(gymsRepository);

    return useCase;
}
