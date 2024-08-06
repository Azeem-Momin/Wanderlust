const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');  //means we r using mapbox's sdk geocoding
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner"); //to populate(show) reviews of our listings along with listing
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
    // res.send("done")

    let url = req.file.path;
    let filename = req.file.filename;

    let listing = req.body.listing;
    const newListing = new Listing(listing); //parsing to newListing & there by we get instance       
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;  //this val coming from mapbox
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    console.log(listing)
    console.log(listing.category)
    res.redirect("/listings");
};

module.exports.editNewForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    } else {
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //req.body.listing is object

    if (typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};



// module.exports.getListingsByCategory = async (req, res) => {
//     console.log(res.params);
//     res.send("hi")
// }


// Add this function in your listings controller
// module.exports.filterByCategory = async (req, res, next) => {
//     const { category } = req.params;
//     console.log(category);
    
//     try {
//         const listings = await Listing.find({ category: category });
//         console.log(listings);
        
//         res.render('/listings', { listings });
//     } catch (e) {
//         console.log(e);
//         req.flash('error', 'Cannot find listings');
//         res.redirect('/');
//     }
// };


// module.exports.filterByCategory = async (req, res, next) => {
//     let { category } = req.params;
//     console.log(category);
    
//     // Convert hyphens to spaces and ensure case-insensitivity
//     category = category.replace(/-/g, ' ').toLowerCase();
    
//     try {
//         const listings = await Listing.find({ 'category': new RegExp('^' + category + '$', 'i') });
//         console.log(listings);
        
//         res.render('listings', { listings });
//     } catch (e) {
//         console.log(e);
//         req.flash('error', 'Cannot find listings');
//         res.redirect('/');
//     }
// };


module.exports.filterByCategory = async (req, res, next) => {
    try {
        const listings = await Listing.find({ 'category': 'castles' });
        console.log('Listings found:', listings.length > 0 ? listings : 'None found');
        // res.render('listings', { listings });
        // res.json(, );

    } catch (e) {
        console.log('Error in fetching listings:', e);
        req.flash('error', 'Cannot find listings');
        res.redirect('/');
    }
};
