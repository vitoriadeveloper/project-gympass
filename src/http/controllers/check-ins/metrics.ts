import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "@/services/factories/make-get-user-metrics-user-case";

export async function metrics(req: FastifyRequest, res: FastifyReply) {
    const createGymUserCase = makeGetUserMetricsUseCase();
    const { checkInsCount } = await createGymUserCase.execute({
        userId: req.user.sub,
    });
    return res.status(200).send({
        checkInsCount,
    });
}
