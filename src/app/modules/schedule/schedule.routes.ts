import express, { NextFunction, Request, Response } from "express";
import { ScheduleControllers } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), ScheduleControllers.insertIntoDB);
router.get(
    "/",
    auth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleControllers.scheduleForDoctor
);
router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    ScheduleControllers.deleteScheduleFromDB
);

export const ScheduleRoutes = router;
