/* eslint-disable no-unused-expressions */
import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-use-profile";
import { ResourceNotFound } from "./errors/resources-not-exists";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
describe("Get profile user case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });
    it("should be able to get user profile", async () => {
        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password_hash: await hash("123456", 10),
        });
        const { user } = await sut.execute({
            userId: createdUser.id,
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual("John Doe");
    });

    it("should be able to get user profile with wrong id", async () => {
        await expect(() =>
            sut.execute({
                userId: "non-existing-id",
            }),
        ).rejects.toBeInstanceOf(ResourceNotFound);
    });
});
