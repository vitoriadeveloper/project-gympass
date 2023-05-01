import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFound } from "./errors/resources-not-exists";

interface ValidateUseCaseRequest {
    checkInId: string;
}
interface ValidateUseCaseResponse {
    checkIn: CheckIn;
}
export class ValidateUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        checkInId,
    }: ValidateUseCaseRequest): Promise<ValidateUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFound();
        }

        checkIn.validated_at = new Date();
        await this.checkInsRepository.save(checkIn);
        return {
            checkIn,
        };
    }
}
