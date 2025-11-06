import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
    password: z.string(),
    patient: z.object({
        name: z.string().min(3, "Name is required"),
        email: z.email(),
    }),
});
const createAdminValidationSchema = z.object({
    password: z.string(),
    admin: z.object({
        name: z.string().min(3, "Name is required"),
        email: z.email(),
        contactNumber: z.string().min(11, "Contact number is required"),
    }),
});
const createDoctorValidationSchema = z.object({
    password: z.string(),
    doctor: z.object({
        name: z.string().min(3, "Name is required"),
        email: z.email(),
        contactNumber: z.string().min(11, "Contact number is required"),
        address: z.string().optional(),
        registrationNumber: z.string().min(5, "Registration number is require"),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number(),
        qualification: z.string(),
        currentWorkingPlace: z.string(),
        designation: z.string(),
    }),
});

export const UserValidations = {
    createDoctorValidationSchema,
    createAdminValidationSchema,
    createPatientValidationSchema,
};
