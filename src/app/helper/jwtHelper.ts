import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const generateToken = (
    payload: any,
    secret: Secret,
    expiresIn: string
) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    } as SignOptions);
    return token;
};

export const verifiedToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
};
