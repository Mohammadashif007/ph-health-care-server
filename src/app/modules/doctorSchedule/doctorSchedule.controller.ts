import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../../types/common";

const createDoctorSchedule = catchAsync(
    async (req: Request & { user?: IJwtPayload }, res: Response) => {
        const user = req.user;
        const result = await DoctorScheduleServices.createDoctorSchedule(
            user as IJwtPayload,
            req.body
        );
        sendResponse(res, {
            success: true,
            message: "Doctor schedule created successfully",
            statusCode: 201,
            data: result,
        });
    }
);

export const DoctorScheduleControllers = {
    createDoctorSchedule,
};
