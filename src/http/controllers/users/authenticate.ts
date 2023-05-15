import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/services/factories/make-authenticate-user-case";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(req.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user } = await authenticateUseCase.execute({ email, password });

        const token = await res.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                },
            },
        );

        const refreshToken = await res.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: "7d",
                },
            },
        );
        return res
            .setCookie("refreshToken", refreshToken, {
                path: "/",
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .status(200)
            .send({
                token,
            });
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return res.status(400).send({ message: error.message });
        }
        throw error;
    }
}
