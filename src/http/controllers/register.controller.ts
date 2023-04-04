import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserCase } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

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
        return res.status(409).send();
    }

    return res.status(201).send();
}
