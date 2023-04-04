import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserCase {
    // eslint-disable-next-line prettier/prettier
    constructor(private usersRepository: any) { }

    async execute({ name, email, password }: RegisterUserCaseRequest) {
        const password_hash = await hash(password, 10);

        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userWithSameEmail) {
            throw new Error("E-mail already exists");
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    }
}
