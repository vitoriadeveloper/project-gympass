/* eslinexpt-disable no-unused-expressions */
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe("Check-in user case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: "gym-01",
            title: "Academia Javascript",
            description: "",
            phone: "",
            latitude: -12.930765,
            longitude: -38.4186819,
        });
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });
    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -12.930765,
            userLongitude: -38.4186819,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
    it("should be not able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -12.930765,
            userLongitude: -38.4186819,
        });
        await expect(() =>
            sut.execute({
                gymId: "gym-01",
                userId: "user-01",
                userLatitude: -12.930765,
                userLongitude: -38.4186819,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it("should be  able to check in twice in the different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -12.930765,
            userLongitude: -38.4186819,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -12.930765,
            userLongitude: -38.4186819,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
    it("should not be able to check in on distance gym", async () => {
        gymsRepository.create({
            id: "gym-02",
            title: "Academia Javascript",
            description: "",
            phone: "",
            latitude: -13.0051511,
            longitude: -38.4889801,
        });
        await expect(() =>
            sut.execute({
                gymId: "gym-02",
                userId: "user-01",
                userLatitude: -12.930765,
                userLongitude: -38.4186819,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
