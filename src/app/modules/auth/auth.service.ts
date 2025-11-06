import { UserStatus } from "@prisma/client";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../helper/jwtHelper";

const loginUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email, status: UserStatus.ACTIVE },
    });
    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        isUserExist.password
    );
    if (!isCorrectPassword) {
        throw new Error("Password dose not match");
    }
    const accessToke = generateToken(
        {
            email: isUserExist.email,
            role: isUserExist.role,
        },
        "secret",
        "1d"
    );
    const refreshToke = generateToken(
        {
            email: isUserExist.email,
            role: isUserExist.role,
        },
        "secret",
        "90d"
    );

    return {
        accessToke: accessToke,
        refreshToke: refreshToke,
        needPasswordChange: isUserExist.needChangePassword,
        role: isUserExist.role,
    };
};

export const AuthServices = {
    loginUserIntoDB,
};
