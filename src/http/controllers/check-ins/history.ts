import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeFetchUserCheckInHistoryUseCase } from "@/services/factories/make-fetch-user-check-ins-history-user-case";

export async function history(req: FastifyRequest, res: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    });

    const { page } = checkInHistoryQuerySchema.parse(req.query);

    const createGymUserCase = makeFetchUserCheckInHistoryUseCase();
    const { checkIns } = await createGymUserCase.execute({
        userId: req.user.sub,
        page,
    });
    return res.status(200).send({
        checkIns,
    });
}
