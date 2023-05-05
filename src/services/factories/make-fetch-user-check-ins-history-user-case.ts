import { FetchMemberCheckInsHistoryUseCase } from "../fetch-member-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInHistoryUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new FetchMemberCheckInsHistoryUseCase(checkInsRepository);

    return useCase;
}
