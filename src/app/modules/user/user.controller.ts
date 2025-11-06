import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createPatientIntoDB(req);
    sendResponse(res, {
        success: true,
        message: "Patient created successfully",
        statusCode: 201,
        data: result,
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createAdminIntoDB(req);
    sendResponse(res, {
        success: true,
        message: "Admin created successfully",
        statusCode: 201,
        data: result,
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createDoctorIntoDB(req);
    sendResponse(res, {
        success: true,
        message: "Doctor created successfully",
        statusCode: 201,
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);
    const filterOptions = pick(req.query, ["status", "role", "searchTerm"]);

    const result = await UserServices.getAllUsers(
        filterOptions,
        paginationOptions
    );
    sendResponse(res, {
        success: true,
        message: "Get all user successfully",
        statusCode: 201,
        meta: result.meta,
        data: result.data,
    });
});

export const UserControllers = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllUsers,
};
