import { NextFunction, Request, Response } from "express";
import { verifiedToken } from "../helper/jwtHelper";

export const auth = (...roles: string[]) => {
    return async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                throw new Error("You are not authorized!");
            }
            const verifyUser = verifiedToken(token, "secret");
            req.user = verifyUser;
            if (roles.length > 0 && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authorized!");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
