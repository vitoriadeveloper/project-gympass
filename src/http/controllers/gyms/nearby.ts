import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeFetchNearbyGymsUseCase } from "@/services/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(req: FastifyRequest, res: FastifyReply) {
    const nearbyGymsQueryDistance = z.object({
        latitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = nearbyGymsQueryDistance.parse(req.query);

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();
    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    });
    return res.status(200).send({
        gyms,
    });
}
