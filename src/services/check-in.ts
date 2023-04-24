import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFound } from "./errors/resources-not-exists";

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}
interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}
export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute({
        userId,
        gymId,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFound();
        }
        const checkInOnTheSameDay =
            await this.checkInsRepository.findByUserIdOnDate(
                userId,
                new Date(),
            );

        if (checkInOnTheSameDay) {
            throw new Error();
        }
        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId,
        });
        return {
            checkIn,
        };
    }
}
