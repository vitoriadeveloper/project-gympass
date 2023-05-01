import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface SeacrhGymUserCaseRequest {
    query: string;
    page: number;
}
interface SeacrhGymUserCaseResponse {
    gyms: Gym[];
}

export class SeacrhGymUserCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        query,
        page,
    }: SeacrhGymUserCaseRequest): Promise<SeacrhGymUserCaseResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page);

        return { gyms };
    }
}
