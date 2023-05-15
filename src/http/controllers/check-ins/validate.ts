import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeValidateCheckInUseCase } from "@/services/factories/make-validate-check-in-user-case";

export async function validate(req: FastifyRequest, res: FastifyReply) {
    const validateCheckInParamsString = z.object({
        checkInID: z.string().uuid(),
    });

    const { checkInID } = validateCheckInParamsString.parse(req.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase();
    await validateCheckInUseCase.execute({
        checkInId: checkInID,
    });
    return res.status(204).send();
}
