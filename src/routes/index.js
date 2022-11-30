import { Router } from "express";
import UserRouter from "./user";

const router = Router();

router.use("/", UserRouter);

export default router;
