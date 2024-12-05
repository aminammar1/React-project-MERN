/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

import express from "express";
import {
  signin,
  signup,
  google,
  signout,
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the new user
 *               email:
 *                 type: string
 *                 description: Email address of the new user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the new user
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 *       401:
 *         description: Wrong password
 *       500:
 *         description: Internal server error
 */
router.post("/signin", signin);

router.post("/google", google);

/**
 * @swagger
 * /api/auth/signout:
 *   get:
 *     summary: Sign out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
router.get("/signout", signout);

export default router;
