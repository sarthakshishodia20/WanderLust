const Listing=require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});


module.exports.index=(async (req, res) => {
    let { search } = req.query;
    let allListings;

    if (search) {
        // Create a case-insensitive search across multiple fields
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("./listings/index.ejs", { allListings, searchQuery: search || '' });
});

module.exports.newRoute=((req, res) => {
    res.render("./listings/new.ejs", { searchQuery: '' });
});

module.exports.createRoute=(async (req, res, next) => {
    // Geocoding basic code
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,",",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
});

module.exports.EditRoute=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_350");
    res.render("./listings/edit.ejs", { listing, originalImageUrl, searchQuery: '' });
});

module.exports.UpdateRoute = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { id } = req.params;

    // Get the original listing to check if location changed
    const originalListing = await Listing.findById(id);

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Update geocoding if location changed
    if (originalListing.location !== req.body.listing.location) {
        try {
            let response = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            }).send();

            if (response.body.features.length > 0) {
                listing.geometry = response.body.features[0].geometry;
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            // Continue without updating coordinates if geocoding fails
        }
    }

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.DeleteRoute=(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
    console.log(deletedListing);
    res.redirect("/listings");
});

module.exports.showRoute=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing, searchQuery: '' });
});