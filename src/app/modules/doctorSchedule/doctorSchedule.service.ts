import { prisma } from "../../../libs/prisma";
import { IJwtPayload } from "../../../types/common";

const createDoctorSchedule = async (
    user: IJwtPayload,
    payload: { scheduleIds: string[] }
) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: { email: user.email },
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId: scheduleId,
    }));

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData,
    });
};

export const DoctorScheduleServices = {
    createDoctorSchedule,
};
