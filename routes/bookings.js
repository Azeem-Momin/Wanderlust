const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Booking = require('../models/booking');
const Listing = require('../models/listing');

// Create a booking
router.post('/:id/booking', isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const { startDate, endDate } = req.body;

    // Check if the listing is already booked for the given period
    const existingBooking = await Booking.findOne({
        listing: listing._id,
        status: 'active',
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    });

    if (existingBooking) {
        req.flash('error', 'Listing is booked for that period');
        return res.redirect(`/listings/${listing._id}`);
    }

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        startDate,
        endDate
    });
    await booking.save();

    // Add the booking to the listing's bookings array
    listing.bookings.push(booking);
    await listing.save();

    req.flash('success', 'Booking successful!');
    res.redirect(`/listings/${listing._id}`);
});

// Cancel a booking
router.post('/:id/booking/cancel', isLoggedIn, async (req, res) => {
    const booking = await Booking.findOne({
        listing: req.params.id,
        user: req.user._id,
        status: 'active'
    });

    if (booking) {
        booking.status = 'canceled';
        await booking.save();
        req.flash('success', 'Booking canceled successfully!');
    } else {
        req.flash('error', 'No active booking found to cancel');
    }

    res.redirect(`/listings/${req.params.id}`);
});

module.exports = router;