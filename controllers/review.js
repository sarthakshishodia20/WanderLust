const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=( async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the current user
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview=(async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
});