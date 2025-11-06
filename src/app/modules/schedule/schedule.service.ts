import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../libs/prisma";
import { calculatePagination } from "../../helper/pagenationHelper";
import { Prisma } from "@prisma/client";
import { IJwtPayload } from "../../../types/common";

const insertIntoDB = async (payload: any) => {
    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        );

        console.log(startDateTime);

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        );

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 11:00

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData,
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }

            slotStartDateTime.setMinutes(
                slotStartDateTime.getMinutes() + intervalTime
            );
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
};

const scheduleForDoctor = async (
    user: IJwtPayload,
    pagination: any,
    filters: any
) => {
    const { page, skip, limit, sortBy, sortOrder } =
        calculatePagination(pagination);
    const {
        startDateTime: filterStartDateTime,
        endDateTime: filterEndDateTime,
    } = filters;
    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime,
                    },
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime,
                    },
                },
            ],
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0
            ? {
                  AND: andConditions,
              }
            : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: { doctor: { email: user.email } },
        select: { scheduleId: true },
    });

    const scheduleId: string[] = doctorSchedules.map(
        (schedule) => schedule.scheduleId
    );
    console.log(scheduleId);

    const result = await prisma.schedule.findMany({
        where: { ...whereConditions, id: { notIn: scheduleId } },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.schedule.count({ where: { ...whereConditions, id: { notIn: scheduleId } } });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const deleteSchedule = async (id: string) => {
    return await prisma.schedule.delete({
        where: { id },
    });
};

export const ScheduleServices = {
    insertIntoDB,
    scheduleForDoctor,
    deleteSchedule,
};
