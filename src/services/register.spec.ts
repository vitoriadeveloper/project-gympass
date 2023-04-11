/* eslint-disable no-unused-expressions */
import { expect, describe, it } from "vitest";
import { RegisterUserCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

describe("Register user case", () => {
    it("should be able to register", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUserCase(usersRepository);

        const { user } = await registerUserCase.execute({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUserCase(usersRepository);

        const { user } = await registerUserCase.execute({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "123456",
        });

        const isPasswordCorrectlyHashed = await compare(
            "123456",
            user.password_hash,
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice ", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUserCase(usersRepository);

        const email = "johndoe@gmail.com";

        await registerUserCase.execute({
            name: "John Doe",
            email,
            password: "123456",
        });

        await expect(() =>
            registerUserCase.execute({
                name: "John Doe",
                email,
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
