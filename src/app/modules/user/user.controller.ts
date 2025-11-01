import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const createUser = catchAsync((req: Request, res: Response) => {
    console.log(req.body);
});

export const UserControllers = {
    createUser,
};
