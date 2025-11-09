import { prisma } from "../../../libs/prisma";
import { IJwtPayload } from "../../../types/common";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
    user: IJwtPayload,
    payload: { doctorId: string; scheduleId: string }
) => {
    const isUser = await prisma.patient.findUniqueOrThrow({
        where: { email: user.email },
    });
    if (!isUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dose not exist");
    }
    const isDoctor = await prisma.doctor.findUniqueOrThrow({
        where: { id: payload.doctorId, isDeleted: false },
    });
    if (!isDoctor) {
        throw new AppError(httpStatus.BAD_REQUEST, "Doctor dose not exist");
    }
    const isScheduleExist = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });
    if (!isScheduleExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Schedule dose not exist");
    }

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: isUser.id,
                doctorId: isDoctor.id,
                scheduleId: payload.scheduleId,
                videoCallingId,
            },
        });

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: isDoctor.id,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {
                isBooked: true,
            },
        });

        const transactionId = uuidv4();

        await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: isDoctor.appointmentFee,
                transactionId,
            },
        });

        return appointmentData;
    });

    return result;

    const appointmentData = await prisma.appointment.create({
        data: {
            patientId: isUser.id,
            doctorId: isDoctor.id,
            scheduleId: payload.scheduleId,
            videoCallingId,
        },
    });
};

export const AppointmentServices = {
    createAppointment,
};
