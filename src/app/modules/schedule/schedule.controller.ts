import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";
import { IJwtPayload } from "../../../types/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.insertIntoDB(req.body);
    sendResponse(res, {
        success: true,
        message: "Schedule create successfully",
        statusCode: 201,
        data: result,
    });
});

const scheduleForDoctor = catchAsync(
    async (req: Request & { user?: IJwtPayload }, res: Response) => {
        const user = req.user;
        const paginationOptions = pick(req.query, [
            "page",
            "limit",
            "sortBy",
            "sortOrder",
        ]);
        const filterOptions = pick(req.query, ["startDateTime", "endDateTime"]);

        const result = await ScheduleServices.scheduleForDoctor(
            user as IJwtPayload,
            paginationOptions,
            filterOptions
        );
        sendResponse(res, {
            success: true,
            message: "Schedule retrieve successfully",
            statusCode: 200,
            data: result,
        });
    }
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.deleteSchedule(req.params.id);
    sendResponse(res, {
        success: true,
        message: "Schedule deleted successfully",
        statusCode: 200,
        data: result,
    });
});

export const ScheduleControllers = {
    insertIntoDB,
    scheduleForDoctor,
    deleteScheduleFromDB,
};
