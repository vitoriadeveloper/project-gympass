import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymUserCaseRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}
interface CreateGymUserCaseResponse {
    gym: Gym;
}

export class CreateGymUserCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    }: CreateGymUserCaseRequest): Promise<CreateGymUserCaseResponse> {
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        });

        return { gym };
    }
}
