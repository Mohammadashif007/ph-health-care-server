import { Request } from "express";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../helper/fileUploader";
import { Prisma, UserRole } from "@prisma/client";
import { calculatePagination } from "../../helper/pagenationHelper";
import { userSearchableFields } from "./user.constent";

const createPatientIntoDB = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.patient.profilePhoto = uploadResult?.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: { email: req.body.patient.email, password: hashedPassword },
        });
        return await tx.patient.create({
            data: req.body.patient,
        });
    });
    return result;
};

const createAdminIntoDB = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePhoto = uploadResult?.secure_url;
        req.body.admin.role = UserRole.ADMIN;
    }
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: {
                email: req.body.admin.email,
                password: hashedPassword,
                role: UserRole.ADMIN,
            },
        });
        return await tx.admin.create({
            data: req.body.admin,
        });
    });
    return result;
};

const createDoctorIntoDB = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: {
                email: req.body.doctor.email,
                password: hashedPassword,
                role: UserRole.DOCTOR,
            },
        });
        return await tx.doctor.create({
            data: req.body.doctor,
        });
    });
    return result;
};

const getAllUsers = async (params: any, options: any) => {
    const { limit, skip, sortBy, sortOrder, page } =
        calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // if (Object.keys(filterData.length > 0)) {
    //     andConditions.push({
    //         AND: Object.keys(filterData).map((key) => ({
    //             [key]: {
    //                 equals: (filterData as any)[key],
    //             },
    //         })),
    //     });
    // }

    if (filterData) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0
            ? {
                  AND: andConditions,
              }
            : {};

    const users = await prisma.user.findMany({
        skip: skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.user.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: users,
    };
};

export const UserServices = {
    createPatientIntoDB,
    createAdminIntoDB,
    createDoctorIntoDB,
    getAllUsers,
};
