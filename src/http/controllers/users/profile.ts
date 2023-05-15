import { makeGetUserProfileUseCase } from "@/services/factories/make-get-profile-user-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function profile(req: FastifyRequest, res: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
        userId: req.user.sub,
    });

    return res.status(200).send({
        user: {
            ...user,
            password_hash: undefined,
        },
    });
}
