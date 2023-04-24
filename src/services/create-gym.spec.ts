/* eslinexpt-disable no-unused-expressions */
import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUserCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUserCase;
describe("Create a gym user case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUserCase(gymsRepository);
    });

    it("should be able to create a gym", async () => {
        const { gym } = await sut.execute({
            title: "Javascript gym",
            description: null,
            phone: null,
            latitude: -12.930765,
            longitude: -38.4186819,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
