import express from "express";
import {
  getUser,
  verifyAdmin,
  verifySuperAdmin,
  deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/profile/:id", verifyToken, getUser);

router.get("/verifyadmin/:id", verifyToken, verifyAdmin);

router.get("/verifysuperadmin/:id", verifyToken, verifySuperAdmin);

router.get("/delete/:id", deleteUser);



export default router;