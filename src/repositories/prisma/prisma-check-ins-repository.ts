import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        });

        return checkIn;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        });

        return checkIn;
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        });

        return checkIn;
    }

    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });
        return count;
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20, // like limit on sql
            skip: (page - 1) * 20,
        });
        return checkIns;
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOftheDay = dayjs(date).endOf("date");
        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(), // check in starting after this day
                    lte: endOftheDay.toDate(), // the date of the create check in is to be before end of the day
                },
            },
        });

        return checkIn;
    }
}
