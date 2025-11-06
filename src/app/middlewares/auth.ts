import { NextFunction, Request, Response } from "express";
import { verifiedToken } from "../helper/jwtHelper";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
    return async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!"
                );
            }
            const verifyUser = verifiedToken(token, "secret");
            req.user = verifyUser;
            if (roles.length > 0 && !roles.includes(verifyUser.role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!"
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
