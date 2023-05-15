import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSearchGymsUseCase } from "@/services/factories/make-search-gyms-use-case";

export async function search(req: FastifyRequest, res: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { q, page } = searchGymsQuerySchema.parse(req.query);

    const createGymUserCase = makeSearchGymsUseCase();
    const { gyms } = await createGymUserCase.execute({
        query: q,
        page,
    });
    return res.status(200).send({
        gyms,
    });
}
