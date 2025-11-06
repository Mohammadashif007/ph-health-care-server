import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidations } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    "/create-patient",
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidations.createPatientValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserControllers.createPatient(req, res, next);
    }
);
router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidations.createAdminValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserControllers.createAdmin(req, res, next);
    }
);
router.post(
    "/create-doctor",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidations.createDoctorValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserControllers.createDoctor(req, res, next);
    }
);

router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUsers);

export const UserRoutes = router;
