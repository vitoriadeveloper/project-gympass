/* eslint-disable no-unused-expressions */
import { expect, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate user case", () => {
    it("should be able to authenticate", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password_hash: await hash("123456", 10),
        });
        const { user } = await sut.execute({
            email: "johndoe@gmail.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should be able to authenticate with wrong email", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        expect(() =>
            sut.execute({
                email: "johndoe@gmail.com",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should be able to authenticate with wrong password", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password_hash: await hash("123456", 10),
        });
        expect(() =>
            sut.execute({
                email: "johndoe@gmail.com",
                password: "1224344",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
