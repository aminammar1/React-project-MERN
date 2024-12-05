import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/update/{id}:
 *   post:
 *     summary: Update user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's updated username
 *               email:
 *                 type: string
 *                 description: The user's updated email address
 *               password:
 *                 type: string
 *                 description: The user's updated password (if provided)
 *               avatar:
 *                 type: string
 *                 description: The user's updated avatar URL (if provided)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized. User can only update their own details.
 *       404:
 *         description: User not found
 */
router.post("/update/:id", verifyToken, updateUser);

/**
 * @swagger
 *  /api/user/delete/{id}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized. User can only delete their own account.
 *       404:
 *         description: User not found
 */
router.delete("/delete/:id", verifyToken, deleteUser);

/**
 * @swagger
 *  /api/user/listings/{id}:
 *   get:
 *     summary: Get all listings created by a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose listings are to be retrieved
 *     responses:
 *       200:
 *         description: List of user listings
 *       401:
 *         description: Unauthorized. User can only view their own listings.
 *       404:
 *         description: User not found
 */
router.get("/listings/:id", verifyToken, getUserListings);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get details of a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose details are to be retrieved
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized. User can only view their own details.
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, getUser);

export default router;
