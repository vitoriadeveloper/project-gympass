import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserCase } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists";

export async function register(req: FastifyRequest, res: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(req.body);

    try {
        const prismaUsersRepository = new PrismaUsersRepository();
        const registerUserCase = new RegisterUserCase(prismaUsersRepository);
        await registerUserCase.execute({ name, email, password });
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return res.status(409).send({ message: error.message });
        }
        throw error;
    }

    return res.status(201).send();
}
