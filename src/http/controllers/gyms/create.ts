import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymUseCase } from "@/services/factories/create-gym-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { title, description, phone, latitude, longitude } =
        createGymBodySchema.parse(req.body);

    const createGymUserCase = makeCreateGymUseCase();
    await createGymUserCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    });
    return res.status(201).send();
}
