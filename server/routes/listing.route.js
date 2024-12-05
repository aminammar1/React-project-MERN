/**
 * @swagger
 * tags:
 *   name: Listing
 *   description: Endpoints for managing real estate listings.
 */

import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getSuggestions,
  searchListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/listing/create:
 *   post:
 *     summary: Create a new listing.
 *     tags: [Listing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - address
 *               - regularPrice
 *               - bedrooms
 *               - bathrooms
 *               - type
 *               - userRef
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               regularPrice:
 *                 type: number
 *               discountedPrice:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               furnished:
 *                 type: boolean
 *               parking:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum: [rent, sale]
 *               offer:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               userRef:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listing created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
router.post("/create", verifyToken, createListing);

/**
 * @swagger
 * /api/listing/delete/{id}:
 *   delete:
 *     summary: Delete a listing by ID.
 *     tags: [Listing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the listing to delete.
 *     responses:
 *       401:
 *         description: Unauthorized. Users can only delete their own listings.
 *       200:
 *         description: Listing deleted successfully.
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete/:id", verifyToken, deleteListing);

/**
 * @swagger
 * /api/listing/update/{id}:
 *   patch:
 *     summary: Update a listing by ID.
 *     tags: [Listing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the listing to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               regularPrice:
 *                 type: number
 *               discountedPrice:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               furnished:
 *                 type: boolean
 *               parking:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum: [rent, sale]
 *               offer:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Listing updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/update/:id", verifyToken, updateListing);

/**
 * @swagger
 * /api/listing/getlisting/{id}:
 *   get:
 *     summary: Retrieve a listing by ID.
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the listing to retrieve.
 *     responses:
 *       200:
 *         description: Listing retrieved successfully.
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/getlisting/:id", getListing);

/**
 * @swagger
 * /api/listing/search:
 *   get:
 *     summary: Search for listings.
 *     tags: [Listing]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for listings.
 *       - in: query
 *         name: offer
 *         schema:
 *           type: boolean
 *         description: Filter listings by offer availability.
 *       - in: query
 *         name: furnished
 *         schema:
 *           type: boolean
 *         description: Filter listings by furnished status.
 *       - in: query
 *         name: parking
 *         schema:
 *           type: boolean
 *         description: Filter listings by parking availability.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [rent, sale]
 *         description: Filter by listing type.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of listings to retrieve.
 *     responses:
 *       200:
 *         description: Listings retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/search", searchListings);

/**
 * @swagger
 * /api/listing/getSuggestions:
 *   get:
 *     summary: Get suggested listings.
 *     tags: [Listing]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Term for suggesting listings.
 *     responses:
 *       200:
 *         description: Suggestions retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/getSuggestions", getSuggestions);

export default router;
