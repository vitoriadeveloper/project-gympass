import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { User } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository";

interface RegisterUserCaseResponse {
    user: User;
}
interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserCase {
    // eslint-disable-next-line prettier/prettier
    constructor(private usersRepository: UsersRepository) { }

    async execute({
        name,
        email,
        password,
    }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
        const password_hash = await hash(password, 10);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);
        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return { user };
    }
}
