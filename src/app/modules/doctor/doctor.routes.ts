import express from "express";
import { DoctorControllers } from "./doctor.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", DoctorControllers.getAllDoctors);
router.patch("/:id", DoctorControllers.updateIntoDB);
router.post("/", DoctorControllers.getAISuggestions);
router.get('/:id', DoctorControllers.getByIdFromDB);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    DoctorControllers.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    DoctorControllers.softDelete);

export const DoctorRoutes = router;
