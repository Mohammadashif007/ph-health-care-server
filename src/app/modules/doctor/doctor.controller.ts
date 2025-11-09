import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { pick } from "../../helper/pick";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableField } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, doctorFilterableField);
    const result = await DoctorServices.getAllDoctor(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor Retrieve successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully",
        data: result,
    });
});

const getAISuggestions = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorServices.getAISuggestions(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "get Ai suggestions successfully",
        data: result,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor retrieval successfully",
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.deleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor deleted successfully",
        data: result,
    });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.softDelete(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor soft deleted successfully",
        data: result,
    });
});

export const DoctorControllers = {
    getAllDoctors,
    updateIntoDB,
    getAISuggestions,
    getByIdFromDB,
    deleteFromDB,
    softDelete,
};
