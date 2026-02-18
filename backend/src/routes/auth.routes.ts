import { Router } from "express";
import { loginAdminController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/admin/login", loginAdminController);
