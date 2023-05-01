/* eslinexpt-disable no-unused-expressions */
import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateUseCase } from "./validate-check-in";
import { ResourceNotFound } from "./errors/resources-not-exists";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateUseCase;
describe("Validate Check In  user case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateUseCase(checkInsRepository);
    });

    it("should be able to validate the check in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-01",
            user_id: "user-01",
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(
            expect.any(Date),
        );
    });
    it("should not be able to validate an inexistent check in", async () => {
        await expect(() =>
            sut.execute({
                checkInId: "inexistent-check-id",
            }),
        ).rejects.toBeInstanceOf(ResourceNotFound);
    });
});
