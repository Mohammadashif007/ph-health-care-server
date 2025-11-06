import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../shared/sendResponse";

const userLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUserIntoDB(req.body);
    const { accessToke, refreshToke, needPasswordChange, role } = result;
    res.cookie("accessToken", accessToke, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToke, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 * 24 * 90,
    });
    sendResponse(res, {
        success: true,
        message: `${role} login successfully`,
        statusCode: 201,
        data: { needPasswordChange },
    });
});

export const AuthControllers = {
    userLogin,
};
