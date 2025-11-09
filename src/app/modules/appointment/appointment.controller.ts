import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentServices } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../../types/common";
import { JwtPayload } from "jsonwebtoken";

const createAppointment = catchAsync(
    async (req: Request & { user?: IJwtPayload }, res: Response) => {
        const user = req.user;

        const result = await AppointmentServices.createAppointment(user as IJwtPayload, req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Appointment created successfully",
            data: result,
        });
    }
);

export const AppointmentControllers = {
    createAppointment,
};
