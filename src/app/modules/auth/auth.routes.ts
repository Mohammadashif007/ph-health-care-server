import express, { NextFunction, Request, Response } from "express";
import { AuthControllers } from "./auth.controllers";

const router = express.Router();

router.post("/login", AuthControllers.userLogin);

export const AuthRoutes = router;
