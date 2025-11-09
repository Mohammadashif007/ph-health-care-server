import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../helper/pagenationHelper";
import { pick } from "../../helper/pick";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../../libs/prisma";
import { validateHeaderName } from "http";
import { IDoctorUpdateInput } from "./doctor.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { openai } from "../../helper/openRouter";

const getAllDoctor = async (filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(options);

    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));

        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true,
                },
            },
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const updateIntoDB = async (
    id: string,
    payload: Partial<IDoctorUpdateInput>
) => {
    const isExist = await prisma.doctor.findFirstOrThrow({
        where: { id },
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deletedSpecialtyIds = specialties.filter(
                (specialty) => specialty.isDeleted
            );

            for (const specialty of deletedSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtieId,
                    },
                });
            }

            const createSpecialtyIds = specialties.filter(
                (specialty) => !specialty.isDeleted
            );

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtieId,
                    },
                });
            }
        }

        const updatedData = await tnx.doctor.update({
            where: { id: isExist.id },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true,
                    },
                },
            },
        });

        return updatedData;
    });
};

const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Symptom is required");
    }
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },
    });

    console.log("🚀 Doctor Data loaded.....\n");

    const prompt = `
User has the following symptoms: "${payload.symptoms}".
Available doctors with specialties: ${JSON.stringify(doctors, null, 2)}.

Based on the symptoms, which specialties or doctors are most relevant? 
Respond with only a comma-separated list of doctor names or specialties, no explanation.
`;

    console.log("🥱 Analyzing.....\n");
    // ✅ Added system message
    const completion = await openai.chat.completions.create({
        model: "z-ai/glm-4.5-air:free", // or "gpt-3.5-turbo"
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful and knowledgeable medical assistant AI. Your task is to analyze symptoms and match them with the most relevant medical specialties or doctors from the provided data. Be concise and accurate.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    // console.log(completion.choices[0].message);

    // ✅ Extract relevant info safely
    const aiMessage = completion.choices?.[0]?.message || {};

    // ✅ Format response neatly
    const formattedResponse = {
        aiSuggestion: aiMessage.content?.trim() || "No suggestion found",
        // Some models like glm return reasoning or explanation inside message
        explanation: "No additional reasoning provided by the model.",
    };

    console.log("🧠 AI Suggestion:\n", formattedResponse);

    // ✅ Return this to Postman response
    return formattedResponse;
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true,
                },
            },
        },
    });
    return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};

export const DoctorServices = {
    getAllDoctor,
    updateIntoDB,
    getAISuggestions,
    getByIdFromDB,
    deleteFromDB,
    softDelete,
};
