import { Router } from "express";
import { register, login, logout, me, updateUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", verifyToken, me);
router.put('/update/:id', verifyToken, updateUser);
router.put("/me", verifyToken, updateUser);

export default router;
