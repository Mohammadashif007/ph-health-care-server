import express from "express";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(
        DoctorScheduleValidation.createDoctorScheduleValidationSchema
    ),
    DoctorScheduleControllers.createDoctorSchedule
);

export const DoctorScheduleRoutes = router;
