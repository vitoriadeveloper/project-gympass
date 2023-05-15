/* eslinexpt-disable no-unused-expressions */
import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUserCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;

let sut: FetchNearbyGymsUserCase;
describe("Fetch Nearby Gyms Use Case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();

        sut = new FetchNearbyGymsUserCase(gymsRepository);
    });

    it("should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            title: "Near Gym",
            description: null,
            phone: null,
            latitude: -12.930765,
            longitude: -38.4186819,
        });
        await gymsRepository.create({
            title: "Far Gym",
            description: null,
            phone: null,
            latitude: -12.6073348,
            longitude: -38.0541679,
        });
        const { gyms } = await sut.execute({
            userLatitude: -12.930765,
            userLongitude: -38.4186819,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
    });
});
