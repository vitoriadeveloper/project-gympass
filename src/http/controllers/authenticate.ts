import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { AuthenticateUseCase } from "@/services/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(req.body);

    try {
        const prismaUsersRepository = new PrismaUsersRepository();
        const authenticateUserCase = new AuthenticateUseCase(
            prismaUsersRepository,
        );
        await authenticateUserCase.execute({ email, password });
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return res.status(400).send({ message: error.message });
        }
        throw error;
    }

    return res.status(200).send();
}
