import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInUseCase } from "@/services/factories/make-check-in-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
    const createCheckInParamsString = z.object({
        gymID: z.string().uuid(),
    });
    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = createCheckInBodySchema.parse(req.body);
    const { gymID } = createCheckInParamsString.parse(req.params);

    const createCheckInUseCase = makeCheckInUseCase();
    await createCheckInUseCase.execute({
        userId: req.user.sub,
        gymId: gymID,
        userLatitude: latitude,
        userLongitude: longitude,
    });
    return res.status(201).send();
}
