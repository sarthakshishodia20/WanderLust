const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig"); // Corrected Cloudinary import
const upload = multer({ storage }); // Using Cloudinary storage

// Validation middleware
const validateListing = (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Listing data is required");
    }

    // If an image file is present, manually add it to req.body.listing
    if (req.file) {
        req.body.listing.image = { url: req.file.path, filename: req.file.filename };
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};


// New Route
router.get("/new", isLoggedIn, listingController.newRoute);

router.route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // Create Route
    .post(isLoggedIn, upload.single("listing[image][url]"),
     validateListing,
     wrapAsync(listingController.createRoute));

router.route("/:id")
    // Update Route
    .put(isLoggedIn, isOwner,upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.UpdateRoute))
    // Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.DeleteRoute))
    // Show Route
    .get(wrapAsync(listingController.showRoute));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.EditRoute));

module.exports = router;
